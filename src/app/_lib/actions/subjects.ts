'use server';

import { revalidatePath } from 'next/cache';
import { type SubjectDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch.server';
import { CACHE_TAGS } from '../data/tags';

export async function getAllSubjects(): Promise<SubjectDto[]> {
  return serverFetch<SubjectDto[]>('/subjects', {
    method: 'GET',
    tags: [CACHE_TAGS.subjects],
    revalidate: 300,
  });
}

export async function createSubject(newSubject: SubjectDto): Promise<SubjectDto> {
  const result = await serverFetch<SubjectDto>('/subjects', {
    method: 'POST',
    body: newSubject,
  });
  revalidatePath('/dashboard/management');
  return result;
}
