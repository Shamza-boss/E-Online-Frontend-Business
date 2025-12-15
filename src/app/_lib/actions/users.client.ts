/**
 * Client-safe user actions
 * 
 * These wrappers use clientFetch instead of serverFetch,
 * making them safe to call from client components via SWR or useEffect.
 */

import { clientFetch } from '../services/clientFetch';
import { UserDto } from '../interfaces/types';
import { PaginationParams, PagedResult } from '../interfaces/pagination';
import { DEFAULT_PAGE_SIZE } from '../services/paginationService';

const sanitizeOptionalString = (value?: string | null) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const lower = trimmed.toLowerCase();
  if (lower === 'undefined' || lower === 'null') {
    return undefined;
  }

  return trimmed;
};

const normalizePaginationParams = (
  params?: PaginationParams
): PaginationParams => {
  const safePageNumber =
    params?.pageNumber && params.pageNumber > 0
      ? Math.floor(params.pageNumber)
      : 1;

  const safePageSize =
    params?.pageSize && params.pageSize > 0
      ? Math.floor(params.pageSize)
      : DEFAULT_PAGE_SIZE;

  const normalized: PaginationParams = {
    pageNumber: safePageNumber,
    pageSize: safePageSize,
  };

  const searchTerm = sanitizeOptionalString(params?.searchTerm ?? undefined);
  if (searchTerm) {
    normalized.searchTerm = searchTerm;
  }

  const sortBy = sanitizeOptionalString(params?.sortBy ?? undefined);
  if (sortBy) {
    normalized.sortBy = sortBy;
    normalized.sortDirection =
      params?.sortDirection === 'desc' ? 'desc' : 'asc';
  }

  return normalized;
};

export async function getAllStudentsClient(): Promise<UserDto[]> {
  return clientFetch('/users/students');
}

export async function getUserByIdClient(userId: string): Promise<UserDto> {
  return clientFetch(`/users/${userId}`);
}

export async function getUsersClient(
  params?: PaginationParams
): Promise<PagedResult<UserDto>> {
  const normalized = normalizePaginationParams(params);
  
  const queryParams = new URLSearchParams({
    pageNumber: (normalized.pageNumber ?? 1).toString(),
    pageSize: (normalized.pageSize ?? DEFAULT_PAGE_SIZE).toString(),
  });

  if (normalized.searchTerm) {
    queryParams.append('searchTerm', normalized.searchTerm);
  }

  if (normalized.sortBy) {
    queryParams.append('sortBy', normalized.sortBy);
    queryParams.append('sortDirection', normalized.sortDirection || 'asc');
  }

  return clientFetch(`/users?${queryParams.toString()}`);
}

export async function createUserClient(user: UserDto): Promise<UserDto[]> {
  return clientFetch('/users', {
    method: 'POST',
    body: user,
  });
}

export async function updateUserClient(user: UserDto): Promise<void> {
  return clientFetch(`/users/${user.userId}`, {
    method: 'PUT',
    body: user,
  });
}

export async function deleteUserClient(userId: string): Promise<void> {
  return clientFetch(`/users/${userId}`, {
    method: 'DELETE',
  });
}

