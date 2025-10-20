'use server';
import { SubjectDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function getAllSubjects(): Promise<SubjectDto[]> {
  return serverFetch(`/subjects`, {
    method: 'GET',
  });
}

export async function createSubject(newSubject: SubjectDto): Promise<any> {
  return serverFetch('/subjects', {
    method: 'POST',
    body: newSubject,
  });
}
