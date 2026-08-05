import type { TeacherModuleActionDto } from '@/app/_lib/types/dashboardHome';
import {
  daysUntilDue,
  urgencyPaletteKey,
  worstUrgency,
  type UrgencyPaletteKey,
  type UrgencyTone,
} from '../TraineeDashboardHome/urgency';

export type { UrgencyPaletteKey, UrgencyTone };
export { urgencyPaletteKey, worstUrgency, daysUntilDue };

/** Submission rate 0–1 → soft red / blue / green (mirrors trainee grade ladder). */
export function urgencyFromSubmissionRate(rate: number): UrgencyTone {
  const pct = Math.round(rate * 100);
  if (pct < 50) return 'urgent';
  if (pct >= 75) return 'time';
  return 'calm';
}

/**
 * Teacher action urgency:
 * expired draft = red · expiring ≤2d / exam tomorrow = orange ·
 * upcoming = green · plain draft = blue.
 */
export function urgencyFromAction(
  item: Pick<TeacherModuleActionDto, 'status' | 'relevantAt'>,
): UrgencyTone {
  const status = item.status ?? '';
  if (status === 'ExpiredDraft') return 'urgent';

  const days = daysUntilDue(item.relevantAt);

  if (status === 'ExpiringSoon') {
    if (days == null || days <= 0) return 'urgent';
    if (days <= 2) return 'soon';
    return 'time';
  }

  if (status === 'ScheduledExam') {
    if (days == null) return 'calm';
    if (days <= 0) return 'urgent';
    if (days === 1) return 'soon';
    if (days <= 4) return 'time';
    return 'calm';
  }

  // Draft — stale (>14d since update) nudges orange; otherwise calm blue
  if (days != null && days < -14) return 'soon';
  return 'calm';
}

export function statusLabel(status: string | null | undefined): string {
  switch (status) {
    case 'ExpiredDraft':
      return 'Expired draft';
    case 'ExpiringSoon':
      return 'Expiring soon';
    case 'ScheduledExam':
      return 'Exam opens';
    case 'Draft':
      return 'Draft';
    default:
      return status || 'Action';
  }
}

export function formatActionWhen(value: string | null | undefined): string {
  const days = daysUntilDue(value);
  if (days == null) return '—';
  if (days < 0) {
    const ago = Math.abs(days);
    return ago === 0 ? 'Today' : `${ago}d ago`;
  }
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days}d`;
}

export function courseHrefFromAction(
  item: Pick<TeacherModuleActionDto, 'classroomId' | 'classroomName'>,
): string | null {
  if (!item.classroomId) return null;
  const name = (item.classroomName ?? 'Course').trim() || 'Course';
  return `/dashboard/courses/${encodeURIComponent(`${name}~${item.classroomId}`)}`;
}
