'use server';
import { SubjectDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function getAllSubjects(): Promise<SubjectDto[]> {
  return serverFetch(`/Subject`, {
    method: 'GET',
  });
}

export async function createSubject(newSubject: SubjectDto): Promise<any> {
  return serverFetch('/Subject', {
    method: 'POST',
    body: newSubject,
  });
}
