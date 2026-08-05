'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { GridColDef } from '@mui/x-data-grid';
import InsightDataGrid from '../../InsightDataGrid';
import type {
  AtRiskTraineeDto,
  HeavyLoadStudentDto,
  InstructorHomeDashboardDto,
  TeacherModuleActionDto,
  UnassignedStudentDto,
} from '@/app/_lib/types/dashboardHome';
import type { InstructorInsightId } from '@/app/_lib/types/dashboardInsights';
import type {
  InstructorHeavyLoadInsightDto,
  InstructorUnassignedInsightDto,
  InstructorWorkloadInsightDto,
} from '@/app/_lib/types/dashboardInsights';
import {
  ACTIONS_EMPTY,
  AT_RISK_EMPTY,
  HEAVY_LOAD_EMPTY,
  UNASSIGNED_EMPTY,
} from '../constants';
import { actionItemCount } from '../utils';
import { formatActionWhen, statusLabel } from '../urgency';
import { formatSaDate } from '@/app/_lib/utils/datetime';

type InstructorInsightDetailProps = {
  insight: InstructorInsightId;
  detail: unknown;
  homeData?: InstructorHomeDashboardDto;
};

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  return formatSaDate(value, '—');
}

function chipColor(
  status: string | null | undefined,
): 'default' | 'error' | 'warning' | 'success' | 'primary' {
  if (status === 'ExpiredDraft') return 'error';
  if (status === 'ExpiringSoon') return 'warning';
  if (status === 'ScheduledExam') return 'success';
  if (status === 'Draft') return 'primary';
  return 'default';
}

function ActionDataGrid({
  items,
  emptyMessage,
}: {
  items: TeacherModuleActionDto[];
  emptyMessage: string;
}) {
  const rows = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        id: item.homeworkId || `action-${index}`,
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
        field: 'classroomName',
        headerName: 'Course',
        flex: 1,
        minWidth: 140,
        valueGetter: (_value, row) => row.classroomName ?? '—',
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 130,
        renderCell: (params) => (
          <Chip
            size="small"
            color={chipColor(params.row.status)}
            label={statusLabel(params.row.status)}
          />
        ),
      },
      {
        field: 'relevantAt',
        headerName: 'When',
        flex: 0.9,
        minWidth: 110,
        valueGetter: (_value, row) => row.relevantAt ?? '',
        renderCell: (params) => formatActionWhen(params.row.relevantAt),
      },
      {
        field: 'isExam',
        headerName: 'Type',
        flex: 0.7,
        minWidth: 90,
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
      emptyMessage={emptyMessage}
      mobileHiddenFields={['classroomName', 'isExam']}
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

function UnassignedDataGrid({ students }: { students: UnassignedStudentDto[] }) {
  const rows = useMemo(
    () =>
      students.map((student, index) => ({
        ...student,
        id: student.userId || `unassigned-${index}`,
      })),
    [students],
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
        flex: 1.3,
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
    ],
    [],
  );

  return (
    <InsightDataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage={UNASSIGNED_EMPTY}
      mobileHiddenFields={['email']}
    />
  );
}

function HeavyLoadDataGrid({ students }: { students: HeavyLoadStudentDto[] }) {
  const rows = useMemo(
    () =>
      students.map((student, index) => ({
        ...student,
        id: student.userId || `heavy-${index}`,
      })),
    [students],
  );

  const columns = useMemo<GridColDef<(typeof rows)[number]>[]>(
    () => [
      {
        field: 'firstName',
        headerName: 'First name',
        flex: 0.9,
        minWidth: 100,
      },
      {
        field: 'lastName',
        headerName: 'Last name',
        flex: 0.9,
        minWidth: 100,
      },
      {
        field: 'peakDueCount',
        headerName: 'Peak dues',
        flex: 0.7,
        minWidth: 100,
        renderCell: (params) => (
          <Chip
            size="small"
            color={params.row.peakDueCount >= 6 ? 'error' : 'warning'}
            label={params.row.peakDueCount}
          />
        ),
      },
      {
        field: 'classCount',
        headerName: 'Classes',
        flex: 0.6,
        minWidth: 90,
      },
      {
        field: 'peakWindowStart',
        headerName: 'Window',
        flex: 1.1,
        minWidth: 150,
        valueGetter: (_value, row) => row.peakWindowStart ?? '',
        renderCell: (params) => {
          const start = formatDate(params.row.peakWindowStart);
          const end = formatDate(params.row.peakWindowEnd);
          return start === '—' ? '—' : `${start} – ${end}`;
        },
      },
      {
        field: 'reason',
        headerName: 'Reason',
        flex: 1.3,
        minWidth: 180,
      },
    ],
    [],
  );

  return (
    <InsightDataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage={HEAVY_LOAD_EMPTY}
      mobileHiddenFields={['reason']}
    />
  );
}

export default function InstructorInsightDetail({
  insight,
  detail,
  homeData,
}: InstructorInsightDetailProps) {
  if (insight === 'workload') {
    const data = (detail ?? {}) as InstructorWorkloadInsightDto;
    const expired = data.expiredDrafts ?? [];
    const expiring = data.expiringSoon ?? [];
    const exams = data.scheduledExams ?? [];
    const drafts = data.drafts ?? [];
    const combined = [...expired, ...expiring, ...exams, ...drafts];

    return (
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          {actionItemCount(homeData)} actions · {expired.length} expired ·{' '}
          {expiring.length} expiring · {exams.length} exams · {drafts.length}{' '}
          drafts
        </Typography>
        <ActionDataGrid items={combined} emptyMessage={ACTIONS_EMPTY} />
      </Stack>
    );
  }

  if (insight === 'unassigned') {
    const remote = (detail ?? {}) as InstructorUnassignedInsightDto;
    const students = (remote.students ??
      homeData?.unassignedStudents ??
      []) as UnassignedStudentDto[];
    return <UnassignedDataGrid students={students} />;
  }

  if (insight === 'heavyLoad') {
    const remote = (detail ?? {}) as InstructorHeavyLoadInsightDto;
    const students = (remote.students ??
      homeData?.heavyLoadStudents ??
      []) as HeavyLoadStudentDto[];
    return <HeavyLoadDataGrid students={students} />;
  }

  return <AtRiskDataGrid trainees={homeData?.atRiskTrainees ?? []} />;
}
