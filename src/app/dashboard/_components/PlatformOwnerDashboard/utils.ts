import type { StatCardProps } from '../StatCard';
import { buildStatCard } from '../MainGrid/utils';
import { PLATFORM_STAT_LABELS } from './constants';

type PlatformDashboardData = {
  institutions?: { total?: number; trend?: string; dataPoints?: number[] };
  users?: { total?: number; trend?: string; dataPoints?: number[] };
  modules?: { total?: number; trend?: string; dataPoints?: number[] };
  totalCost?: { total?: number; trend?: string; dataPoints?: number[] };
} | undefined;

const METRIC_KEYS = ['institutions', 'users', 'modules', 'totalCost'] as const;

export function buildPlatformStats(
  data: PlatformDashboardData,
  isLoading: boolean,
): StatCardProps[] {
  return PLATFORM_STAT_LABELS.map((title, index) =>
    buildStatCard(title, data?.[METRIC_KEYS[index]], isLoading),
  );
}
