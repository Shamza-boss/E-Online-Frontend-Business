import type { TraineeDueItemDto } from '@/app/_lib/types/dashboardHome';

/**
 * Next-due urgency ladder (closer → hotter):
 * urgent = red (overdue / due today)
 * soon = orange (tomorrow)
 * time = green (smart to do now, a few days out)
 * calm = blue (far back — glance later)
 */
export type UrgencyTone = 'calm' | 'time' | 'soon' | 'urgent';

export type UrgencyPaletteKey =
  | 'primary.main'
  | 'success.main'
  | 'warning.main'
  | 'error.main';

/** Days until end of due date (ceil). Overdue / past → negative. */
export function daysUntilDue(value: string | null | undefined): number | null {
  if (!value) return null;
  try {
    return Math.ceil(
      (new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
  } catch {
    return null;
  }
}

/**
 * Red today (and overdue), orange tomorrow, green for near “do now”,
 * blue when still comfortably far.
 */
export function urgencyFromDueItem(
  item: Pick<TraineeDueItemDto, 'isOverdue' | 'dueDate'>,
): UrgencyTone {
  if (item.isOverdue) return 'urgent';
  const days = daysUntilDue(item.dueDate);
  if (days == null) return 'calm';
  if (days <= 0) return 'urgent'; // today
  if (days === 1) return 'soon'; // tomorrow
  if (days <= 4) return 'time'; // smart to do now
  return 'calm'; // further out
}

/** Worst urgency in a list (for card header accents). */
export function worstUrgency(tones: UrgencyTone[]): UrgencyTone {
  const rank: Record<UrgencyTone, number> = {
    calm: 0,
    time: 1,
    soon: 2,
    urgent: 3,
  };
  return tones.reduce<UrgencyTone>(
    (worst, tone) => (rank[tone] > rank[worst] ? tone : worst),
    'calm',
  );
}

/** Grade progress (separate from due ladder): weak → red, strong → green, else blue. */
export function urgencyFromGrade(grade: number): UrgencyTone {
  if (grade < 50) return 'urgent';
  if (grade >= 75) return 'time';
  return 'calm';
}

export function urgencyPaletteKey(tone: UrgencyTone): UrgencyPaletteKey {
  if (tone === 'urgent') return 'error.main';
  if (tone === 'soon') return 'warning.main';
  if (tone === 'time') return 'success.main';
  return 'primary.main';
}

export function courseHrefFromDueItem(
  item: Pick<TraineeDueItemDto, 'classroomId' | 'classroomName'>,
): string | null {
  if (!item.classroomId) return null;
  const name = (item.classroomName ?? 'Course').trim() || 'Course';
  return `/dashboard/courses/${encodeURIComponent(`${name}~${item.classroomId}`)}`;
}

/** Open modules/exams the student can act on now (excludes far-future exams). */
export function canCompleteDueItemNow(item: TraineeDueItemDto): boolean {
  if (!item.classroomId) return false;
  if (item.isOverdue) return true;
  if (!item.isExam) return true;
  const days = daysUntilDue(item.dueDate);
  return days != null && days <= 2;
}

export function formatDueCountdown(value: string | null | undefined): string {
  const days = daysUntilDue(value);
  if (days == null) return '—';
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days}d`;
}
