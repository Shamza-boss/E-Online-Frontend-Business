'use server';

import { AcademicLevelDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function getAllAcademics(): Promise<AcademicLevelDto[]> {
  return serverFetch<AcademicLevelDto[]>('/AcademicLevel');
}

export async function createAcademics(
  newAcademics: AcademicLevelDto
): Promise<any> {
  return serverFetch('/AcademicLevel', {
    method: 'POST',
    body: newAcademics,
  });
}
