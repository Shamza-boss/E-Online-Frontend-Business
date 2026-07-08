'use client';

import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import StatCard from '../StatCard';
import PageViewsBarChart from '../PageViewsBarChart';
import ActiveSubjectsChart from '../ActiveSubjectsChart';
import { usePlatformOwnerDashboard } from '@/app/_lib/hooks/useDashboard';
import type { PlatformOwnerDashboardDto } from '@/app/_lib/interfaces/types';
import { buildStatCard, formatTrendAverage, normalizeTrend } from '../MainGrid/utils';
import { DashboardGrid, HeaderBox, DescriptionText } from '../MainGrid/elements';
import {
  DASHBOARD_TITLE,
  DASHBOARD_DESCRIPTION,
  STAT_INTERVAL,
  CHIP_LABEL,
  ACTIVE_INSTITUTIONS_CHART,
  PROFIT_MARGIN_CHART,
  AVERAGE_PROFIT_TITLE,
} from './constants';
import { buildPlatformStats } from './utils';

export interface PlatformOwnerDashboardProps {
  initialData: PlatformOwnerDashboardDto;
}

export default function PlatformOwnerDashboard({
  initialData,
}: PlatformOwnerDashboardProps) {
  const { data: platformData, isLoading } = usePlatformOwnerDashboard(initialData);

  const platformStats = buildPlatformStats(platformData, isLoading);
  const profitTrend = platformData?.profitMarginTrends;

  return (
    <DashboardGrid container spacing={{ xs: 1.5, sm: 2 }} columns={12}>
      <Grid size={{ xs: 12 }}>
        <HeaderBox>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {DASHBOARD_TITLE}
          </Typography>
          <DescriptionText variant="body2" color="text.secondary">
            {DASHBOARD_DESCRIPTION}
          </DescriptionText>
        </HeaderBox>
      </Grid>

      {platformStats.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...card} />
        </Grid>
      ))}

      <Grid size={{ xs: 12, md: 6 }}>
        <ActiveSubjectsChart
          isLoading={isLoading}
          labels={platformData?.mostActiveInstitutions?.labels ?? []}
          series={platformData?.mostActiveInstitutions?.series ?? []}
          title={ACTIVE_INSTITUTIONS_CHART.title}
          description={ACTIVE_INSTITUTIONS_CHART.description}
          yAxisLabel={ACTIVE_INSTITUTIONS_CHART.yAxisLabel}
          chipLabel={CHIP_LABEL}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <PageViewsBarChart
          isLoading={isLoading}
          months={platformData?.profitMarginMonths ?? []}
          series={platformData?.profitMarginPerformance ?? []}
          trend={profitTrend?.color ?? 'default'}
          numberOfTrainees={platformData?.users?.total ?? 0}
          title={PROFIT_MARGIN_CHART.title}
          description={PROFIT_MARGIN_CHART.description}
          yAxisLabel={PROFIT_MARGIN_CHART.yAxisLabel}
          valueLabel={PROFIT_MARGIN_CHART.valueLabel}
          average={formatTrendAverage(profitTrend?.average)}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <StatCard
          title={AVERAGE_PROFIT_TITLE}
          value={`${platformData?.averageProfit?.total ?? 0}%`}
          interval={STAT_INTERVAL}
          trend={normalizeTrend(platformData?.averageProfit?.trend)}
          data={platformData?.averageProfit?.dataPoints ?? []}
          loading={isLoading}
        />
      </Grid>
    </DashboardGrid>
  );
}
