'use server';

import { hashFile } from '../common/functions';
import { UploadResult } from '../interfaces/types';
import { serverFetch } from '../serverFetch';

async function uploadFileToStorage(file: File): Promise<UploadResult> {
  // 1️⃣ compute the hash
  const hash = await hashFile(file);

  // 2️⃣ build the form
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

export async function uploadTextbook(file: File): Promise<UploadResult> {
  return uploadFileToStorage(file);
}

export async function uploadPdfAsset(file: File): Promise<UploadResult> {
  return uploadFileToStorage(file);
}
