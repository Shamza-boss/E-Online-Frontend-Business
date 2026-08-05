import useSWR from 'swr';
import {
  getSystemAdminDashboard,
  getInstitutionDashboard,
  getPlatformOwnerDashboard,
  getInstitutionBillingDashboard,
  getInstructorHomeDashboard,
  getTraineeHomeDashboard,
  getAdminInsight,
  getInstructorInsight,
  getTraineeInsight,
  getPlatformInsight,
} from '../actions/dashboard';
import {
  type SystemAdminDashboardDto,
  type InstitutionTrendsDashboardDto,
  type PlatformOwnerDashboardDto,
  type InstitutionBillingDashboardDto,
} from '../api/schemas';
import type {
  InstructorHomeDashboardDto,
  TraineeHomeDashboardDto,
} from '../types/dashboardHome';
import type { DashboardInsightRole } from '../types/dashboardInsights';
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

export function useInstructorHomeDashboard(
  fallbackData?: InstructorHomeDashboardDto,
) {
  return useSWR<InstructorHomeDashboardDto>(
    swrKeys.dashboardInstructorHome,
    getInstructorHomeDashboard,
    {
      fallbackData,
      revalidateOnMount: !fallbackData,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}

export function useTraineeHomeDashboard(fallbackData?: TraineeHomeDashboardDto) {
  return useSWR<TraineeHomeDashboardDto>(
    swrKeys.dashboardTraineeHome,
    getTraineeHomeDashboard,
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

const insightFetchers: Record<
  DashboardInsightRole,
  (insight: string) => Promise<unknown>
> = {
  admin: getAdminInsight,
  instructor: getInstructorInsight,
  trainee: getTraineeInsight,
  platform: getPlatformInsight,
};

/** Lazy detail fetch — pass insight only when the modal is open. */
export function useDashboardInsight<T = unknown>(
  role: DashboardInsightRole,
  insight: string | null,
) {
  return useSWR<T>(
    insight ? swrKeys.dashboardInsight(role, insight) : null,
    () => insightFetchers[role](insight as string) as Promise<T>,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    },
  );
}
