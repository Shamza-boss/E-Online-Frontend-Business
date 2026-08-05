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

export function actionItemCount(data: InstructorHomeDashboardDto | undefined): number {
  if (!data) return 0;
  return (
    (data.draftCount ?? 0) +
    (data.expiredDraftCount ?? 0) +
    (data.scheduledExamCount ?? 0) +
    (data.expiringSoonCount ?? 0)
  );
}

/** Pie slices for teacher-owned work (no grading queue). */
export function buildActionSeries(data: InstructorHomeDashboardDto | undefined) {
  const items = [
    { id: 0, label: 'Expired', value: data?.expiredDraftCount ?? 0 },
    { id: 1, label: 'Expiring', value: data?.expiringSoonCount ?? 0 },
    { id: 2, label: 'Exams', value: data?.scheduledExamCount ?? 0 },
    { id: 3, label: 'Drafts', value: data?.draftCount ?? 0 },
  ];
  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return [{ id: 4, label: 'All clear', value: 1 }];
  }
  return items.filter((item) => item.value > 0);
}
