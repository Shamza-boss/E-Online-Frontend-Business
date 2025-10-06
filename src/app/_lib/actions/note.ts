'use server';
import { redirect } from 'next/navigation';
import { NoteDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';
import { auth } from '@/auth';

export interface UpdateNotePayload {
  title?: string;
  content?: string;
}

async function requireSession() {
  const session = await auth();
  if (!session?.user.id) redirect('/signin');
  return session;
}

export async function getOrCreateNoteByClassroomId(
  classId: string
): Promise<NoteDto> {
  const session = await requireSession();
  return serverFetch(
    `/Note/${classId}?userId=${encodeURIComponent(session.user.id)}`,
    {
      method: 'GET',
    }
  );
}

export async function updateNoteById(
  noteId: string,
  payload: UpdateNotePayload
): Promise<NoteDto> {
  return serverFetch(`/Note/${noteId}`, {
    method: 'PUT',
    body: payload,
  });
}

export async function getNotesForClassroom(
  classId: string
): Promise<NoteDto[]> {
  const session = await requireSession();
  return serverFetch(
    `/Note/${classId}/teacher/notes?teacherId=${encodeURIComponent(session.user.id)}`,
    {
      method: 'GET',
    }
  );
}

export async function deleteNoteById(noteId: string): Promise<void> {
  const session = await requireSession();
  await serverFetch(
    `/Note/${noteId}?userId=${encodeURIComponent(session.user.id)}`,
    {
      method: 'DELETE',
    }
  );
}
