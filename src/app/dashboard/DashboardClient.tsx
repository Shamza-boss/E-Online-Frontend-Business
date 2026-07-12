'use client';

import { type UserRole } from '@/app/_lib/Enums/UserRole';
import type {
  InstitutionTrendsDashboardDto,
  PlatformOwnerDashboardDto,
} from '@/app/_lib/interfaces/types';
import MainGrid from './_components/MainGrid';

export type DashboardClientProps = {
  role: UserRole;
  initialData: InstitutionTrendsDashboardDto | PlatformOwnerDashboardDto;
}

export default function DashboardClient({ role, initialData }: DashboardClientProps) {
  return <MainGrid role={role} initialData={initialData} />;
}
