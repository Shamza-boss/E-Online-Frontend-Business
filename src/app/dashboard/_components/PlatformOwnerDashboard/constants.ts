export const DASHBOARD_TITLE = 'Platform Owner Dashboard';
export const DASHBOARD_DESCRIPTION =
  'Platform-wide metrics and activity over the last 30 days.';

export const STAT_INTERVAL = 'Last 30 days';
export const CHIP_LABEL = 'Last 30 days';

export const ACTIVE_INSTITUTIONS_CHART = {
  title: 'Most active institutions',
  description: 'Daily user activity by institution in the last 30 days',
  yAxisLabel: 'Total Users',
} as const;

export const PROFIT_MARGIN_CHART = {
  title: 'Profit Margin Distribution',
  description: 'Monthly profit margin breakdown across institutions in the last 6 months',
  yAxisLabel: 'Profit Margin (%)',
  valueLabel: 'institutions',
} as const;

export const AVERAGE_PROFIT_TITLE = 'Average Profit Margin';

export const PLATFORM_STAT_LABELS = [
  'Institutions',
  'Users',
  'Modules',
  'Total Cost (ZAR)',
] as const;
