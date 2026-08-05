'use client';

import PlatformOwnerDashboard from '../PlatformOwnerDashboard';
import AdminDashboardHome from '../AdminDashboardHome';
import InstructorDashboardHome from '../InstructorDashboardHome';
import TraineeDashboardHome from '../TraineeDashboardHome';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import type {
  InstitutionTrendsDashboardDto,
  PlatformOwnerDashboardDto,
} from '@/app/_lib/interfaces/types';
import type {
  InstructorHomeDashboardDto,
  TraineeHomeDashboardDto,
} from '@/app/_lib/types/dashboardHome';

export type DashboardHomeData =
  | InstitutionTrendsDashboardDto
  | PlatformOwnerDashboardDto
  | InstructorHomeDashboardDto
  | TraineeHomeDashboardDto;

export type MainGridProps = {
  role: UserRole;
  initialData: DashboardHomeData;
};

export default function MainGrid({ role, initialData }: MainGridProps) {
  if (role === UserRole.PlatformAdmin) {
    return (
      <PlatformOwnerDashboard
        initialData={initialData as PlatformOwnerDashboardDto}
      />
    );
  }

  if (role === UserRole.Admin) {
    return (
      <AdminDashboardHome
        initialData={initialData as InstitutionTrendsDashboardDto}
      />
    );
  }

  if (role === UserRole.Instructor) {
    return (
      <InstructorDashboardHome
        initialData={initialData as InstructorHomeDashboardDto}
      />
    );
  }

  return (
    <TraineeDashboardHome
      initialData={initialData as TraineeHomeDashboardDto}
    />
  );
}
