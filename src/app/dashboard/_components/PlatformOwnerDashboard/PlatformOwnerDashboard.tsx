'use client';

import { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import RoleHomeShell from '../RoleHomeShell';
import { miniChartMargin, miniChartSx } from '../RoleHomeShell/miniChart';
import {
  dashboardChartColor,
  seriesAverage,
  seriesLatest,
  seriesTotal,
} from '../RoleHomeShell/chartTheme';
import InsightSummaryCard from '../InsightSummaryCard';
import DashboardDetailModal from '../DashboardDetailModal';
import {
  usePlatformOwnerDashboard,
  useDashboardInsight,
} from '@/app/_lib/hooks/useDashboard';
import type { PlatformOwnerHealthFields } from '@/app/_lib/types/dashboardHome';
import type { PlatformInsightId } from '@/app/_lib/types/dashboardInsights';
import {
  DASHBOARD_DESCRIPTION,
  DASHBOARD_TITLE,
  DETAIL_LOAD_ERROR,
  INSIGHT_SUBTITLES,
  INSIGHT_TITLES,
} from './constants';
import {
  buildHealthBars,
  buildPeakHourSeries,
  topPeakLabel,
} from './utils';
import type {
  PlatformOwnerDashboardProps,
  PlatformOwnerDashboardView,
} from './utils';
import PlatformInsightDetail from './details/PlatformInsightDetail';

export type { PlatformOwnerDashboardProps } from './utils';

/** Usage rollup is the only panel not fully on the home payload. */
const REMOTE: ReadonlySet<PlatformInsightId> = new Set(['usage']);

export default function PlatformOwnerDashboard({
  initialData,
}: PlatformOwnerDashboardProps) {
  const theme = useTheme();
  const chartColor = dashboardChartColor(theme);
  const { data: platformData, isLoading } = usePlatformOwnerDashboard(initialData);
  const [activeInsight, setActiveInsight] = useState<PlatformInsightId | null>(null);
  const needsRemote =
    activeInsight != null && REMOTE.has(activeInsight);
  const {
    data: remoteDetail,
    isLoading: detailLoading,
  } = useDashboardInsight('platform', needsRemote ? activeInsight : null);
  const remoteFailed = needsRemote && !detailLoading && remoteDetail == null;

  const view = platformData as PlatformOwnerDashboardView | undefined;
  const health = platformData as PlatformOwnerHealthFields | undefined;
  const peak = buildPeakHourSeries(platformData?.peakUsageHours);
  const healthRows = buildHealthBars(view?.institutionHealth ?? []);
  const institutionsSpark =
    platformData?.mostActiveInstitutions?.series?.[0]?.data ?? [0];
  const profitSpark = platformData?.profitMarginPerformance?.[0]?.data ?? [0];
  const costSpark = platformData?.totalCost?.dataPoints ?? [0];
  const growthSpark = platformData?.users?.dataPoints ?? [0];
  const peakTopCount = Math.max(...(peak.counts.length ? peak.counts : [0]));

  const open = (id: PlatformInsightId) => () => setActiveInsight(id);
  const close = () => setActiveInsight(null);

  return (
    <>
      <RoleHomeShell
        title={DASHBOARD_TITLE}
        description={DASHBOARD_DESCRIPTION}
        heroes={[
          {
            label: 'Active 7d',
            value: `${health?.activeInstitutionsLast7Days ?? 0}`,
            hint: 'Institutions with presence',
            onOpen: open('health'),
          },
          {
            label: 'Active 30d',
            value: `${health?.activeInstitutionsLast30Days ?? 0}`,
            hint: 'Rolling month',
            onOpen: open('health'),
          },
          {
            label: 'Never activated',
            value: `${health?.neverActivatedInstitutions ?? 0}`,
            hint: 'Onboarding failures',
            onOpen: open('health'),
          },
          {
            label: 'Peak hour',
            value: topPeakLabel(platformData?.peakUsageHours),
            hint: 'Last 30 days UTC',
            onOpen: open('peakHours'),
          },
        ]}
      >
        <InsightSummaryCard
          title={INSIGHT_TITLES.growth}
          value={seriesLatest(growthSpark)}
          valueHint="users (latest)"
          onOpen={open('growth')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={growthSpark.length ? growthSpark : [0]}
              height={100}
              color={chartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.peakHours}
          value={topPeakLabel(platformData?.peakUsageHours)}
          valueHint={`${peakTopCount} peak events`}
          onOpen={open('peakHours')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <BarChart
              height={100}
              borderRadius={3}
              xAxis={[
                {
                  data: peak.hours.map((_, i) => i),
                  scaleType: 'band',
                },
              ]}
              series={[
                {
                  data: peak.counts,
                  color: chartColor,
                },
              ]}
              margin={miniChartMargin}
              hideLegend
              sx={miniChartSx}
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.health}
          value={health?.activeInstitutionsLast30Days ?? 0}
          valueHint="active orgs 30d"
          onOpen={open('health')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : healthRows.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No health data
            </Typography>
          ) : (
            <BarChart
              height={100}
              layout="horizontal"
              borderRadius={4}
              yAxis={[
                {
                  data: healthRows.slice(0, 4).map((_, i) => i),
                  scaleType: 'band',
                  width: 8,
                },
              ]}
              series={[
                {
                  data: healthRows.slice(0, 4).map((row) => row.activeUserPercent ?? 0),
                  color: chartColor,
                },
              ]}
              margin={miniChartMargin}
              hideLegend
              sx={miniChartSx}
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.usage}
          value={platformData?.totalCost?.total ?? 0}
          valueHint="total cost"
          onOpen={open('usage')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={costSpark.length ? costSpark : [0]}
              height={100}
              color={chartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.institutions}
          value={seriesTotal(institutionsSpark)}
          valueHint="activity total"
          onOpen={open('institutions')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={institutionsSpark.length ? institutionsSpark : [0]}
              height={100}
              color={chartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.profit}
          value={`${seriesAverage(profitSpark)}%`}
          valueHint="avg margin"
          onOpen={open('profit')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={profitSpark.length ? profitSpark : [0]}
              height={100}
              color={chartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>
      </RoleHomeShell>

      <DashboardDetailModal
        open={activeInsight != null}
        onClose={close}
        title={activeInsight ? INSIGHT_TITLES[activeInsight] : ''}
        subtitle={activeInsight ? INSIGHT_SUBTITLES[activeInsight] : undefined}
        loading={needsRemote && detailLoading}
        error={remoteFailed ? DETAIL_LOAD_ERROR : null}
      >
        {activeInsight ? (
          <PlatformInsightDetail
            insight={activeInsight}
            detail={needsRemote ? remoteDetail : null}
            homeData={platformData}
          />
        ) : null}
      </DashboardDetailModal>
    </>
  );
}
