import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import { nextServer } from "./api";

export interface FetchNotesParams {
  page: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateMeRequest {
  email: string;
  username: string;
}

interface CheckSessionResponse {
  success: boolean;
}

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
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`);

  return response.data;
};

export const createNote = async (note: CreateNoteParams): Promise<Note> => {
  const response = await nextServer.post<Note>("/notes", note);

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);

  return response.data;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/register", data);

  return response.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/login", data);

  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  await nextServer.get("/auth/session");

  return true;
};

export const getMe = async (): Promise<User> => {
  const response = await nextServer.get<User>("/users/me");

  return response.data;
};

export const updateMe = async (data: UpdateMeRequest): Promise<User> => {
  const response = await nextServer.patch<User>("/users/me", data);

  return response.data;
};
