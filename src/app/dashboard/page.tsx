import { auth } from '@/auth';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import {
  getInstitutionDashboard,
  getInstructorHomeDashboard,
  getPlatformOwnerDashboard,
  getTraineeHomeDashboard,
} from '@/app/_lib/data/dashboard';
import { normalizeRole } from './_components/MainGrid/utils';
import DashboardClient from './DashboardClient';
import type { DashboardHomeData } from './_components/MainGrid';

async function loadDashboardHome(role: UserRole): Promise<DashboardHomeData> {
  switch (role) {
    case UserRole.PlatformAdmin:
      return getPlatformOwnerDashboard();
    case UserRole.Admin:
      return getInstitutionDashboard();
    case UserRole.Instructor:
      return getInstructorHomeDashboard();
    case UserRole.Trainee:
    default:
      return getTraineeHomeDashboard();
  }
}

function toLoadErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return 'We could not load dashboard data. Please try again.';
}

export default async function DashboardPage() {
  const session = await auth();
  const role = normalizeRole(session?.user?.role) ?? UserRole.Trainee;

  try {
    const initialData = await loadDashboardHome(role);
    return <DashboardClient role={role} initialData={initialData} />;
  } catch (error) {
    console.error('[DashboardPage] failed to load home dashboard', error);
    return (
      <DashboardClient
        role={role}
        initialData={null}
        loadError={toLoadErrorMessage(error)}
      />
    );
  }
}
