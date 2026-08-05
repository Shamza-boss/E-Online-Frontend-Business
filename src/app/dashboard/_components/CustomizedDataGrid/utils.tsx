import * as React from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Chip } from '@mui/material';
import { getPercentageColor } from '@/app/_lib/utils/gradeCalculator';
import { formatSaDate } from '@/app/_lib/utils/datetime';

export function getRowClassName(indexRelativeToCurrentPage: number): string {
  return indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
}

export function renderPercentageChip(value: number | null, multiplier: number = 1): React.ReactNode {
  if (value == null) return 'N/A';
  const percentage = value * multiplier;
  return (
    <Chip
      size="small"
      label={`${percentage.toFixed(1)}%`}
      color={getPercentageColor(percentage)}
      variant="filled"
    />
  );
}

export function getColumnDefinitions(): GridColDef[] {
  return [
    {
      field: 'classroomName',
      headerName: 'Course name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'subjectCode',
      headerName: 'Subject Code',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'homeworkTitle',
      headerName: 'Module title',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'dueDate',
      headerName: 'Due date',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        if (!params.value) return '';
        return formatSaDate(params.value, '');
      },
    },
    {
      field: 'studentsAssigned',
      headerName: 'Trainees assigned',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'submissions',
      headerName: 'Submissions',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'submissionRate',
      headerName: 'Submission rate',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => renderPercentageChip(params.value, 100),
    },
    {
      field: 'averageGrade',
      headerName: 'Average grade',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => renderPercentageChip(params.value, 1),
    },
  ];
}
