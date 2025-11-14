'use server';
import { InstitutionDto, InstitutionWithAdminDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';
import { PagedResult, PaginationParams } from '../interfaces/pagination';
import {
  DEFAULT_PAGE_SIZE,
  fetchPaginatedResource,
} from '../services/paginationService';

export async function getAllInstitutions(): Promise<InstitutionWithAdminDto[]> {
  return serverFetch<InstitutionWithAdminDto[]>('/institutions', {
    method: 'GET',
  });
}

export async function getInstitutionById(
  id: string
): Promise<InstitutionDto | null> {
  return serverFetch(`/institutions/${id}`, {
    method: 'GET',
  });
}

export async function getInstitutionWithAdmin(
  id: string
): Promise<InstitutionWithAdminDto> {
  return serverFetch<InstitutionWithAdminDto>(`/institutions/${id}/admin`, {
    method: 'GET',
  });
}

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

export async function getInstitutions(
  params?: PaginationParams
): Promise<PagedResult<InstitutionWithAdminDto>> {
  const normalized = normalizePaginationParams(params);
  return fetchPaginatedResource<InstitutionWithAdminDto>(
    '/institutions',
    normalized
  );
}

export async function deleteInstitution(id: string): Promise<void> {
  return serverFetch(`/institutions/${id}`, {
    method: 'DELETE',
  });
}

export async function deactivateInstitution(id: string): Promise<void> {
  return serverFetch(`/institutions/${id}/deactivate`, {
    method: 'PATCH',
  });
}

export async function activateInstitution(id: string): Promise<void> {
  return serverFetch(`/institutions/${id}/reactivate`, {
    method: 'PATCH',
  });
}

export async function createInstitution(institution: InstitutionWithAdminDto) {
  return serverFetch('/institutions/full', {
    method: 'POST',
    body: JSON.stringify(institution),
  });
}

export async function updateInstitutionWithAdmin(
  id: string,
  institution: InstitutionWithAdminDto
) {
  return serverFetch(`/institutions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(institution),
  });
}
