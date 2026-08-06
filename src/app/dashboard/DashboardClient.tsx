'use client';

import { type UserRole } from '@/app/_lib/Enums/UserRole';
import MainGrid, { type DashboardHomeData } from './_components/MainGrid';
import DashboardLoadError from './_components/DashboardLoadError';

export type DashboardClientProps = {
  role: UserRole;
  initialData: DashboardHomeData | null;
  loadError?: string | null;
};

export default function DashboardClient({
  role,
  initialData,
  loadError,
}: DashboardClientProps) {
  if (loadError || !initialData) {
    return (
      <DashboardLoadError
        message={
          loadError ?? 'We could not load dashboard data. Please try again.'
        }
      />
    );
  }

  return <MainGrid role={role} initialData={initialData} />;
}
