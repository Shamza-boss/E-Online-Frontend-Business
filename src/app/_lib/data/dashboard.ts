import 'server-only';

import { cache } from 'react';
import type {
  InstitutionBillingDashboardDto,
  InstitutionTrendsDashboardDto,
  PlatformOwnerDashboardDto,
  SystemAdminDashboardDto,
} from '../api/schemas';
import { serverFetch } from '../serverFetch.server';
import { CACHE_TAGS } from './tags';

export const getSystemAdminDashboard = cache(
  async (): Promise<SystemAdminDashboardDto> => {
    return serverFetch<SystemAdminDashboardDto>('/Dashboard/system', {
      tags: [CACHE_TAGS.dashboard],
    });
  },
);

export const getInstitutionDashboard = cache(
  async (): Promise<InstitutionTrendsDashboardDto> => {
    return serverFetch<InstitutionTrendsDashboardDto>('/Dashboard/institution', {
      tags: [CACHE_TAGS.dashboard, CACHE_TAGS.dashboardInstitution],
    });
  },
);

export const getPlatformOwnerDashboard = cache(
  async (): Promise<PlatformOwnerDashboardDto> => {
    return serverFetch<PlatformOwnerDashboardDto>('/Dashboard/platform-owner', {
      tags: [CACHE_TAGS.dashboard, CACHE_TAGS.dashboardPlatform],
    });
  },
);

export const getInstitutionBillingDashboard = cache(
  async (institutionId: string): Promise<InstitutionBillingDashboardDto> => {
    return serverFetch<InstitutionBillingDashboardDto>(
      `/Dashboard/platform-owner/institution/${encodeURIComponent(institutionId)}`,
      { tags: [CACHE_TAGS.dashboard, CACHE_TAGS.dashboardPlatform] },
    );
  },
);
