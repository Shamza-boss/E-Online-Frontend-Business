import {
  InstitutionBillingDashboardDto,
  InstitutionTrendsDashboardDto,
  PlatformOwnerDashboardDto,
  SystemAdminDashboardDto,
} from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function getSystemAdminDashBoard(): Promise<SystemAdminDashboardDto> {
  return serverFetch<SystemAdminDashboardDto>(`/Dashboard/system`);
}

export async function getInstitutionDashBoard(): Promise<InstitutionTrendsDashboardDto> {
  return serverFetch<InstitutionTrendsDashboardDto>(`/Dashboard/institution`);
}

export async function getPlatformOwnerDashboard(): Promise<PlatformOwnerDashboardDto> {
  return serverFetch<PlatformOwnerDashboardDto>(`/Dashboard/platform-owner`);
}

export async function getInstitutionBillingDashboard(
  institutionId: string
): Promise<InstitutionBillingDashboardDto> {
  return serverFetch<InstitutionBillingDashboardDto>(
    `/Dashboard/platform-owner/institution/${encodeURIComponent(institutionId)}`
  );
}
