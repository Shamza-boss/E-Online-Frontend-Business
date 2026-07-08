'use client';

import { UserRole } from '@/app/_lib/Enums/UserRole';
import type {
  InstitutionTrendsDashboardDto,
  PlatformOwnerDashboardDto,
} from '@/app/_lib/interfaces/types';
import MainGrid from './_components/MainGrid';

export interface DashboardClientProps {
  role: UserRole;
  initialData: InstitutionTrendsDashboardDto | PlatformOwnerDashboardDto;
}

export default function DashboardClient({ role, initialData }: DashboardClientProps) {
  return <MainGrid role={role} initialData={initialData} />;
}
