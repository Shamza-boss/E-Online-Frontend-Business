'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { RadarChart } from '@mui/x-charts/RadarChart';
import type { GridColDef } from '@mui/x-data-grid';
import ActiveSubjectsChart from '../../ActiveSubjectsChart';
import InsightDataGrid from '../../InsightDataGrid';
import PageViewsBarChart from '../../PageViewsBarChart';
import { ChartPanel, ChartRow } from '../../RoleHomeShell';
import {
  dashboardChartColor,
  dashboardCompareColors,
} from '../../RoleHomeShell/chartTheme';
import {
  formatTrendAverage,
  normalizeGradeTrendColor,
} from '../../MainGrid/utils';
import { RoleChip } from '@/app/_lib/components/role/roleChip';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import type {
  InactiveUserSummaryDto,
  InstitutionTrendsDashboardDto,
} from '@/app/_lib/interfaces/types';
import type { AdminInsightId } from '@/app/_lib/types/dashboardInsights';
import type {
  AdminContentInsightDto,
  AdminPresenceInsightDto,
} from '@/app/_lib/types/dashboardInsights';
import { FOLLOW_UP_EMPTY } from '../constants';
import {
  averageModuleSubmissionRate,
  buildEngagementRadar,
  buildModuleActivityBars,
  buildModuleRateBars,
  buildPresenceBars,
  formatPercent,
  formatPresence,
  getRecentModules,
  totalModuleSubmissions,
} from '../utils';

type AdminInsightDetailProps = {
  insight: AdminInsightId;
  detail: unknown;
  homeData?: InstitutionTrendsDashboardDto;
};

function FollowUpsDataGrid({
  users,
}: {
  users: InactiveUserSummaryDto[];
}) {
  const rows = useMemo(
    () =>
      users.map((user, index) => ({
        ...user,
        id: user.userId ?? `inactive-${index}`,
      })),
    [users],
  );

  const columns = useMemo<GridColDef<(typeof rows)[number]>[]>(
    () => [
      {
        field: 'firstName',
        headerName: 'First name',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'lastName',
        headerName: 'Last name',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1.2,
        minWidth: 200,
      },
      {
        field: 'role',
        headerName: 'Role',
        flex: 0.8,
        minWidth: 120,
        renderCell: (params) => {
          const role = params.row.role;
          if (role == null) return '—';
          return <RoleChip role={role as UserRole} />;
        },
      },
      {
        field: 'lastSeenAt',
        headerName: 'Last seen',
        flex: 0.9,
        minWidth: 140,
        valueGetter: (_value, row) => row.lastSeenAt ?? '',
        renderCell: (params) => formatPresence(params.row.lastSeenAt),
      },
    ],
    [],
  );

  return (
    <InsightDataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage={FOLLOW_UP_EMPTY}
      mobileHiddenFields={['email']}
    />
  );
}

function dailyLabels(rows: Array<{ date?: string | null; count?: number }> | null | undefined) {
  return (rows ?? []).map((row) => {
    if (!row.date) return '';
    try {
      return new Date(row.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return row.date;
    }
  });
}

function dailyCounts(rows: Array<{ date?: string | null; count?: number }> | null | undefined) {
  return (rows ?? []).map((row) => row.count ?? 0);
}

export default function AdminInsightDetail({
  insight,
  detail,
  homeData,
}: AdminInsightDetailProps) {
  const theme = useTheme();
  const chartColor = dashboardChartColor(theme);
  const compare = dashboardCompareColors(theme);

  if (insight === 'presence') {
    const remote = detail as AdminPresenceInsightDto | null;
    const presence = buildPresenceBars(homeData);
    const hasDaily = (remote?.dailyActiveUsers?.length ?? 0) > 0;
    return (
      <Stack spacing={3}>
        <ChartPanel elevation={0} variant="outlined">
          <Typography variant="subtitle2" fontWeight={700}>
            {hasDaily ? 'Daily active users' : 'Presence snapshot'}
          </Typography>
          <BarChart
            height={280}
            borderRadius={6}
            xAxis={[
              {
                data: hasDaily
                  ? dailyLabels(remote?.dailyActiveUsers)
                  : presence.map((p) => p.label),
                scaleType: 'band',
                categoryGapRatio: 0.35,
                tickInterval: hasDaily ? (_v, i) => i % 3 === 0 : undefined,
              },
            ]}
            series={[
              {
                data: hasDaily
                  ? dailyCounts(remote?.dailyActiveUsers)
                  : presence.map((p) => p.value),
                label: 'Users',
                color: theme.palette.primary.main,
              },
            ]}
            margin={{ left: 32, right: 8, top: 16, bottom: 8 }}
            grid={{ horizontal: true }}
          />
          <Typography variant="caption" color="text.secondary">
            Active 7d {homeData?.activeUsersLast7Days ?? 0} · Active 30d{' '}
            {homeData?.activeUsersLast30Days ?? 0} · Never in{' '}
            {homeData?.neverLoggedInCount ?? 0} · Instructors{' '}
            {homeData?.activeInstructorsLast30Days ?? 0} · Trainees{' '}
            {homeData?.activeTraineesLast30Days ?? 0}
          </Typography>
        </ChartPanel>
      </Stack>
    );
  }

  if (insight === 'content') {
    const data = (detail ?? {}) as AdminContentInsightDto;
    const mix = (data.eventMix ?? []).map((item, index) => ({
      id: index,
      label: item.label ?? 'Event',
      value: item.value ?? 0,
    }));
    return (
      <ChartRow>
        <ChartPanel elevation={0} variant="outlined" sx={{ flex: '1 1 280px' }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Event mix
          </Typography>
          {mix.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No content events yet — they appear as people submit, note, open PDFs, and play video.
            </Typography>
          ) : (
            <PieChart
              height={280}
              series={[
                {
                  data: mix,
                  innerRadius: 50,
                  outerRadius: 100,
                  paddingAngle: 3,
                  cornerRadius: 6,
                  arcLabel: (item) => `${item.value}`,
                  arcLabelMinAngle: 18,
                },
              ]}
              margin={{ top: 8, bottom: 8, left: 8, right: 8 }}
            />
          )}
        </ChartPanel>
        <ChartPanel elevation={0} variant="outlined" sx={{ flex: '1.4 1 360px' }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Daily content events
          </Typography>
          <BarChart
            height={280}
            borderRadius={6}
            xAxis={[
              {
                data: dailyLabels(data.dailyContentEvents),
                scaleType: 'band',
                tickInterval: (_v, i) => i % 3 === 0,
              },
            ]}
            series={[
              {
                data: dailyCounts(data.dailyContentEvents),
                label: 'Events',
                color: chartColor,
              },
            ]}
            margin={{ left: 24, right: 8, top: 16, bottom: 8 }}
            grid={{ horizontal: true }}
          />
        </ChartPanel>
      </ChartRow>
    );
  }

  if (insight === 'engagement') {
    const radar = buildEngagementRadar(homeData);
    const labels =
      homeData?.notesCreated?.dataPoints?.map((_, i) => `${i + 1}`) ?? [];
    return (
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
          <Typography variant="body2">
            Submission {formatPercent(homeData?.engagement?.submissionRate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Avg notes {(homeData?.engagement?.avgNotePerStudent ?? 0).toFixed(1)} · Avg
            modules {(homeData?.engagement?.avgHomeworkAssigned ?? 0).toFixed(1)}
          </Typography>
        </Stack>
        <ChartPanel elevation={0} variant="outlined">
          <Typography variant="subtitle2" fontWeight={700}>
            Adoption shape
          </Typography>
          <RadarChart
            height={320}
            series={[
              {
                data: radar.values,
                label: 'Adoption',
                color: chartColor,
                fillArea: true,
              },
            ]}
            radar={{ metrics: radar.metrics, max: 100 }}
            margin={{ top: 32, bottom: 32, left: 48, right: 48 }}
          />
        </ChartPanel>
        <ChartPanel elevation={0} variant="outlined">
          <Typography variant="subtitle2" fontWeight={700}>
            Notes & modules created (30d)
          </Typography>
          <LineChart
            height={280}
            xAxis={[{ data: labels, scaleType: 'point' }]}
            series={[
              {
                data: homeData?.notesCreated?.dataPoints ?? [],
                label: 'Notes',
                color: compare.neutral,
                showMark: false,
              },
              {
                data: homeData?.homeworkCreated?.dataPoints ?? [],
                label: 'Modules',
                color: compare.primary,
                showMark: false,
              },
            ]}
            margin={{ left: 32, right: 8, top: 16, bottom: 8 }}
            grid={{ horizontal: true }}
          />
        </ChartPanel>
      </Stack>
    );
  }

  if (insight === 'subjects') {
    return (
      <ActiveSubjectsChart
        labels={homeData?.mostActiveSubjects?.labels ?? []}
        series={homeData?.mostActiveSubjects?.series ?? []}
      />
    );
  }

  if (insight === 'grades') {
    const gradeTrend = homeData?.gradePerformanceTrends;
    return (
      <PageViewsBarChart
        isLoading={false}
        months={homeData?.gradePerformanceMonths ?? []}
        series={homeData?.gradePerformance ?? []}
        trend={normalizeGradeTrendColor(gradeTrend?.color)}
        average={formatTrendAverage(gradeTrend?.average)}
        numberOfTrainees={homeData?.students?.total ?? 0}
      />
    );
  }

  if (insight === 'followUps') {
    return <FollowUpsDataGrid users={homeData?.inactiveUsers ?? []} />;
  }

  const modules = getRecentModules(homeData);
  const avgRate = averageModuleSubmissionRate(modules);
  const submits = totalModuleSubmissions(modules);
  const activity = buildModuleActivityBars(modules, 8);
  const rates = buildModuleRateBars(modules, 8);

  if (modules.length === 0) {
    return (
      <ChartPanel elevation={0} variant="outlined">
        <Typography variant="body2" color="text.secondary">
          No recent modules yet.
        </Typography>
      </ChartPanel>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip size="small" color="primary" label={`${modules.length} modules`} />
        <Chip
          size="small"
          variant="outlined"
          label={`${formatPercent(avgRate)} avg submission`}
        />
        <Chip size="small" variant="outlined" label={`${submits} submissions`} />
      </Stack>

      <ChartPanel elevation={0} variant="outlined">
        <Typography variant="subtitle2" fontWeight={700}>
          Assigned vs submitted
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Gaps between trainees assigned and submissions completed per module.
        </Typography>
        <BarChart
          height={320}
          borderRadius={6}
          xAxis={[
            {
              data: activity.labels,
              scaleType: 'band',
              categoryGapRatio: 0.35,
            },
          ]}
          series={[
            {
              data: activity.assigned,
              label: 'Assigned',
              color: compare.neutral,
            },
            {
              data: activity.submitted,
              label: 'Submitted',
              color: compare.primary,
            },
          ]}
          margin={{ left: 36, right: 12, top: 24, bottom: 48 }}
          grid={{ horizontal: true }}
        />
      </ChartPanel>

      <ChartPanel elevation={0} variant="outlined">
        <Typography variant="subtitle2" fontWeight={700}>
          Submission rate ranking
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Highest completion rates first (percent).
        </Typography>
        <BarChart
          height={Math.max(240, rates.labels.length * 36)}
          layout="horizontal"
          borderRadius={4}
          yAxis={[
            {
              data: rates.labels,
              scaleType: 'band',
              width: 120,
            },
          ]}
          series={[
            {
              data: rates.rates,
              label: 'Rate %',
              color: chartColor,
            },
          ]}
          margin={{ left: 8, right: 24, top: 16, bottom: 8 }}
          grid={{ vertical: true }}
        />
      </ChartPanel>
    </Stack>
  );
}
