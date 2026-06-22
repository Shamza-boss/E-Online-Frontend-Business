'use server';

import { serverFetch } from '../serverFetch';
import { FileDto, LibraryFileDto } from '../interfaces/types';
import { PagedResult, PaginationParams } from '../interfaces/pagination';

export interface RegisterRepositoryFilePayload {
  fileKey: string;
  url: string;
  hash: string;
  isPublic: boolean;
  institutionId?: string;
  fileName?: string;
  fileSizeBytes?: number;
}

export interface LibraryQueryParams extends PaginationParams {
  academicLevelId?: string;
  classroomId?: string;
  isPublic?: boolean;
  unlinkedOnly?: boolean;
}

function buildLibraryQueryString(params: LibraryQueryParams): string {
  const query = new URLSearchParams();

  if (params.pageNumber) {
    query.set('pageNumber', params.pageNumber.toString());
  }
  if (params.pageSize) {
    query.set('pageSize', params.pageSize.toString());
  }
  if (params.searchTerm?.trim()) {
    query.set('searchTerm', params.searchTerm.trim());
  }
  if (params.sortBy) {
    query.set('sortBy', params.sortBy);
    if (params.sortDirection) {
      query.set('sortDirection', params.sortDirection);
    }
  }
  if (params.academicLevelId) {
    query.set('academicLevelId', params.academicLevelId);
  }
  if (params.classroomId) {
    query.set('classroomId', params.classroomId);
  }
  if (params.isPublic !== undefined) {
    query.set('isPublic', String(params.isPublic));
  }
  if (params.unlinkedOnly) {
    query.set('unlinkedOnly', 'true');
  }

  return query.toString();
}

export async function getRepositoryFiles(): Promise<FileDto[]> {
  return serverFetch<FileDto[]>('/storage/files');
}

export async function getRepositoryFilesPaged(
  params: LibraryQueryParams = {}
): Promise<PagedResult<LibraryFileDto>> {
  const query = buildLibraryQueryString({
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 20,
    sortBy: params.sortBy ?? 'uploadedAt',
    sortDirection: params.sortDirection ?? 'desc',
    ...params,
  });
  return serverFetch<PagedResult<LibraryFileDto>>(`/storage/files?${query}`);
}

export async function getRepositoryFileById(
  fileId: string
): Promise<LibraryFileDto> {
  return serverFetch<LibraryFileDto>(`/storage/files/${fileId}`);
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
