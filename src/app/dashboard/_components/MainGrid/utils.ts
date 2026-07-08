import { UserRole } from '@/app/_lib/Enums/UserRole';
import type { StatCardProps } from '../StatCard';
import type { TrendDirection } from '../StatCard/interfaces';
import { STAT_INTERVAL } from './constants';

type DashboardMetric = {
  total?: number;
  trend?: string;
  dataPoints?: number[];
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
  rawRole: string | number | undefined
): UserRole | undefined {
  return typeof rawRole === 'string'
    ? (parseInt(rawRole, 10) as UserRole)
    : (rawRole as UserRole | undefined);
}

export function normalizeTrend(trend: string | undefined): TrendDirection {
  return trend === 'up' || trend === 'down' || trend === 'neutral'
    ? trend
    : 'neutral';
}

export function formatTrendAverage(average: number | null | undefined): string {
  return average != null ? `+${average.toFixed(1)}%` : '+0%';
}
