import type { GradePerfomanceDto } from '@/app/_lib/interfaces/types';
import { CHART_MAX_VALUE, Y_AXIS_STEP } from './constants';

export function normalizeSeries(
  series: GradePerfomanceDto[] | undefined
): GradePerfomanceDto[] {
  return (series ?? []).map((currentSeries) => ({
    ...currentSeries,
    data: (currentSeries.data ?? []).map((value) =>
      typeof value === 'number' && Number.isFinite(value) ? value : 0
    ),
  }));
}

export function computePercentageSeries(
  normalizedSeries: GradePerfomanceDto[],
  numberOfTrainees: number
): GradePerfomanceDto[] {
  if (!normalizedSeries.length) {
    return [];
  }

  const totalsPerMonth = normalizedSeries.reduce<number[]>(
    (accumulator, currentSeries) => {
      currentSeries.data?.forEach((value, index) => {
        accumulator[index] = (accumulator[index] ?? 0) + value;
      });
      return accumulator;
    },
    []
  );

  const globalTotal =
    typeof numberOfTrainees === 'number' && numberOfTrainees > 0
      ? numberOfTrainees
      : null;

  return normalizedSeries.map((currentSeries) => ({
    ...currentSeries,
    data: (currentSeries.data ?? []).map((value, index) => {
      const denominator = globalTotal ?? totalsPerMonth[index] ?? 0;

      if (!denominator) {
        return 0;
      }

      const percentage = (value / denominator) * 100;
      return Number.isFinite(percentage) ? Number(percentage.toFixed(2)) : 0;
    }),
  }));
}

export function computeYAxisTicks(): number[] {
  const ticks: number[] = [];

  for (let value = 0; value < CHART_MAX_VALUE; value += Y_AXIS_STEP) {
    ticks.push(value);
  }

  if (ticks[ticks.length - 1] !== CHART_MAX_VALUE) {
    ticks.push(CHART_MAX_VALUE);
  }

  return ticks;
}
