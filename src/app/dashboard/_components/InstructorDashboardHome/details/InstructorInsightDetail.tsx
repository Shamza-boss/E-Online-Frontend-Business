'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { GridColDef } from '@mui/x-data-grid';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import InsightDataGrid from '../../InsightDataGrid';
import type {
  AtRiskTraineeDto,
  InstructorHomeDashboardDto,
} from '@/app/_lib/types/dashboardHome';
import type { InstructorInsightId } from '@/app/_lib/types/dashboardInsights';
import type {
  InstructorWorkloadInsightDto,
  PendingGradeItemDto,
  UpcomingModuleDto,
} from '@/app/_lib/types/dashboardInsights';
import { AT_RISK_EMPTY, WORKLOAD_EMPTY } from '../constants';
import { formatRate, toPercent } from '../utils';

type InstructorInsightDetailProps = {
  insight: InstructorInsightId;
  detail: unknown;
  homeData?: InstructorHomeDashboardDto;
};

function formatSubmittedAt(value: string | null | undefined): string {
  if (!value) return 'Submitted';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return 'Submitted';
  }
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return '—';
  }
}

function PendingGradeDataGrid({ items }: { items: PendingGradeItemDto[] }) {
  const rows = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        id: item.assignmentId || `grade-${index}`,
      })),
    [items],
  );

  const columns = useMemo<GridColDef<(typeof rows)[number]>[]>(
    () => [
      {
        field: 'moduleTitle',
        headerName: 'Module',
        flex: 1.3,
        minWidth: 180,
      },
      {
        field: 'traineeName',
        headerName: 'Trainee',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'submittedAt',
        headerName: 'Submitted',
        flex: 1,
        minWidth: 160,
        valueGetter: (_value, row) => row.submittedAt ?? '',
        renderCell: (params) => formatSubmittedAt(params.row.submittedAt),
      },
    ],
    [],
  );

  return (
    <InsightDataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage={WORKLOAD_EMPTY}
      mobileHiddenFields={['submittedAt']}
      initialPageSize={10}
    />
  );
}

function UpcomingDueDataGrid({ items }: { items: UpcomingModuleDto[] }) {
  const rows = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        id: item.homeworkId || `upcoming-${index}`,
      })),
    [items],
  );

  const columns = useMemo<GridColDef<(typeof rows)[number]>[]>(
    () => [
      {
        field: 'title',
        headerName: 'Module',
        flex: 1.4,
        minWidth: 180,
      },
      {
        field: 'dueDate',
        headerName: 'Due',
        flex: 0.9,
        minWidth: 120,
        valueGetter: (_value, row) => row.dueDate ?? '',
        renderCell: (params) => formatDate(params.row.dueDate),
      },
      {
        field: 'isExam',
        headerName: 'Type',
        flex: 0.7,
        minWidth: 100,
        renderCell: (params) =>
          params.row.isExam ? (
            <Chip size="small" color="warning" label="Exam" />
          ) : (
            <Chip size="small" variant="outlined" label="Module" />
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
      emptyMessage="No upcoming due modules."
      mobileHiddenFields={['isExam']}
      initialPageSize={10}
    />
  );
}

function AtRiskDataGrid({ trainees }: { trainees: AtRiskTraineeDto[] }) {
  const rows = useMemo(
    () =>
      trainees.map((trainee, index) => ({
        ...trainee,
        id: trainee.userId || `at-risk-${index}`,
      })),
    [trainees],
  );

  const columns = useMemo<GridColDef<(typeof rows)[number]>[]>(
    () => [
      {
        field: 'firstName',
        headerName: 'First name',
        flex: 1,
        minWidth: 110,
      },
      {
        field: 'lastName',
        headerName: 'Last name',
        flex: 1,
        minWidth: 110,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1.2,
        minWidth: 180,
      },
      {
        field: 'lastSeenAt',
        headerName: 'Last seen',
        flex: 0.9,
        minWidth: 120,
        valueGetter: (_value, row) => row.lastSeenAt ?? '',
        renderCell: (params) => formatDate(params.row.lastSeenAt),
      },
      {
        field: 'reason',
        headerName: 'Reason',
        flex: 1.2,
        minWidth: 180,
        renderCell: (params) => (
          <Chip
            size="small"
            color="warning"
            label={params.row.reason || 'At risk'}
          />
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
      emptyMessage={AT_RISK_EMPTY}
      mobileHiddenFields={['email']}
    />
  );
}

export default function InstructorInsightDetail({
  insight,
  detail,
  homeData,
}: InstructorInsightDetailProps) {
  const theme = useTheme();

  if (insight === 'submission') {
    const pct = toPercent(homeData?.mySubmissionRate);
    return (
      <Stack spacing={3} alignItems="center">
        <Gauge
          value={pct}
          startAngle={-110}
          endAngle={110}
          height={260}
          cornerRadius="50%"
          sx={{
            [`& .${gaugeClasses.valueText}`]: { fontSize: 36, fontWeight: 700 },
            [`& .${gaugeClasses.valueArc}`]: { fill: theme.palette.primary.main },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.action.hover,
            },
          }}
          text={({ value }) => `${value}%`}
        />
        <Typography variant="body1">
          Submission {formatRate(homeData?.mySubmissionRate)} ·{' '}
          {homeData?.pendingToGradeCount ?? 0} waiting to grade ·{' '}
          {homeData?.activeTraineesLast7Days ?? 0} active trainees (7d)
        </Typography>
      </Stack>
    );
  }

  if (insight === 'workload') {
    const data = (detail ?? {}) as InstructorWorkloadInsightDto;
    const queue = data.pendingGradeQueue ?? [];
    const upcoming = data.upcomingDue ?? [];
    return (
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          {homeData?.pendingToGradeCount ?? 0} to grade ·{' '}
          {homeData?.upcomingDueCount ?? 0} due in 14 days
        </Typography>
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            Pending grade queue
          </Typography>
          <PendingGradeDataGrid items={queue} />
        </Stack>
        {upcoming.length > 0 ? (
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              Upcoming due
            </Typography>
            <UpcomingDueDataGrid items={upcoming} />
          </Stack>
        ) : null}
      </Stack>
    );
  }

  return <AtRiskDataGrid trainees={homeData?.atRiskTrainees ?? []} />;
}
