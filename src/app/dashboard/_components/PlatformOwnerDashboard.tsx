'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StatCard, { StatCardProps } from './StartCard';
import PageViewsBarChart from './PageViewBarChart';
import ActiveSubjectsChart from './ActiveSubjectChart';
import { Grid } from '@mui/material';
import { usePlatformOwnerDashboard } from '@/app/_lib/hooks/useDashboard';

export default function PlatformOwnerDashboard() {
  const { data: platformData, isLoading } = usePlatformOwnerDashboard();

  const platformStats: StatCardProps[] = [
    {
      title: 'Institutions',
      value: `${platformData?.institutions?.total}`,
      interval: 'Last 30 days',
      trend:
        platformData?.institutions?.trend === 'up' ||
          platformData?.institutions?.trend === 'down' ||
          platformData?.institutions?.trend === 'neutral'
          ? platformData?.institutions?.trend
          : 'neutral',
      data: platformData?.institutions?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Users',
      value: `${platformData?.users?.total}`,
      interval: 'Last 30 days',
      trend:
        platformData?.users?.trend === 'up' ||
          platformData?.users?.trend === 'down' ||
          platformData?.users?.trend === 'neutral'
          ? platformData?.users?.trend
          : 'neutral',
      data: platformData?.users?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Modules',
      value: `${platformData?.modules?.total}`,
      interval: 'Last 30 days',
      trend:
        platformData?.modules?.trend === 'up' ||
          platformData?.modules?.trend === 'down' ||
          platformData?.modules?.trend === 'neutral'
          ? platformData?.modules?.trend
          : 'neutral',
      data: platformData?.modules?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Total Cost (ZAR)',
      value: `${platformData?.totalCost?.total}`,
      interval: 'Last 30 days',
      trend:
        platformData?.totalCost?.trend === 'up' ||
          platformData?.totalCost?.trend === 'down' ||
          platformData?.totalCost?.trend === 'neutral'
          ? platformData?.totalCost?.trend
          : 'neutral',
      data: platformData?.totalCost?.dataPoints || [],
      loading: isLoading,
    },
  ];

  return (
    <Grid
      container
      p={3}
      spacing={2}
      columns={12}
      sx={{
        mb: (theme) => theme.spacing(2),
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Dashboard Overview Header */}
      <Grid size={{ xs: 12 }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Platform Owner Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 'max-content' }}>
            Monitor your entire platform at a glance. The cards below show activity over the <strong>last 30 days</strong>—hover
            over the trend chip to see how performance compares between the first and second half of the period.
            The sparkline visualizes daily activity.
          </Typography>
        </Box>
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
          chipLabel="Last 30 days"
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
      {/* Extra stat card for Average Profit – full width at the bottom */}
      <Grid size={{ xs: 12, lg: 12 }}>
        <StatCard
          title="Average Profit Margin"
          value={`${platformData?.averageProfit?.total}%`}
          interval="Last 30 days"
          trend={
            platformData?.averageProfit?.trend === 'up' ||
              platformData?.averageProfit?.trend === 'down' ||
              platformData?.averageProfit?.trend === 'neutral'
              ? platformData?.averageProfit?.trend
              : 'neutral'
          }
          data={platformData?.averageProfit?.dataPoints || []}
          loading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
