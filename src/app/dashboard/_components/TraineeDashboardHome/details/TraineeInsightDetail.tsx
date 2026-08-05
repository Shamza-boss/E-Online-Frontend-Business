'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { GridColDef } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartPanel, ChartRow } from '../../RoleHomeShell';
import InsightDataGrid from '../../InsightDataGrid';
import type {
  TraineeDueItemDto,
  TraineeHomeDashboardDto,
} from '@/app/_lib/types/dashboardHome';
import type { TraineeInsightId } from '@/app/_lib/types/dashboardInsights';
import type { TraineeActivityInsightDto } from '@/app/_lib/types/dashboardInsights';
import {
  ACTIVITY_EMPTY,
  EXAM_EMPTY,
  NEXT_DUE_EMPTY,
} from '../constants';
import { formatDue, formatRate } from '../utils';
import { formatSaDateShort } from '@/app/_lib/utils/datetime';

type TraineeInsightDetailProps = {
  insight: TraineeInsightId;
  detail: unknown;
  homeData?: TraineeHomeDashboardDto;
};

function DueItemsDataGrid({ items }: { items: TraineeDueItemDto[] }) {
  const rows = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        id: item.assignmentId || `due-${index}`,
      })),
    [items],
  );

  const columns = useMemo<GridColDef<(typeof rows)[number]>[]>(
    () => [
      {
        field: 'title',
        headerName: 'Assignment',
        flex: 1.4,
        minWidth: 200,
      },
      {
        field: 'dueDate',
        headerName: 'Due',
        flex: 1,
        minWidth: 160,
        valueGetter: (_value, row) => row.dueDate ?? '',
        renderCell: (params) => formatDue(params.row.dueDate),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 160,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {params.row.isOverdue ? (
              <Chip size="small" color="error" label="Overdue" />
            ) : (
              <Chip size="small" color="primary" variant="outlined" label="Due soon" />
            )}
            {params.row.isExam ? (
              <Chip size="small" color="warning" label="Exam" />
            ) : null}
          </Stack>
        ),
      },
    ],
    [],
  );

  return (
    <InsightDataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage={NEXT_DUE_EMPTY}
      mobileHiddenFields={['status']}
    />
  );
}

export default function TraineeInsightDetail({
  insight,
  detail,
  homeData,
}: TraineeInsightDetailProps) {
  const theme = useTheme();

  if (insight === 'progress') {
    return (
      <Stack spacing={2}>
        <Typography variant="body1">
          Average grade {Math.round(homeData?.myAverageGrade ?? 0)} · Submission{' '}
          {formatRate(homeData?.mySubmissionRate)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Recent graded modules appear here as you complete work. Open individual
          modules from Courses for feedback detail.
        </Typography>
      </Stack>
    );
  }

  if (insight === 'activity') {
    const data = (detail ?? {}) as TraineeActivityInsightDto;
    const mix = (data.eventMix ?? []).map((item, index) => ({
      id: index,
      label: item.label ?? 'Event',
      value: item.value ?? 0,
    }));
    if (mix.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          {ACTIVITY_EMPTY}
        </Typography>
      );
    }
    return (
      <ChartRow>
        <ChartPanel elevation={0} variant="outlined" sx={{ flex: '1 1 280px' }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Activity mix
          </Typography>
          <PieChart
            height={280}
            series={[
              {
                data: mix,
                innerRadius: 48,
                outerRadius: 100,
                paddingAngle: 3,
                cornerRadius: 6,
                arcLabel: (item) => `${item.value}`,
                arcLabelMinAngle: 18,
              },
            ]}
            margin={{ top: 8, bottom: 8, left: 8, right: 8 }}
          />
        </ChartPanel>
        <ChartPanel elevation={0} variant="outlined" sx={{ flex: '1.4 1 360px' }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Daily events
          </Typography>
          <BarChart
            height={280}
            borderRadius={6}
            xAxis={[
              {
                data: (data.dailyEvents ?? []).map((row) => {
                  if (!row.date) return '';
                  return formatSaDateShort(row.date, row.date);
                }),
                scaleType: 'band',
                tickInterval: (_v, i) => i % 3 === 0,
              },
            ]}
            series={[
              {
                data: (data.dailyEvents ?? []).map((row) => row.count ?? 0),
                label: 'Events',
                color: theme.palette.info.main,
              },
            ]}
            margin={{ left: 24, right: 8, top: 16, bottom: 8 }}
            grid={{ horizontal: true }}
          />
        </ChartPanel>
      </ChartRow>
    );
  }

  if (insight === 'workload' || insight === 'nextDue') {
    return (
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Due soon {homeData?.dueSoonCount ?? 0} · Overdue {homeData?.overdueCount ?? 0}
        </Typography>
        <DueItemsDataGrid items={homeData?.nextDue ?? []} />
      </Stack>
    );
  }

  return (
    <ChartPanel elevation={0} variant="outlined">
      <Typography variant="subtitle2" fontWeight={700}>
        Next exam
      </Typography>
      {homeData?.nextExamTitle || homeData?.nextExamScheduledAt ? (
        <>
          <Typography variant="body1" fontWeight={600}>
            {homeData?.nextExamTitle ?? 'Exam'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDue(homeData?.nextExamScheduledAt)}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {EXAM_EMPTY}
        </Typography>
      )}
    </ChartPanel>
  );
}
