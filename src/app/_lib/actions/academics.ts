'use server';

import { revalidatePath } from 'next/cache';
import { type AcademicLevelDto } from '../interfaces/types';
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
): Promise<AcademicLevelDto> {
  const result = await serverFetch<AcademicLevelDto>('/academicLevel', {
    method: 'POST',
    body: newAcademics,
  });
  revalidatePath('/dashboard/management');
  return result;
}
