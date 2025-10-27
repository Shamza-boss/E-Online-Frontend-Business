import { serverFetch } from '../serverFetch';
import { PagedResult, PaginationParams } from '../interfaces/pagination';

export const DEFAULT_PAGE_SIZE = 20;

type NormalizedPaginationParams = {
  pageNumber: number;
  pageSize: number;
  sortDirection: 'asc' | 'desc';
  searchTerm?: string;
  sortBy?: string;
};

const coerceParams = (
  params: PaginationParams = {}
): NormalizedPaginationParams => {
  const {
    pageNumber = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    searchTerm,
    sortBy,
    sortDirection = 'asc',
  } = params;

  return {
    pageNumber,
    pageSize,
    searchTerm,
    sortBy,
    sortDirection,
  };
};

const buildQueryString = (params: NormalizedPaginationParams) => {
  const query = new URLSearchParams();

  if (params.pageNumber) {
    query.set('pageNumber', params.pageNumber.toString());
  }
  if (params.pageSize) {
    query.set('pageSize', params.pageSize.toString());
  }
  if (params.searchTerm) {
    query.set('searchTerm', params.searchTerm.trim());
  }
  if (params.sortBy) {
    query.set('sortBy', params.sortBy);
    if (params.sortDirection) {
      query.set('sortDirection', params.sortDirection);
    }
  }

  return query.toString();
};

export async function fetchPaginatedResource<T>(
  resource: string,
  params: PaginationParams = {}
): Promise<PagedResult<T>> {
  const normalizedResource = resource.startsWith('/')
    ? resource
    : `/${resource}`;
  const normalizedParams = coerceParams(params);
  const query = buildQueryString(normalizedParams);
  const endpoint = query
    ? `${normalizedResource}?${query}`
    : normalizedResource;

  return serverFetch<PagedResult<T>>(endpoint);
}
