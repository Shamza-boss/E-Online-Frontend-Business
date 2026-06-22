'use server';
import {
  CreateUploadDto,
  VideoUploadResponse,
  VideoMetaResponse,
  VideoLibraryItem,
} from '../interfaces/types';
import { PagedResult } from '../interfaces/pagination';
import { serverFetch } from '../serverFetch';

export interface InstitutionVideosParams {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

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

export async function getInstitutionVideos(
  params: InstitutionVideosParams = {}
): Promise<PagedResult<VideoLibraryItem>> {
  const query = new URLSearchParams();
  if (params.searchTerm?.trim()) {
    query.set('searchTerm', params.searchTerm.trim());
  }
  if (params.pageNumber) {
    query.set('pageNumber', String(params.pageNumber));
  }
  if (params.pageSize) {
    query.set('pageSize', String(params.pageSize));
  }
  const qs = query.toString();
  return serverFetch<PagedResult<VideoLibraryItem>>(
    `/stream/videos${qs ? `?${qs}` : ''}`
  );
}
