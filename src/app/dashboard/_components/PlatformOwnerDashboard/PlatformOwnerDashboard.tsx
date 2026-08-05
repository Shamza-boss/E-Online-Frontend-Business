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
import {
  toneHex,
  urgencyFromActiveShare,
  urgencyFromAttentionCount,
  urgencyFromMargin,
  urgencyPaletteKey,
} from './urgency';

export type { PlatformOwnerDashboardProps } from './utils';

/** Usage rollup is the only panel not fully on the home payload. */
const REMOTE: ReadonlySet<PlatformInsightId> = new Set(['usage']);

export default function PlatformOwnerDashboard({
  initialData,
}: PlatformOwnerDashboardProps) {
  const theme = useTheme();
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

  const active7 = health?.activeInstitutionsLast7Days ?? 0;
  const active30 = health?.activeInstitutionsLast30Days ?? 0;
  const neverActivated = health?.neverActivatedInstitutions ?? 0;
  const orgUniverse = Math.max(active30 + neverActivated, active30, 1);

  const active7Tone = urgencyFromActiveShare(active7, orgUniverse);
  const active30Tone = urgencyFromActiveShare(active30, orgUniverse);
  const neverTone = urgencyFromAttentionCount(neverActivated);
  const healthTone =
    neverActivated > 0
      ? neverTone
      : urgencyFromActiveShare(active30, orgUniverse);
  const growthLatest = seriesLatest(growthSpark);
  const growthPrev =
    growthSpark.length > 1 ? growthSpark[growthSpark.length - 2] ?? 0 : growthLatest;
  const growthTone =
    growthLatest <= 0
      ? ('soon' as const)
      : growthLatest >= growthPrev
        ? ('time' as const)
        : ('calm' as const);
  const peakTone = peakTopCount > 0 ? ('calm' as const) : ('soon' as const);
  const profitTone = urgencyFromMargin(seriesAverage(profitSpark));
  const costTone = 'calm' as const;
  const institutionsTone =
    seriesTotal(institutionsSpark) <= 0 ? ('soon' as const) : ('time' as const);

  const active7Color = urgencyPaletteKey(active7Tone);
  const active30Color = urgencyPaletteKey(active30Tone);
  const neverColor = urgencyPaletteKey(neverTone);
  const healthColor = urgencyPaletteKey(healthTone);
  const growthColor = urgencyPaletteKey(growthTone);
  const peakColor = urgencyPaletteKey(peakTone);
  const profitColor = urgencyPaletteKey(profitTone);
  const costColor = urgencyPaletteKey(costTone);
  const institutionsColor = urgencyPaletteKey(institutionsTone);

  const growthChartColor = toneHex(theme, growthTone);
  const peakChartColor = toneHex(theme, peakTone);
  const healthChartColor = toneHex(theme, healthTone);
  const costChartColor = toneHex(theme, costTone);
  const institutionsChartColor = toneHex(theme, institutionsTone);
  const profitChartColor = toneHex(theme, profitTone);

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
            value: `${active7}`,
            hint: 'Institutions with presence',
            valueColor: active7Color,
            onOpen: open('health'),
          },
          {
            label: 'Active 30d',
            value: `${active30}`,
            hint: 'Rolling month',
            valueColor: active30Color,
            onOpen: open('health'),
          },
          {
            label: 'Never activated',
            value: `${neverActivated}`,
            hint: 'Onboarding failures',
            valueColor: neverActivated > 0 ? neverColor : 'primary.main',
            onOpen: open('health'),
          },
          {
            label: 'Peak hour',
            value: topPeakLabel(platformData?.peakUsageHours),
            hint: 'Last 30 days SAST',
            valueColor: peakColor,
            onOpen: open('peakHours'),
          },
        ]}
      >
        <InsightSummaryCard
          title={INSIGHT_TITLES.growth}
          value={growthLatest}
          valueHint="users (latest)"
          valueColor={growthColor}
          onOpen={open('growth')}
          hoverTooltip="Latest user growth pulse. Green when rising, orange when flat/empty."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={growthSpark.length ? growthSpark : [0]}
              height={100}
              color={growthChartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.peakHours}
          value={topPeakLabel(platformData?.peakUsageHours)}
          valueHint={`${peakTopCount} peak events`}
          valueColor={peakColor}
          onOpen={open('peakHours')}
          hoverTooltip="Peak usage hour (SAST) over the last 30 days."
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
                  color: peakChartColor,
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
          value={active30}
          valueHint="active orgs 30d"
          valueColor={healthColor}
          onOpen={open('health')}
          hoverTooltip={`Active orgs 30d: ${active30}. Never activated: ${neverActivated}. Red = onboarding gaps; green = healthy share.`}
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
                  color: healthChartColor,
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
          valueColor={costColor}
          onOpen={open('usage')}
          hoverTooltip="Platform usage cost trend for the period."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={costSpark.length ? costSpark : [0]}
              height={100}
              color={costChartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.institutions}
          value={seriesTotal(institutionsSpark)}
          valueHint="activity total"
          valueColor={institutionsColor}
          onOpen={open('institutions')}
          hoverTooltip="Institution activity total across the spark series."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={institutionsSpark.length ? institutionsSpark : [0]}
              height={100}
              color={institutionsChartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.profit}
          value={`${seriesAverage(profitSpark)}%`}
          valueHint="avg margin"
          valueColor={profitColor}
          onOpen={open('profit')}
          hoverTooltip="Average profit margin. Red below 50%, green at 75%+."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={profitSpark.length ? profitSpark : [0]}
              height={100}
              color={profitChartColor}
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
