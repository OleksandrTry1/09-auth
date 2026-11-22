import axios, { type AxiosResponse } from "axios";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";

interface CheckSessionResponse {
  message: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const getAuthHeaders = async (): Promise<{ Cookie: string }> => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async ({ page, search, tag }: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: { page, search: search || undefined, tag },
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me", {
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const checkSession = async (): Promise<AxiosResponse<CheckSessionResponse>> => {
  return api.get<CheckSessionResponse>("/auth/session", {
    headers: await getAuthHeaders(),
  });
};
