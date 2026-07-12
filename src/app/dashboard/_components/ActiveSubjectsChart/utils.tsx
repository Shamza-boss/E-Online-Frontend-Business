import type { SubjectSeriesItem, AreaGradientProps } from './types';
import { MAX_TICK_COUNT } from './constants';

export function normalizeSubjectSeries(series: SubjectSeriesItem[]): SubjectSeriesItem[] {
  return series.map((subjectSeries) => ({
    ...subjectSeries,
    data: subjectSeries.data.map((value) => Math.round(value)),
  }));
}

export function computeChartMaxValue(normalizedSeries: SubjectSeriesItem[]): number {
  const flattened = normalizedSeries.flatMap((s) => s.data ?? []);
  return flattened.length ? Math.max(...flattened) : 0;
}

export function computeYAxisTicks(chartMaxValue: number): number[] {
  if (!Number.isFinite(chartMaxValue) || chartMaxValue <= 0) {
    return [0];
  }

  const desiredTickCount = Math.min(chartMaxValue, MAX_TICK_COUNT);
  const step = Math.max(1, Math.ceil(chartMaxValue / desiredTickCount));
  const ticks: number[] = [0];

  for (let value = step; value < chartMaxValue; value += step) {
    ticks.push(value);
  }

  if (ticks[ticks.length - 1] !== chartMaxValue) {
    ticks.push(chartMaxValue);
  }

  return ticks;
}

export function computeTotalSubmissions(normalizedSeries: SubjectSeriesItem[]): number {
  return normalizedSeries.reduce(
    (sum, s) => sum + (s.data?.reduce((a, b) => a + b, 0) || 0),
    0,
  );
}

export function AreaGradient({ color, id }: AreaGradientProps) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}
