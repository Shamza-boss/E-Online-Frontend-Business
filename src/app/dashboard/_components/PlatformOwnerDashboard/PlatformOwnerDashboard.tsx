'use client';

import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import StatCard from '../StatCard';
import type { StatCardProps } from '../StatCard';
import PageViewsBarChart from '../PageViewsBarChart';
import ActiveSubjectsChart from '../ActiveSubjectsChart';
import { usePlatformOwnerDashboard } from '@/app/_lib/hooks/useDashboard';
import {
  DASHBOARD_TITLE,
  STAT_INTERVAL,
  CHIP_LABEL,
} from './constants';
import { normalizeTrend } from './utils';
import { DashboardGrid, HeaderBox, DescriptionText } from './elements';

export default function PlatformOwnerDashboard() {
  const { data: platformData, isLoading } = usePlatformOwnerDashboard();

  const platformStats: StatCardProps[] = [
    {
      title: 'Institutions',
      value: `${platformData?.institutions?.total}`,
      interval: STAT_INTERVAL,
      trend: normalizeTrend(platformData?.institutions?.trend),
      data: platformData?.institutions?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Users',
      value: `${platformData?.users?.total}`,
      interval: STAT_INTERVAL,
      trend: normalizeTrend(platformData?.users?.trend),
      data: platformData?.users?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Modules',
      value: `${platformData?.modules?.total}`,
      interval: STAT_INTERVAL,
      trend: normalizeTrend(platformData?.modules?.trend),
      data: platformData?.modules?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Total Cost (ZAR)',
      value: `${platformData?.totalCost?.total}`,
      interval: STAT_INTERVAL,
      trend: normalizeTrend(platformData?.totalCost?.trend),
      data: platformData?.totalCost?.dataPoints || [],
      loading: isLoading,
    },
  ];

  return (
    <DashboardGrid container spacing={2} columns={12} p={3}>
      <Grid size={{ xs: 12 }}>
        <HeaderBox>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {DASHBOARD_TITLE}
          </Typography>
          <DescriptionText variant="body2" color="text.secondary">
            Monitor your entire platform at a glance. The cards below show activity over the{' '}
            <strong>last 30 days</strong>—hover over the trend chip to see how performance compares
            between the first and second half of the period. The sparkline visualizes daily activity.
          </DescriptionText>
        </HeaderBox>
      </Grid>

      {platformStats.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...card} />
        </Grid>
      ))}

      <Grid size={{ xs: 12, md: 6 }}>
        <ActiveSubjectsChart
          isLoading={isLoading}
          labels={platformData?.mostActiveInstitutions?.labels || []}
          series={platformData?.mostActiveInstitutions?.series || []}
          title="Most active institutions"
          description="Daily user activity by institution in the last 30 days"
          yAxisLabel="Total Users"
          chipLabel={CHIP_LABEL}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <PageViewsBarChart
          isLoading={isLoading}
          months={platformData?.profitMarginMonths || []}
          series={platformData?.profitMarginPerformance || []}
          trend={platformData?.profitMarginTrends?.color || 'default'}
          numberOfTrainees={platformData?.users?.total || 0}
          title="Profit Margin Distribution"
          description="Monthly profit margin breakdown across institutions in the last 6 months"
          yAxisLabel="Profit Margin (%)"
          valueLabel="institutions"
          average={
            platformData?.profitMarginTrends?.average != null
              ? `+${platformData.profitMarginTrends.average.toFixed(1)}%`
              : '+0%'
          }
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 12 }}>
        <StatCard
          title="Average Profit Margin"
          value={`${platformData?.averageProfit?.total}%`}
          interval={STAT_INTERVAL}
          trend={normalizeTrend(platformData?.averageProfit?.trend)}
          data={platformData?.averageProfit?.dataPoints || []}
          loading={isLoading}
        />
      </Grid>
    </DashboardGrid>
  );
}
