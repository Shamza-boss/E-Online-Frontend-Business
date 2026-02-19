import useSWR from 'swr';
import {
  getSystemAdminDashBoard,
  getInstitutionDashBoard,
  getPlatformOwnerDashboard,
  getInstitutionBillingDashboard,
} from '../actions/dashboard';
import {
  SystemAdminDashboardDto,
  InstitutionTrendsDashboardDto,
  PlatformOwnerDashboardDto,
  InstitutionBillingDashboardDto,
} from '../interfaces/types';

export function useSystemDashboard() {
  return useSWR<SystemAdminDashboardDto>(
    'dashboard-system',
    getSystemAdminDashBoard
  );
}

export function useInstitutionDashboard() {
  return useSWR<InstitutionTrendsDashboardDto>(
    'dashboard-institution',
    getInstitutionDashBoard
  );
}

export function usePlatformOwnerDashboard() {
  return useSWR<PlatformOwnerDashboardDto>(
    'dashboard-platform-owner',
    getPlatformOwnerDashboard,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  );
}

export function useInstitutionBillingDashboard(institutionId?: string) {
  return useSWR<InstitutionBillingDashboardDto>(
    institutionId
      ? ['dashboard-institution-billing', institutionId]
      : null,
    () => getInstitutionBillingDashboard(institutionId as string),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  );
}
