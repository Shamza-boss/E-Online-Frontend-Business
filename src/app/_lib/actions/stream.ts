'use server';
import {
  CreateUploadDto,
  VideoUploadResponse,
  VideoMetaResponse,
} from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function createDirectUpload(
  uploadData: CreateUploadDto
): Promise<VideoUploadResponse> {
  return serverFetch<VideoUploadResponse>('/stream/direct-upload', {
    method: 'POST',
    body: uploadData,
  });
}

export async function getVideoMeta(uid: string): Promise<VideoMetaResponse> {
  return serverFetch<VideoMetaResponse>(
    `/stream/video-meta?uid=${encodeURIComponent(uid)}`
  );
}

export async function signPlayback(
  uid: string
): Promise<{ iframeSrc: string }> {
  return serverFetch<{ iframeSrc: string }>(
    `/stream/sign-playback?uid=${encodeURIComponent(uid)}`
  );
}
