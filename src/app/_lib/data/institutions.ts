import 'server-only';

import { cache } from 'react';
import type { InstitutionWithAdminDto } from '../interfaces/types';
import type { PagedResult } from '../interfaces/pagination';
import { serverFetch } from '../serverFetch.server';
import { fetchPaginatedResource } from '../services/paginationService';

export const getAllInstitutionsList = cache(
  async (): Promise<InstitutionWithAdminDto[]> => {
    return serverFetch<InstitutionWithAdminDto[]>('/institutions', {
      method: 'GET',
    });
  },
);

export const getInstitutionsPage = cache(
  async (): Promise<PagedResult<InstitutionWithAdminDto>> => {
    return fetchPaginatedResource<InstitutionWithAdminDto>('/institutions', {
      pageNumber: 1,
      pageSize: 20,
    });
  },
);
