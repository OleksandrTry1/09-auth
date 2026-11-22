"use client";

import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import type { CreateNoteParams } from "@/lib/api/clientApi";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { initialDraft, useNoteStore } from "@/lib/store/noteStore";
import { NOTE_TAGS } from "@/types/note";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  // The draft is stored in localStorage, so the server render cannot know it.
  // While hydrating we show the initial draft to match the server HTML, then
  // the form is remounted (see the key below) with the saved values.
  const isClient = useIsClient();
  const values = isClient ? draft : initialDraft;

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
  });

  const handleChange = (event: ChangeEvent<FieldElement>) => {
    setDraft({ ...draft, [event.target.name]: event.target.value });
  };

  const handleSubmit = (formData: FormData) => {
    const note: CreateNoteParams = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as NoteTag,
    };

    mutate(note);
  };

  const handleCancel = () => router.back();

  return (
    <form
      key={isClient ? "client" : "server"}
      className={css.form}
      action={handleSubmit}
    >
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={values.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={values.content}
          onChange={handleChange}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={values.tag}
          onChange={handleChange}
        >
          {NOTE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {isError && (
        <span className={css.error}>
          Failed to create note. Please try again.
        </span>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
