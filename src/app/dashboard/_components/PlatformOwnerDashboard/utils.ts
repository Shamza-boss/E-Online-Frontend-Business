import type { PlatformOwnerDashboardDto } from '@/app/_lib/interfaces/types';
import type {
  InstitutionHealthDto,
  PlatformOwnerHealthFields,
} from '@/app/_lib/types/dashboardHome';
import { formatSaDate } from '@/app/_lib/utils/datetime';

export type PlatformOwnerDashboardProps = {
  initialData: PlatformOwnerDashboardDto;
};

export type PlatformOwnerDashboardView = PlatformOwnerDashboardDto &
  PlatformOwnerHealthFields;

export function formatLastActive(value: string | null | undefined): string {
  if (!value) return 'never';
  return formatSaDate(value, '—');
}

export function formatActivePercent(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return '0%';
  return `${value.toFixed(0)}%`;
}

export function buildPeakHourSeries(
  peakHours: Array<{ hour?: number; count?: number }> | null | undefined,
) {
  // API already buckets by SAST (Africa/Johannesburg).
  const byHour = new Map<number, number>();
  for (const row of peakHours ?? []) {
    if (row.hour == null) continue;
    byHour.set(row.hour, row.count ?? 0);
  }
  const hours = Array.from({ length: 24 }, (_, hour) => hour);
  return {
    hours: hours.map((h) => `${String(h).padStart(2, '0')}`),
    counts: hours.map((h) => byHour.get(h) ?? 0),
  };
}

export function buildHealthBars(rows: InstitutionHealthDto[]) {
  return rows
    .slice()
    .sort((a, b) => (b.activeUserPercent ?? 0) - (a.activeUserPercent ?? 0))
    .slice(0, 8);
}

export function topPeakLabel(
  peakHours: Array<{ hour?: number; count?: number }> | null | undefined,
): string {
  const top = [...(peakHours ?? [])].sort(
    (a, b) => (b.count ?? 0) - (a.count ?? 0),
  )[0];
  if (top?.hour == null) return 'No login peak yet';
  return `${String(top.hour).padStart(2, '0')}:00 SAST`;
}
