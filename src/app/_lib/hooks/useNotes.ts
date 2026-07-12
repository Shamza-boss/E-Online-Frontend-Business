'use client';
import useSWR, { mutate as globalMutate } from 'swr';
import {
  deleteNoteById,
  getNotesForClassroom,
  getOrCreateNoteByClassroomId,
  updateNoteById,
  type UpdateNotePayload,
} from '../actions/notes';
import type { NoteDto } from '../interfaces/types';

const emptyNoteList: NoteDto[] = [];

export function useClassroomNote(classId?: string) {
  const key = classId ? ['classroom-note', classId] : null;

  const swr = useSWR<NoteDto | null>(
    key,
    () => (classId ? getOrCreateNoteByClassroomId(classId) : Promise.resolve(null)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 1, // Only retry once on error
      shouldRetryOnError: false, // Don't retry indefinitely
      dedupingInterval: 60000, // Cache for 1 minute
      focusThrottleInterval: 300000, // Don't revalidate on focus within 5 minutes
      onError: (error) => {
        console.warn('Failed to load classroom note:', error);
      },
    }
  );

  const saveNote = async (payload: UpdateNotePayload) => {
    if (!swr.data?.id) return undefined;
    const optimistic: NoteDto = {
      ...swr.data,
      title: payload.title ?? swr.data.title,
      content: payload.content ?? swr.data.content,
      updatedAt: new Date().toISOString(),
    };

    return swr.mutate(
      (async () =>
        updateNoteById(swr.data!.id, {
          title: optimistic.title,
          content: optimistic.content,
        }))(),
      {
        optimisticData: optimistic,
        rollbackOnError: true,
        revalidate: false,
        populateCache: true,
      }
    );
  };

  return { ...swr, saveNote };
}

export function useClassroomNotesForTeacher(classId?: string) {
  const key = classId ? ['classroom-notes', classId] : null;
  return useSWR<NoteDto[]>(
    key,
    () => (classId ? getNotesForClassroom(classId) : Promise.resolve(emptyNoteList)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 1,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
      onError: (error) => {
        console.warn('Failed to load classroom notes for teacher:', error);
      },
    }
  );
}

export async function deleteNote(noteId: string, classId?: string) {
  await deleteNoteById(noteId);
  if (classId) {
    await globalMutate(['classroom-notes', classId]);
  }
}
