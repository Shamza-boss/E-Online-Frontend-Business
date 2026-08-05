import type { InstructorHomeDashboardDto } from '@/app/_lib/types/dashboardHome';

export type InstructorDashboardHomeProps = {
  initialData: InstructorHomeDashboardDto;
};

export function formatRate(rate: number | undefined): string {
  if (rate == null || Number.isNaN(rate)) return '0%';
  return `${(rate * 100).toFixed(0)}%`;
}

export function toPercent(rate: number | undefined): number {
  if (rate == null || Number.isNaN(rate)) return 0;
  return Math.round(rate * 100);
}

export function buildWorkloadSeries(data: InstructorHomeDashboardDto | undefined) {
  return [
    { id: 0, label: 'To grade', value: data?.pendingToGradeCount ?? 0 },
    { id: 1, label: 'Active 7d', value: data?.activeTraineesLast7Days ?? 0 },
    { id: 2, label: 'Due soon', value: data?.upcomingDueCount ?? 0 },
  ];
}
