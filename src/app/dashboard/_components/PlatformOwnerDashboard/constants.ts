import type { PlatformInsightId } from '@/app/_lib/types/dashboardInsights';

export const DASHBOARD_TITLE = 'Platform pulse';
export const DASHBOARD_DESCRIPTION =
  'Tap a tile for growth, health, usage, and margin detail.';

export const CHIP_LABEL = 'Last 30 days';

export const ACTIVE_INSTITUTIONS_CHART = {
  title: 'Most active institutions',
  description: 'Daily user activity by institution in the last 30 days',
  yAxisLabel: 'Total Users',
} as const;

export const PROFIT_MARGIN_CHART = {
  title: 'Profit margin mix',
  description: 'Monthly profit margin bands across institutions',
  yAxisLabel: 'Profit Margin (%)',
  valueLabel: 'institutions',
} as const;

export const INSIGHT_TITLES: Record<PlatformInsightId, string> = {
  growth: 'Growth sparks',
  peakHours: 'Login heat by hour',
  health: 'Institution health',
  usage: 'Platform usage',
  institutions: 'Most active institutions',
  profit: 'Profit margin mix',
};

export const INSIGHT_SUBTITLES: Record<PlatformInsightId, string> = {
  growth: 'Institutions, users, modules, margin',
  peakHours: 'SAST hour distribution (30 days)',
  health: 'Active-user % and watchlist',
  usage: 'Storage, delivery, and cost',
  institutions: 'Top institutions by activity',
  profit: 'Margin bands over months',
};

export const HEALTH_EMPTY = 'No institution health data yet.';
export const DETAIL_LOAD_ERROR = 'Could not load this insight. Try again.';
