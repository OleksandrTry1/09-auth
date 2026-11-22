import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import { nextServer } from "./api";
import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";

interface CheckSessionResponse {
  success: boolean;
}

const getAuthHeaders = async (): Promise<{ Cookie: string }> => {
  const cookieStore = await cookies();

  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async ({
  page,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      search: search || undefined,
      tag,
    },
    headers: await getAuthHeaders(),
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: await getAuthHeaders(),
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await nextServer.get<User>("/users/me", {
    headers: await getAuthHeaders(),
  });

  return response.data;
};

export const checkSession = async (): Promise<
  AxiosResponse<CheckSessionResponse>
> => {
  return nextServer.get<CheckSessionResponse>("/auth/session", {
    headers: await getAuthHeaders(),
  });
};
