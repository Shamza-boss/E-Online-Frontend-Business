'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { type SubjectDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch.server';
import { getAllSubjects as getAllSubjectsCached } from '../data/subjects';
import { CACHE_TAGS } from '../data/tags';

/** Client-callable read — RSC pages should import from `_lib/data` instead. */
export async function getAllSubjects(): Promise<SubjectDto[]> {
  return getAllSubjectsCached();
}

export async function createSubject(newSubject: SubjectDto): Promise<SubjectDto> {
  const result = await serverFetch<SubjectDto>('/subjects', {
    method: 'POST',
    body: newSubject,
  });
  updateTag(CACHE_TAGS.subjects);
  revalidatePath('/dashboard/management');
  return result;
}
