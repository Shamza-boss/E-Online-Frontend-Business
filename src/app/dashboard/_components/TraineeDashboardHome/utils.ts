import type { TraineeHomeDashboardDto } from '@/app/_lib/types/dashboardHome';

export type TraineeDashboardHomeProps = {
  initialData: TraineeHomeDashboardDto;
};

export function formatRate(rate: number | undefined): string {
  if (rate == null || Number.isNaN(rate)) return '0%';
  return `${(rate * 100).toFixed(0)}%`;
}

export function toPercent(rate: number | undefined): number {
  if (rate == null || Number.isNaN(rate)) return 0;
  return Math.round(rate * 100);
}

export function formatDue(value: string | null | undefined): string {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '—';
  }
}

export function buildWorkloadPie(data: TraineeHomeDashboardDto | undefined) {
  const dueSoon = data?.dueSoonCount ?? 0;
  const overdue = data?.overdueCount ?? 0;
  const items = [
    { id: 0, label: 'Due soon', value: dueSoon },
    { id: 1, label: 'Overdue', value: overdue },
  ];
  if (dueSoon + overdue === 0) {
    items.push({ id: 2, label: 'All clear', value: 1 });
  }
  return items.filter((item) => item.value > 0);
}

export function clampGrade(value: number | undefined): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
