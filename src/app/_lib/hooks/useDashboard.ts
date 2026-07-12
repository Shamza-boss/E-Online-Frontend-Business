import useSWR from 'swr';
import {
  getSystemAdminDashboard,
  getInstitutionDashboard,
  getPlatformOwnerDashboard,
  getInstitutionBillingDashboard,
} from '../actions/dashboard';
import {
  type SystemAdminDashboardDto,
  type InstitutionTrendsDashboardDto,
  type PlatformOwnerDashboardDto,
  type InstitutionBillingDashboardDto,
} from '../api/schemas';
import { swrKeys } from '../config/swrKeys';

export function useSystemDashboard() {
  return useSWR<SystemAdminDashboardDto>(
    swrKeys.dashboardSystem,
    getSystemAdminDashboard,
  );
}

export function useInstitutionDashboard(
  fallbackData?: InstitutionTrendsDashboardDto,
) {
  return useSWR<InstitutionTrendsDashboardDto>(
    swrKeys.dashboardInstitution,
    getInstitutionDashboard,
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
    swrKeys.dashboardPlatformOwner,
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
    institutionId
      ? swrKeys.dashboardInstitutionBilling(institutionId)
      : null,
    () => getInstitutionBillingDashboard(institutionId as string),
    {
      fallbackData,
      revalidateOnMount: !fallbackData,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}
