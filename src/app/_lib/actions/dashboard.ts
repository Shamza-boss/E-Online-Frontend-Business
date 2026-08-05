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

/** Server Actions for SWR refresh paths — initial page data comes from `_lib/data`. */
export async function getSystemAdminDashboard(): Promise<SystemAdminDashboardDto> {
  return serverFetch<SystemAdminDashboardDto>('/Dashboard/system');
}

export async function getInstitutionDashboard(): Promise<InstitutionTrendsDashboardDto> {
  return serverFetch<InstitutionTrendsDashboardDto>('/Dashboard/institution');
}

export async function getInstructorHomeDashboard(): Promise<InstructorHomeDashboardDto> {
  return serverFetch<InstructorHomeDashboardDto>('/Dashboard/home/instructor');
}

export async function getTraineeHomeDashboard(): Promise<TraineeHomeDashboardDto> {
  return serverFetch<TraineeHomeDashboardDto>('/Dashboard/home/trainee');
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
  return fetchInsightOrNull(
    `/Dashboard/insights/instructor/${encodeURIComponent(insight)}`,
  );
}

export async function getTraineeInsight(
  insight: string,
): Promise<unknown | null> {
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
