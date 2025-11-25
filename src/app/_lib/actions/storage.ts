'use server';

import { hashFile } from '../common/functions';
import { UploadResult } from '../interfaces/types';
import { serverFetch } from '../serverFetch';
import { FileDto } from '../interfaces/types';
export interface RegisterRepositoryFilePayload {
  fileKey: string;
  url: string;
  hash: string;
  isPublic: boolean;
  institutionId?: string;
}

function ensureFile(formData: FormData): File {
  const candidate = formData.get('file');
  if (!(candidate instanceof File)) {
    throw new Error('No file provided for upload.');
  }
  return candidate;
}

async function uploadFileToStorage(formData: FormData): Promise<UploadResult> {
  const file = ensureFile(formData);
  const hash = await hashFile(file);

  const form = new FormData();
  form.append('file', file);
  form.append('hash', hash);

  // 3️⃣ call your API proxy
  const result = await serverFetch<{
    key: string;
    proxyDownload: string;
    presignedGet: string;
    hash: string;
  }>('storage/upload', {
    method: 'POST',
    body: form,
  });

  // 4️⃣ return it straight through
  return {
    key: result.key,
    proxyDownload: result.proxyDownload,
    presignedGet: result.presignedGet,
    hash: result.hash,
  };
}

export async function uploadTextbook(formData: FormData): Promise<UploadResult> {
  return uploadFileToStorage(formData);
}

export async function uploadPdfAsset(formData: FormData): Promise<UploadResult> {
  return uploadFileToStorage(formData);
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
