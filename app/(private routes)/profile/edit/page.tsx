"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateMe } from "@/lib/api/clientApi";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

const EditProfile = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Loading, please wait...</p>
      </main>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setError("");
    setIsPending(true);

    try {
      const updatedUser = await updateMe({
        email: user.email,
        username: formData.get("username") as string,
      });

      setUser(updatedUser);
      router.push("/profile");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setIsPending(false);
    }
  };

  const handleCancel = () => router.back();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              name="username"
              className={css.input}
              defaultValue={user.username}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isPending}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfile;
