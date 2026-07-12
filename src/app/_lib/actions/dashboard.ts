'use server';

import type {
  InstitutionBillingDashboardDto,
  InstitutionTrendsDashboardDto,
  PlatformOwnerDashboardDto,
  SystemAdminDashboardDto,
} from '../api/schemas';
import { serverFetch } from '../serverFetch.server';

/** Server Actions for SWR refresh paths — initial page data comes from `_lib/data`. */
export async function getSystemAdminDashboard(): Promise<SystemAdminDashboardDto> {
  return serverFetch<SystemAdminDashboardDto>('/Dashboard/system');
}

export async function getInstitutionDashboard(): Promise<InstitutionTrendsDashboardDto> {
  return serverFetch<InstitutionTrendsDashboardDto>('/Dashboard/institution');
}

export async function getPlatformOwnerDashboard(): Promise<PlatformOwnerDashboardDto> {
  return serverFetch<PlatformOwnerDashboardDto>('/Dashboard/platform-owner');
}

export async function getInstitutionBillingDashboard(
  institutionId: string,
): Promise<InstitutionBillingDashboardDto> {
  return serverFetch<InstitutionBillingDashboardDto>(
    `/Dashboard/platform-owner/institution/${encodeURIComponent(institutionId)}`,
  );
}
