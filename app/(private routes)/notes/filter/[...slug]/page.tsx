import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";
import { NOTE_TAGS } from "@/types/note";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async ({
  params,
}: NotesProps): Promise<Metadata> => {
  const { slug } = await params;
  const filter = slug[0];

  const title =
    filter === "all"
      ? "All notes | NoteHub"
      : `Notes tagged "${filter}" | NoteHub`;
  const description =
    filter === "all"
      ? "Browse all your notes in NoteHub."
      : `Browse your notes filtered by the "${filter}" tag in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/filter/${slug.join("/")}`,
      images: [OG_IMAGE],
    },
  };
};

const isNoteTag = (value: string): value is NoteTag =>
  (NOTE_TAGS as readonly string[]).includes(value);

const getTag = (filter: string): NoteTag | undefined => {
  if (filter === "all") {
    return undefined;
  }

  if (isNoteTag(filter)) {
    return filter;
  }

  notFound();
};

const Notes = async ({ params }: NotesProps) => {
  const { slug } = await params;
  const tag = getTag(slug[0]);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, 1, ""],
    queryFn: () => fetchNotes({ page: 1, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag ?? "all"} tag={tag} />
    </HydrationBoundary>
  );
};

export default Notes;
