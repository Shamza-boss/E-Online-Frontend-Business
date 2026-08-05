'use client';

import { type UserRole } from '@/app/_lib/Enums/UserRole';
import MainGrid, { type DashboardHomeData } from './_components/MainGrid';

export type DashboardClientProps = {
  role: UserRole;
  initialData: DashboardHomeData;
};

export default function DashboardClient({
  role,
  initialData,
}: DashboardClientProps) {
  return <MainGrid role={role} initialData={initialData} />;
}
