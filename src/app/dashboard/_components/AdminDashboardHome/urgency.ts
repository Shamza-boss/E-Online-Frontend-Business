import {
  urgencyFromGrade,
  urgencyPaletteKey,
  type UrgencyPaletteKey,
  type UrgencyTone,
} from '../TraineeDashboardHome/urgency';

export type { UrgencyPaletteKey, UrgencyTone };
export { urgencyFromGrade, urgencyPaletteKey };

/** Submission / engagement rate 0–1 → red / blue / green. */
export function urgencyFromRate(rate: number | undefined): UrgencyTone {
  const pct = Math.round((rate ?? 0) * 100);
  if (pct < 50) return 'urgent';
  if (pct >= 75) return 'time';
  return 'calm';
}

/** Follow-up / never-activated counts. */
export function urgencyFromAttentionCount(count: number): UrgencyTone {
  if (count <= 0) return 'calm';
  if (count >= 8) return 'urgent';
  return 'soon';
}

/**
 * Share of people (or orgs) that are active.
 * active / total → high green, mid blue, low red.
 */
export function urgencyFromActiveShare(
  active: number,
  total: number,
): UrgencyTone {
  if (total <= 0) return 'calm';
  const pct = Math.round((100 * active) / total);
  if (pct < 40) return 'urgent';
  if (pct >= 70) return 'time';
  return 'calm';
}

export function toneHex(
  theme: { palette: Record<string, { main: string }> },
  tone: UrgencyTone,
): string {
  if (tone === 'urgent') return theme.palette.error.main;
  if (tone === 'soon') return theme.palette.warning.main;
  if (tone === 'time') return theme.palette.success.main;
  return theme.palette.primary.main;
}
