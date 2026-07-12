import { type UserRole } from '@/app/_lib/Enums/UserRole';
import type { StatCardProps } from '../StatCard';
import type { TrendDirection } from '../StatCard/types';
import { STAT_INTERVAL } from './constants';

type DashboardMetric = {
  total?: number;
  trend?: string | null;
  dataPoints?: number[] | null;
};

export function buildStatCard(
  title: string,
  metric: DashboardMetric | undefined,
  isLoading: boolean,
): StatCardProps {
  return {
    title,
    value: `${metric?.total ?? 0}`,
    interval: STAT_INTERVAL,
    trend: normalizeTrend(metric?.trend),
    data: metric?.dataPoints ?? [],
    loading: isLoading,
  };
}

export function normalizeRole(
  rawRole: string | number | UserRole | null | undefined,
): UserRole | undefined {
  if (rawRole === null || rawRole === undefined) {
    return undefined;
  }

  return typeof rawRole === 'string'
    ? (parseInt(rawRole, 10) as UserRole)
    : (rawRole as UserRole);
}

export function normalizeTrend(
  trend: string | null | undefined,
): TrendDirection {
  return trend === 'up' || trend === 'down' || trend === 'neutral'
    ? trend
    : 'neutral';
}

export function normalizeGradeTrendColor(
  color: string | null | undefined,
): 'success' | 'error' | 'default' {
  return color === 'success' || color === 'error' || color === 'default'
    ? color
    : 'default';
}

export function formatTrendAverage(average: number | null | undefined): string {
  return average != null ? `+${average.toFixed(1)}%` : '+0%';
}
