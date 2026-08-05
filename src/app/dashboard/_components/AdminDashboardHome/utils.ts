import type {
  InstitutionTrendsDashboardDto,
  RecentHomeworkStatDto,
} from '@/app/_lib/interfaces/types';
import { UserRole } from '@/app/_lib/Enums/UserRole';

export type AdminDashboardHomeProps = {
  initialData: InstitutionTrendsDashboardDto;
};

export function formatPercent(rate: number | undefined): string {
  if (rate == null || Number.isNaN(rate)) return '0%';
  return `${(rate * 100).toFixed(0)}%`;
}

export function toPercentValue(rate: number | undefined): number {
  if (rate == null || Number.isNaN(rate)) return 0;
  return Math.round(rate * 100);
}

export function formatPresence(value: string | null | undefined): string {
  if (!value) return 'Never';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return '—';
  }
}

export function formatInactiveRole(role: string | number | null | undefined): string {
  if (role == null) return 'User';
  const asNumber =
    typeof role === 'number' ? role : Number.parseInt(String(role), 10);
  if (!Number.isNaN(asNumber)) {
    if (asNumber === UserRole.Instructor || asNumber === 2) return 'Instructor';
    if (asNumber === UserRole.Trainee || asNumber === 1) return 'Trainee';
    if (asNumber === UserRole.Admin || asNumber === 0) return 'Admin';
  }
  const label = String(role);
  if (/teacher/i.test(label)) return 'Instructor';
  if (/student/i.test(label)) return 'Trainee';
  return label;
}

export function buildPresenceBars(data: InstitutionTrendsDashboardDto | undefined) {
  return [
    { label: 'Active 7d', value: data?.activeUsersLast7Days ?? 0 },
    { label: 'Active 30d', value: data?.activeUsersLast30Days ?? 0 },
    { label: 'Never in', value: data?.neverLoggedInCount ?? 0 },
    { label: 'Instructors', value: data?.activeInstructorsLast30Days ?? 0 },
    { label: 'Trainees', value: data?.activeTraineesLast30Days ?? 0 },
  ];
}

export function buildEngagementRadar(data: InstitutionTrendsDashboardDto | undefined) {
  const submission = toPercentValue(data?.engagement?.submissionRate);
  const notes = Math.min(100, Math.round((data?.engagement?.avgNotePerStudent ?? 0) * 20));
  const modules = Math.min(100, Math.round((data?.engagement?.avgHomeworkAssigned ?? 0) * 20));
  const instructorShare =
    (data?.activeUsersLast30Days ?? 0) === 0
      ? 0
      : Math.round(
          (100 * (data?.activeInstructorsLast30Days ?? 0)) /
            Math.max(1, data?.activeUsersLast30Days ?? 1),
        );
  const traineeShare =
    (data?.activeUsersLast30Days ?? 0) === 0
      ? 0
      : Math.round(
          (100 * (data?.activeTraineesLast30Days ?? 0)) /
            Math.max(1, data?.activeUsersLast30Days ?? 1),
        );

  return {
    metrics: [
      { name: 'Submit %', max: 100 },
      { name: 'Notes', max: 100 },
      { name: 'Modules', max: 100 },
      { name: 'Staff share', max: 100 },
      { name: 'Trainee share', max: 100 },
    ],
    values: [submission, notes, modules, instructorShare, traineeShare],
  };
}

export function getRecentModules(
  data: InstitutionTrendsDashboardDto | undefined,
): RecentHomeworkStatDto[] {
  return data?.recentHomeworkStats ?? [];
}

export function averageModuleSubmissionRate(
  rows: RecentHomeworkStatDto[] | null | undefined,
): number {
  const list = rows ?? [];
  if (list.length === 0) return 0;
  const sum = list.reduce((acc, row) => acc + (row.submissionRate ?? 0), 0);
  return sum / list.length;
}

export function totalModuleSubmissions(
  rows: RecentHomeworkStatDto[] | null | undefined,
): number {
  return (rows ?? []).reduce((acc, row) => acc + (row.submissions ?? 0), 0);
}

function truncateLabel(value: string, max = 18): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed || 'Untitled';
  return `${trimmed.slice(0, max - 1)}…`;
}

export type ModuleActivityBars = {
  labels: string[];
  assigned: number[];
  submitted: number[];
};

/** Grouped bars: top modules by submissions (default 5 for cards). */
export function buildModuleActivityBars(
  rows: RecentHomeworkStatDto[] | null | undefined,
  limit = 5,
): ModuleActivityBars {
  const sorted = [...(rows ?? [])]
    .sort((a, b) => (b.submissions ?? 0) - (a.submissions ?? 0))
    .slice(0, limit);

  return {
    labels: sorted.map((row) => truncateLabel(row.homeworkTitle || 'Untitled')),
    assigned: sorted.map((row) => row.studentsAssigned ?? 0),
    submitted: sorted.map((row) => row.submissions ?? 0),
  };
}

export type ModuleRateBars = {
  labels: string[];
  rates: number[];
};

/** Horizontal rate ranking (0–100), highest first. */
export function buildModuleRateBars(
  rows: RecentHomeworkStatDto[] | null | undefined,
  limit = 8,
): ModuleRateBars {
  const sorted = [...(rows ?? [])]
    .sort((a, b) => (b.submissionRate ?? 0) - (a.submissionRate ?? 0))
    .slice(0, limit);

  return {
    labels: sorted.map((row) => truncateLabel(row.homeworkTitle || 'Untitled', 22)),
    rates: sorted.map((row) => Math.round((row.submissionRate ?? 0) * 100)),
  };
}
