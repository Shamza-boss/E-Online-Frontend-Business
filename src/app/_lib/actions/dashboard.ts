import {
  InstitutionTrendsDashboardDto,
  SystemAdminDashboardDto,
} from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function getSystemAdminDashBoard(): Promise<SystemAdminDashboardDto> {
  return serverFetch<SystemAdminDashboardDto>(`/Dashboard/system`);
}

export async function getInstitutionDashBoard(): Promise<InstitutionTrendsDashboardDto> {
  return serverFetch<InstitutionTrendsDashboardDto>(`/Dashboard/institution`);
}
