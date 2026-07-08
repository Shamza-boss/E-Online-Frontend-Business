import { auth } from '@/auth';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import {
  getInstitutionDashboard,
  getPlatformOwnerDashboard,
} from '@/app/_lib/data/dashboard';
import { normalizeRole } from './_components/MainGrid/utils';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  const role = normalizeRole(session?.user?.role) ?? UserRole.Trainee;

  const initialData =
    role === UserRole.PlatformAdmin
      ? await getPlatformOwnerDashboard()
      : await getInstitutionDashboard();

  return <DashboardClient role={role} initialData={initialData} />;
}
