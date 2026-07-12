export type PaginationParams = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export type PagedResult<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
