import axios, { type AxiosResponse } from 'axios';
import type { Note, NoteTag } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';

const notehubApi = axios.create({
  baseURL: BASE_URL,
});

notehubApi.interceptors.request.use(config => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  perPage,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params = {
    page,
    perPage,
    ...(search.trim() !== '' && { search: search.trim() }),
  };

  const response: AxiosResponse<FetchNotesResponse> = await notehubApi.get(
    '/notes',
    { params }
  );

  return response.data;
};

export const createNote = async (
  newNote: CreateNotePayload
): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.post(
    '/notes',
    newNote
  );

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.delete(
    `/notes/${noteId}`
  );

  return response.data;
};
