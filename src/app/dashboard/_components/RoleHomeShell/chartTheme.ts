import { alpha, type Theme } from '@mui/material/styles';

/** Single accent for all role-home mini charts. */
export function dashboardChartColor(theme: Theme): string {
  return theme.palette.primary.main;
}

/** Neutral slate for dual-series comparison (assigned, notes, baselines). */
export function dashboardNeutralColor(theme: Theme): string {
  return theme.palette.mode === 'dark'
    ? 'hsl(210, 12%, 58%)'
    : 'hsl(210, 14%, 42%)';
}

/**
 * Distinct pair for multi-series analytics:
 * - primary: action / modules / submitted
 * - neutral: notes / assigned / baseline
 */
export function dashboardCompareColors(theme: Theme): {
  primary: string;
  neutral: string;
} {
  return {
    primary: dashboardChartColor(theme),
    neutral: dashboardNeutralColor(theme),
  };
}

/** Primary-tinted slices so multi-series charts stay in the same family. */
export function dashboardSeriesColors(theme: Theme, count: number): string[] {
  const base = theme.palette.primary.main;
  if (count <= 1) return [base];
  return Array.from({ length: count }, (_, index) =>
    alpha(base, Math.max(0.35, 1 - index * (0.55 / Math.max(1, count - 1)))),
  );
}

export function seriesTotal(points: number[] | null | undefined): number {
  if (!points?.length) return 0;
  return points.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
}

export function seriesLatest(points: number[] | null | undefined): number {
  if (!points?.length) return 0;
  const last = points[points.length - 1];
  return Number.isFinite(last) ? last : 0;
}

export function seriesAverage(points: number[] | null | undefined): number {
  if (!points?.length) return 0;
  return Math.round(seriesTotal(points) / points.length);
}
