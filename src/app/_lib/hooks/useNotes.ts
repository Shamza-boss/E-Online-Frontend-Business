'use client';
import useSWR, { mutate as globalMutate } from 'swr';
import {
  deleteNoteById,
  getNotesForClassroom,
  getOrCreateNoteByClassroomId,
  updateNoteById,
  UpdateNotePayload,
} from '../actions/notes';
import type { NoteDto } from '../interfaces/types';

const emptyNoteList: NoteDto[] = [];

export function useClassroomNote(classId?: string) {
  const key = classId ? ['classroom-note', classId] : null;

  const swr = useSWR<NoteDto | null>(key, () =>
    classId ? getOrCreateNoteByClassroomId(classId) : Promise.resolve(null)
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
  return useSWR<NoteDto[]>(key, () =>
    classId ? getNotesForClassroom(classId) : Promise.resolve(emptyNoteList)
  );
}

export async function deleteNote(noteId: string, classId?: string) {
  await deleteNoteById(noteId);
  if (classId) {
    await globalMutate(['classroom-notes', classId]);
  }
}
