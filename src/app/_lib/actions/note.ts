'use server';
import { redirect } from 'next/navigation';
import { NoteDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';
import { auth } from '@/auth';

interface GetNoteByClassroomProps {
  classId: string;
  noteDate: string;
}

async function requireSession() {
  const session = await auth();
  if (!session?.user.id) redirect('/signin');
  return session;
}

export async function getNoteByClassroomId({
  classId,
  noteDate,
}: GetNoteByClassroomProps): Promise<NoteDto> {
  const session = await auth();

  if (session?.user.id === undefined) {
    redirect('/signin');
  }

  return serverFetch(
    `/Note/${classId}?userId=${encodeURIComponent(session.user.id)}&noteDate=${encodeURIComponent(noteDate)}`,
    {
      method: 'GET',
    }
  );
}

export async function updateNoteById(note: NoteDto) {
  return serverFetch(`/Note/${note.id}`, {
    method: 'PUT',
    body: note,
  });
}

export async function getNoteChain(
  classId: string,
  baseDate?: string // yyyy-MM-dd (UTC) or undefined ⇒ today
): Promise<NoteDto[]> {
  const session = await requireSession();
  const qs =
    `classroomId=${encodeURIComponent(classId)}` +
    `&userId=${encodeURIComponent(session.user.id)}` +
    (baseDate ? `&baseDate=${baseDate}` : '');
  return serverFetch(`/Note/chain?${qs}`, { method: 'GET' });
}

// 1-C  – list of existing note dates for the student --------------------
export async function getNoteDatesForStudent(
  classId: string
): Promise<string[]> {
  const session = await requireSession();
  return serverFetch(`/Note/${classId}/dates?userId=${session.user.id}`, {
    method: 'GET',
  });
}

// 1-D  – continue a chosen slice ---------------------------------------
export async function continueNote(noteId: string): Promise<NoteDto[]> {
  return serverFetch(`/Note/${noteId}/continue`, { method: 'POST' });
}

// lib/actions/note.ts
export async function getNoteSlice(
  classId: string,
  dateIso: string
): Promise<NoteDto | null> {
  const session = await requireSession();
  const qs = `classroomId=${classId}&userId=${session.user.id}&date=${dateIso}`;
  return serverFetch(`/Note/slice?${qs}`, { method: 'GET' });
}
