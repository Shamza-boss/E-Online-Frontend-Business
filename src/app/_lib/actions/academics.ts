'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { type AcademicLevelDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch.server';
import { getAllAcademics as getAllAcademicsCached } from '../data/academics';
import { CACHE_TAGS } from '../data/tags';

/** Client-callable read — RSC pages should import from `_lib/data` instead. */
export async function getAllAcademics(): Promise<AcademicLevelDto[]> {
  return getAllAcademicsCached();
}

export async function createAcademics(
  newAcademics: AcademicLevelDto,
): Promise<AcademicLevelDto> {
  const result = await serverFetch<AcademicLevelDto>('/academicLevel', {
    method: 'POST',
    body: newAcademics,
  });
  updateTag(CACHE_TAGS.academics);
  revalidatePath('/dashboard/management');
  return result;
}
