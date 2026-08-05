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
import {
  ACTIVE_TRAINEE_HOME_DASHBOARD,
  BUSY_INSTRUCTOR_HOME_DASHBOARD,
  HEALTHY_PLATFORM_OWNER_DASHBOARD,
  HIGH_PERFORMING_INSTITUTION_DASHBOARD,
  isMockDashboardEnabled,
} from '../mocks';

export function useSystemDashboard() {
  return useSWR<SystemAdminDashboardDto>(
    swrKeys.dashboardSystem,
    getSystemAdminDashboard,
  );
}

export function useInstitutionDashboard(
  fallbackData?: InstitutionTrendsDashboardDto,
) {
  const mock = isMockDashboardEnabled();
  return useSWR<InstitutionTrendsDashboardDto>(
    mock ? 'dashboard:institution:mock' : swrKeys.dashboardInstitution,
    mock
      ? async () => HIGH_PERFORMING_INSTITUTION_DASHBOARD
      : getInstitutionDashboard,
    {
      fallbackData: mock ? HIGH_PERFORMING_INSTITUTION_DASHBOARD : fallbackData,
      revalidateOnMount: mock ? false : !fallbackData,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}

export function useInstructorHomeDashboard(
  fallbackData?: InstructorHomeDashboardDto,
) {
  const mock = isMockDashboardEnabled();
  return useSWR<InstructorHomeDashboardDto>(
    mock ? 'dashboard:instructor:mock' : swrKeys.dashboardInstructorHome,
    mock ? async () => BUSY_INSTRUCTOR_HOME_DASHBOARD : getInstructorHomeDashboard,
    {
      fallbackData: mock ? BUSY_INSTRUCTOR_HOME_DASHBOARD : fallbackData,
      revalidateOnMount: mock ? false : !fallbackData,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}

export function useTraineeHomeDashboard(fallbackData?: TraineeHomeDashboardDto) {
  const mock = isMockDashboardEnabled();
  return useSWR<TraineeHomeDashboardDto>(
    mock ? 'dashboard:trainee:mock' : swrKeys.dashboardTraineeHome,
    mock ? async () => ACTIVE_TRAINEE_HOME_DASHBOARD : getTraineeHomeDashboard,
    {
      fallbackData: mock ? ACTIVE_TRAINEE_HOME_DASHBOARD : fallbackData,
      revalidateOnMount: mock ? false : !fallbackData,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}

export function usePlatformOwnerDashboard(
  fallbackData?: PlatformOwnerDashboardDto,
) {
  const mock = isMockDashboardEnabled();
  return useSWR<PlatformOwnerDashboardDto>(
    mock ? 'dashboard:platform:mock' : swrKeys.dashboardPlatformOwner,
    mock
      ? async () => HEALTHY_PLATFORM_OWNER_DASHBOARD
      : getPlatformOwnerDashboard,
    {
      fallbackData: mock ? HEALTHY_PLATFORM_OWNER_DASHBOARD : fallbackData,
      revalidateOnMount: mock ? false : !fallbackData,
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
