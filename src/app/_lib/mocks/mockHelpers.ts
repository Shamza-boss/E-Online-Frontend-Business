/** Shared helpers for dashboard home fixtures. */

export function isMockDashboardEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_MOCK_DASHBOARD === 'true' ||
    // Legacy alias from the Admin-only mock pass
    process.env.NEXT_PUBLIC_MOCK_ADMIN_DASHBOARD === 'true'
  );
}

export function daysAgoIso(days: number, hour = 10): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

export function daysFromNowIso(days: number, hour = 14): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** Rising series with mild weekday noise. */
export function risingSeries(
  length: number,
  start: number,
  end: number,
  noise = 0.08,
): number[] {
  return Array.from({ length }, (_, i) => {
    const t = length === 1 ? 1 : i / (length - 1);
    const base = start + (end - start) * t;
    const wobble = 1 + Math.sin(i * 0.9) * noise;
    return Math.max(0, Math.round(base * wobble));
  });
}

export function uuid(n: number): string {
  const hex = n.toString(16).padStart(12, '0');
  return `00000000-0000-4000-8000-${hex}`;
}

/** Last 6 calendar months as short labels (matches DashboardService monthLabels). */
export function last6MonthLabels(): string[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - i), 1));
    return d.toLocaleString('en', { month: 'short', timeZone: 'UTC' });
  });
}
