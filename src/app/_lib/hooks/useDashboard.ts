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
    getSystemAdminDashBoard,
  );
}

export function useInstitutionDashboard(
  fallbackData?: InstitutionTrendsDashboardDto,
) {
  return useSWR<InstitutionTrendsDashboardDto>(
    'dashboard-institution',
    getInstitutionDashBoard,
    {
      fallbackData,
      revalidateOnMount: !fallbackData,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}

export function usePlatformOwnerDashboard(
  fallbackData?: PlatformOwnerDashboardDto,
) {
  return useSWR<PlatformOwnerDashboardDto>(
    'dashboard-platform-owner',
    getPlatformOwnerDashboard,
    {
      fallbackData,
      revalidateOnMount: !fallbackData,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}

export function useInstitutionBillingDashboard(
  institutionId?: string,
  fallbackData?: InstitutionBillingDashboardDto,
) {
  return useSWR<InstitutionBillingDashboardDto>(
    institutionId ? ['dashboard-institution-billing', institutionId] : null,
    () => getInstitutionBillingDashboard(institutionId as string),
    {
      fallbackData,
      revalidateOnMount: !fallbackData,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}
