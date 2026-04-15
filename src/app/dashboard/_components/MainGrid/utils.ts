import { UserRole } from '@/app/_lib/Enums/UserRole';
import type { TrendDirection } from '../StatCard/interfaces';

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
