'use server';

import { serverFetch } from '../serverFetch';
import { FileDto } from '../interfaces/types';
export interface RegisterRepositoryFilePayload {
  fileKey: string;
  url: string;
  hash: string;
  isPublic: boolean;
  institutionId?: string;
}

export async function getRepositoryFiles(): Promise<FileDto[]> {
  return serverFetch<FileDto[]>('/storage/files');
}

export async function registerRepositoryFile(
  payload: RegisterRepositoryFilePayload
): Promise<FileDto> {
  return serverFetch<FileDto>('/storage/files/register', {
    method: 'POST',
    body: payload,
  });
}

export async function toggleRepositoryFileVisibility(
  fileId: string
): Promise<void> {
  await serverFetch(`/storage/files/${fileId}/toggle-public`, {
    method: 'PATCH',
  });
}
