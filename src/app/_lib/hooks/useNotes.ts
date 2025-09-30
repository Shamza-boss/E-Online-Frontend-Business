'use client';
import useSWR, { mutate as globalMutate } from 'swr';
import {
  getNoteChain,
  continueNote,
  getNoteDatesForStudent,
  updateNoteById,
  getNoteSlice,
} from '../actions/note';
import type { NoteDto } from '../interfaces/types';
import dayjs from 'dayjs';

export function useNoteChain(classId?: string, baseDateIso?: string) {
  const todayIso = dayjs().format('YYYY-MM-DD');
  const anchorIso = baseDateIso ?? todayIso;
  const key = classId ? ['note-chain', classId, anchorIso] : null;

  const swr = useSWR<NoteDto[]>(key, () =>
    classId ? getNoteChain(classId, anchorIso) : Promise.resolve([])
  );

  const updateSlice = async (note: NoteDto) => {
    await updateNoteById(note);
    if (swr.data)
      globalMutate(
        key,
        swr.data.map((n) => (n.id === note.id ? { ...n, ...note } : n)),
        false
      );
  };

  return { ...swr, updateSlice };
}

export function useNoteSlice(
  classId: string | undefined,
  dateIso: string | undefined
) {
  const key = classId && dateIso ? ['note-slice', classId, dateIso] : null;
  return useSWR<NoteDto | null>(key, () =>
    classId && dateIso ? getNoteSlice(classId, dateIso) : Promise.resolve(null)
  );
}

export function useNoteDates(classId?: string) {
  const key = classId ? ['note-dates', classId] : null;
  return useSWR<string[]>(key, () =>
    classId ? getNoteDatesForStudent(classId) : Promise.resolve([])
  );
}
