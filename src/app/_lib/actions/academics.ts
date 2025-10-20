'use server';

import { AcademicLevelDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function getAllAcademics(): Promise<AcademicLevelDto[]> {
  return serverFetch<AcademicLevelDto[]>('/academicLevel');
}

export async function createAcademics(
  newAcademics: AcademicLevelDto
): Promise<any> {
  return serverFetch('/academicLevel', {
    method: 'POST',
    body: newAcademics,
  });
}
