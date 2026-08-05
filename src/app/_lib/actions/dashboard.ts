'use server';

import type {
  InstitutionBillingDashboardDto,
  InstitutionTrendsDashboardDto,
  PlatformOwnerDashboardDto,
  SystemAdminDashboardDto,
} from '../api/schemas';
import type {
  InstructorHomeDashboardDto,
  TraineeHomeDashboardDto,
} from '../types/dashboardHome';
import { serverFetch } from '../serverFetch.server';
import {
  ACTIVE_TRAINEE_ACTIVITY_INSIGHT,
  ACTIVE_TRAINEE_HOME_DASHBOARD,
  BUSY_INSTRUCTOR_HEAVY_LOAD_INSIGHT,
  BUSY_INSTRUCTOR_HOME_DASHBOARD,
  BUSY_INSTRUCTOR_UNASSIGNED_INSIGHT,
  BUSY_INSTRUCTOR_WORKLOAD_INSIGHT,
  HEALTHY_PLATFORM_OWNER_DASHBOARD,
  HIGH_PERFORMING_INSTITUTION_DASHBOARD,
  isMockDashboardEnabled,
} from '../mocks';

/** Server Actions for SWR refresh paths — initial page data comes from `_lib/data`. */
export async function getSystemAdminDashboard(): Promise<SystemAdminDashboardDto> {
  return serverFetch<SystemAdminDashboardDto>('/Dashboard/system');
}

export async function getInstitutionDashboard(): Promise<InstitutionTrendsDashboardDto> {
  if (isMockDashboardEnabled()) {
    return HIGH_PERFORMING_INSTITUTION_DASHBOARD;
  }
  return serverFetch<InstitutionTrendsDashboardDto>('/Dashboard/institution');
}

export async function getInstructorHomeDashboard(): Promise<InstructorHomeDashboardDto> {
  if (isMockDashboardEnabled()) {
    return BUSY_INSTRUCTOR_HOME_DASHBOARD;
  }
  return serverFetch<InstructorHomeDashboardDto>('/Dashboard/home/instructor');
}

export async function getTraineeHomeDashboard(): Promise<TraineeHomeDashboardDto> {
  if (isMockDashboardEnabled()) {
    return ACTIVE_TRAINEE_HOME_DASHBOARD;
  }
  return serverFetch<TraineeHomeDashboardDto>('/Dashboard/home/trainee');
}

export async function getPlatformOwnerDashboard(): Promise<PlatformOwnerDashboardDto> {
  if (isMockDashboardEnabled()) {
    return HEALTHY_PLATFORM_OWNER_DASHBOARD;
  }
  return serverFetch<PlatformOwnerDashboardDto>('/Dashboard/platform-owner');
}

export async function getInstitutionBillingDashboard(
  institutionId: string,
): Promise<InstitutionBillingDashboardDto> {
  return serverFetch<InstitutionBillingDashboardDto>(
    `/Dashboard/platform-owner/institution/${encodeURIComponent(institutionId)}`,
  );
}

/** Soft-fail so a broken insight API cannot blank the whole /dashboard page. */
async function fetchInsightOrNull(path: string): Promise<unknown | null> {
  try {
    return await serverFetch<unknown>(path);
  } catch {
    return null;
  }
}

export async function getAdminInsight(insight: string): Promise<unknown | null> {
  return fetchInsightOrNull(
    `/Dashboard/insights/admin/${encodeURIComponent(insight)}`,
  );
}

export async function getInstructorInsight(
  insight: string,
): Promise<unknown | null> {
  if (isMockDashboardEnabled()) {
    if (insight === 'workload') return BUSY_INSTRUCTOR_WORKLOAD_INSIGHT;
    if (insight === 'unassigned') return BUSY_INSTRUCTOR_UNASSIGNED_INSIGHT;
    if (insight === 'heavyLoad' || insight === 'heavyload') {
      return BUSY_INSTRUCTOR_HEAVY_LOAD_INSIGHT;
    }
  }
  return fetchInsightOrNull(
    `/Dashboard/insights/instructor/${encodeURIComponent(insight)}`,
  );
}

export async function getTraineeInsight(
  insight: string,
): Promise<unknown | null> {
  if (isMockDashboardEnabled() && insight === 'activity') {
    return ACTIVE_TRAINEE_ACTIVITY_INSIGHT;
  }
  return fetchInsightOrNull(
    `/Dashboard/insights/trainee/${encodeURIComponent(insight)}`,
  );
}

export async function getPlatformInsight(
  insight: string,
): Promise<unknown | null> {
  return fetchInsightOrNull(
    `/Dashboard/insights/platform/${encodeURIComponent(insight)}`,
  );
}
