'use server';

import { PaginationParams, PagedResult } from '../interfaces/pagination';
import { UserDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';
import {
  DEFAULT_PAGE_SIZE,
  fetchPaginatedResource,
} from '../services/paginationService';

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

export async function createUser(user: UserDto) {
  return serverFetch<UserDto[]>(`/users`, {
    method: 'POST',
    body: user,
  });
}

export async function deleteUser(userId: string) {
  return serverFetch<void>(`/users/${userId}`, {
    method: 'DELETE',
  });
}

export async function getAllStudents() {
  return serverFetch<UserDto[]>(`/users/students`);
}

export async function getUsers(
  params?: PaginationParams
): Promise<PagedResult<UserDto>> {
  const normalized = normalizePaginationParams(params);
  return fetchPaginatedResource<UserDto>('/users', normalized);
}

export async function updateUser(user: UserDto) {
  return serverFetch(`/users/${user.userId}`, {
    method: 'PUT',
    body: user,
  });
}
