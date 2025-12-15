'use client';

import { hashFile } from '../common/functions';
import type { UploadResult } from '../interfaces/types';

interface StorageUploadResponse {
  key: string;
  proxyDownload: string;
  presignedGet: string;
  hash: string;
}

async function postToStorage(
  formData: FormData
): Promise<StorageUploadResponse> {
  const response = await fetch('/api/proxy/storage/upload', {
    method: 'POST',
    body: formData,
    cache: 'no-store',
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Storage upload failed.');
  }

  return response.json();
}

async function uploadFile(file: File): Promise<UploadResult> {
  const hash = await hashFile(file);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('hash', hash);

  const result = await postToStorage(formData);
  return {
    key: result.key,
    proxyDownload: result.proxyDownload,
    presignedGet: result.presignedGet,
    hash: result.hash,
  };
}

export async function uploadTextbook(file: File): Promise<UploadResult> {
  return uploadFile(file);
}

export async function uploadPdfAsset(file: File): Promise<UploadResult> {
  return uploadFile(file);
}
