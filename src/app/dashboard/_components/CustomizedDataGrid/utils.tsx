import * as React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Chip } from '@mui/material';
import { format } from 'date-fns';
import { getPercentageColor } from '@/app/_lib/utils/gradeCalculator';
import { DATE_FORMAT } from './constants';

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
        return format(new Date(params.value), DATE_FORMAT);
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
