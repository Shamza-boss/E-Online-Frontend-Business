'use server';

import { revalidatePath } from 'next/cache';
import { AcademicLevelDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch.server';
import { CACHE_TAGS } from '../data/tags';

export async function getAllAcademics(): Promise<AcademicLevelDto[]> {
  return serverFetch<AcademicLevelDto[]>('/academicLevel', {
    tags: [CACHE_TAGS.academics],
    revalidate: 300,
  });
}

export async function createAcademics(
  newAcademics: AcademicLevelDto,
): Promise<unknown> {
  const result = await serverFetch('/academicLevel', {
    method: 'POST',
    body: newAcademics,
  });
  revalidatePath('/dashboard/management');
  return result;
}
