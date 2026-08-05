'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { GridColDef } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts/BarChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import ActiveSubjectsChart from '../../ActiveSubjectsChart';
import InsightDataGrid from '../../InsightDataGrid';
import PageViewsBarChart from '../../PageViewsBarChart';
import { ChartPanel, ChartRow } from '../../RoleHomeShell';
import { formatTrendAverage, normalizeGradeTrendColor } from '../../MainGrid/utils';
import type { PlatformOwnerDashboardDto } from '@/app/_lib/interfaces/types';
import type {
  InstitutionHealthDto,
  PlatformOwnerHealthFields,
} from '@/app/_lib/types/dashboardHome';
import type { PlatformInsightId } from '@/app/_lib/types/dashboardInsights';
import type { PlatformUsageInsightDto } from '@/app/_lib/types/dashboardInsights';
import {
  ACTIVE_INSTITUTIONS_CHART,
  CHIP_LABEL,
  HEALTH_EMPTY,
  PROFIT_MARGIN_CHART,
} from '../constants';
import {
  buildHealthBars,
  buildPeakHourSeries,
  formatActivePercent,
  formatLastActive,
} from '../utils';

type HomeView = PlatformOwnerDashboardDto & PlatformOwnerHealthFields;

type PlatformInsightDetailProps = {
  insight: PlatformInsightId;
  detail: unknown;
  homeData?: PlatformOwnerDashboardDto;
};

function formatBytes(bytes: number | undefined): string {
  if (bytes == null || Number.isNaN(bytes)) return '0 B';
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function formatHours(seconds: number | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '0 h';
  return `${(seconds / 3600).toFixed(1)} h`;
}

function HealthWatchlistDataGrid({ rows }: { rows: InstitutionHealthDto[] }) {
  const gridRows = useMemo(
    () =>
      rows.map((row, index) => ({
        ...row,
        id: row.institutionId || `org-${index}`,
      })),
    [rows],
  );

  const columns = useMemo<GridColDef<(typeof gridRows)[number]>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Institution',
        flex: 1.3,
        minWidth: 180,
      },
      {
        field: 'lastActiveAt',
        headerName: 'Last active',
        flex: 1,
        minWidth: 140,
        valueGetter: (_value, row) => row.lastActiveAt ?? '',
        renderCell: (params) => formatLastActive(params.row.lastActiveAt),
      },
      {
        field: 'activeUserPercent',
        headerName: 'Active %',
        flex: 0.8,
        minWidth: 110,
        valueGetter: (_value, row) => row.activeUserPercent ?? 0,
        renderCell: (params) => formatActivePercent(params.row.activeUserPercent),
      },
      {
        field: 'neverActivated',
        headerName: 'Status',
        flex: 1,
        minWidth: 140,
        sortable: false,
        renderCell: (params) =>
          params.row.neverActivated ? (
            <Chip size="small" color="warning" label="Never activated" />
          ) : (
            <Chip size="small" color="success" variant="outlined" label="Active" />
          ),
      },
    ],
    [],
  );

  return (
    <InsightDataGrid
      rows={gridRows}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage={HEALTH_EMPTY}
      mobileHiddenFields={['neverActivated']}
    />
  );
}

export default function PlatformInsightDetail({
  insight,
  detail,
  homeData,
}: PlatformInsightDetailProps) {
  const theme = useTheme();
  const home = homeData as HomeView | undefined;

  if (insight === 'growth') {
    const metrics = [
      {
        label: 'Institutions',
        value: `${home?.institutions?.total ?? 0}`,
        spark: home?.institutions?.dataPoints ?? [0],
      },
      {
        label: 'Users',
        value: `${home?.users?.total ?? 0}`,
        spark: home?.users?.dataPoints ?? [0],
      },
      {
        label: 'Modules',
        value: `${home?.modules?.total ?? 0}`,
        spark: home?.modules?.dataPoints ?? [0],
      },
      {
        label: 'Avg margin',
        value: `${home?.averageProfit?.total ?? 0}%`,
        spark: home?.averageProfit?.dataPoints ?? [0],
      },
    ];
    return (
      <ChartRow>
        {metrics.map((metric) => (
          <ChartPanel
            key={metric.label}
            elevation={0}
            variant="outlined"
            sx={{ flex: '1 1 180px' }}
          >
            <Typography variant="caption" color="text.secondary" textTransform="uppercase">
              {metric.label}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {metric.value}
            </Typography>
            <SparkLineChart
              data={metric.spark.length ? metric.spark : [0]}
              height={64}
              color={theme.palette.primary.main}
              curve="natural"
              area
            />
          </ChartPanel>
        ))}
      </ChartRow>
    );
  }

  if (insight === 'peakHours') {
    const peak = buildPeakHourSeries(home?.peakUsageHours);
    return (
      <ChartPanel elevation={0} variant="outlined">
        <Typography variant="subtitle2" fontWeight={700}>
          Login / session heat (SAST)
        </Typography>
        <BarChart
          height={320}
          borderRadius={4}
          xAxis={[
            {
              data: peak.hours,
              scaleType: 'band',
              tickInterval: (_v, i) => i % 3 === 0,
            },
          ]}
          series={[
            {
              data: peak.counts,
              label: 'Events',
              color: theme.palette.info.main,
            },
          ]}
          margin={{ left: 32, right: 8, top: 12, bottom: 8 }}
          grid={{ horizontal: true }}
        />
      </ChartPanel>
    );
  }

  if (insight === 'health') {
    const rows = buildHealthBars(home?.institutionHealth ?? []);
    return (
      <Stack spacing={3}>
        <ChartPanel elevation={0} variant="outlined">
          <Typography variant="subtitle2" fontWeight={700}>
            Active-user %
          </Typography>
          {rows.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {HEALTH_EMPTY}
            </Typography>
          ) : (
            <BarChart
              height={Math.max(220, rows.length * 32)}
              layout="horizontal"
              borderRadius={6}
              yAxis={[
                {
                  data: rows.map((row) => row.name),
                  scaleType: 'band',
                  width: 120,
                },
              ]}
              series={[
                {
                  data: rows.map((row) => row.activeUserPercent ?? 0),
                  label: 'Active %',
                  color: theme.palette.success.main,
                },
              ]}
              margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              grid={{ vertical: true }}
            />
          )}
        </ChartPanel>
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            Watchlist
          </Typography>
          <HealthWatchlistDataGrid rows={rows} />
        </Stack>
      </Stack>
    );
  }

  if (insight === 'usage') {
    const data = (detail ?? {}) as PlatformUsageInsightDto;
    const metrics = [
      { label: 'Stored video', value: formatHours(data.storedVideoSeconds) },
      { label: 'Delivered video', value: formatHours(data.deliveredVideoSeconds) },
      { label: 'PDF storage', value: formatBytes(data.pdfStorageBytes) },
      { label: 'PDF downloads', value: `${data.pdfDownloads ?? 0}` },
      {
        label: 'Est. revenue / mo',
        value: `R ${(data.estimatedMonthlyRevenueZar ?? 0).toFixed(0)}`,
      },
      {
        label: 'Est. cost / mo',
        value: `R ${(data.estimatedMonthlyCostZar ?? 0).toFixed(0)}`,
      },
    ];
    return (
      <ChartRow>
        {metrics.map((metric) => (
          <ChartPanel
            key={metric.label}
            elevation={0}
            variant="outlined"
            sx={{ flex: '1 1 160px' }}
          >
            <Typography variant="caption" color="text.secondary" textTransform="uppercase">
              {metric.label}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.75 }}>
              {metric.value}
            </Typography>
          </ChartPanel>
        ))}
      </ChartRow>
    );
  }

  if (insight === 'institutions') {
    return (
      <ActiveSubjectsChart
        labels={home?.mostActiveInstitutions?.labels ?? []}
        series={home?.mostActiveInstitutions?.series ?? []}
        title={ACTIVE_INSTITUTIONS_CHART.title}
        description={ACTIVE_INSTITUTIONS_CHART.description}
        yAxisLabel={ACTIVE_INSTITUTIONS_CHART.yAxisLabel}
        chipLabel={CHIP_LABEL}
      />
    );
  }

  const profitTrend = home?.profitMarginTrends;
  return (
    <PageViewsBarChart
      isLoading={false}
      months={home?.profitMarginMonths ?? []}
      series={home?.profitMarginPerformance ?? []}
      trend={normalizeGradeTrendColor(profitTrend?.color)}
      average={formatTrendAverage(profitTrend?.average)}
      numberOfTrainees={home?.users?.total ?? 0}
      title={PROFIT_MARGIN_CHART.title}
      description={PROFIT_MARGIN_CHART.description}
      yAxisLabel={PROFIT_MARGIN_CHART.yAxisLabel}
      valueLabel={PROFIT_MARGIN_CHART.valueLabel}
    />
  );
}
