import type { TrendDirection } from '../StatCard/interfaces';

export function normalizeTrend(trend: string | undefined): TrendDirection {
  return trend === 'up' || trend === 'down' || trend === 'neutral'
    ? trend
    : 'neutral';
}
