import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Chip } from '@mui/material';
import { RecentHomeworkStatDto } from '@/app/_lib/interfaces/types';
import { format } from 'date-fns';
import { getPercentageColor } from '@/app/_lib/utils/gradeCalculator';

interface CustomizedDataGridProps {
  rows: RecentHomeworkStatDto[];
  isLoading: boolean;
}

export default function CustomizedDataGrid({
  rows,
  isLoading,
}: CustomizedDataGridProps) {
  const columns: GridColDef[] = [
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
        return format(new Date(params.value), 'MM/dd/yyyy');
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
      renderCell: (params) => {
        if (params.value == null) return 'N/A';
        const percentage = params.value * 100; // Convert decimal to percentage
        return (
          <Chip
            size="small"
            label={`${percentage.toFixed(1)}%`}
            color={getPercentageColor(percentage)}
            variant="filled"
          />
        );
      },
    },
    {
      field: 'averageGrade',
      headerName: 'Average grade',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (params.value == null) return 'N/A';
        const percentage = params.value * 100; // Convert decimal to percentage
        return (
          <Chip
            size="small"
            label={`${percentage.toFixed(1)}%`}
            color={getPercentageColor(percentage)}
            variant="filled"
          />
        );
      },
    },
  ];

  return (
    <DataGrid
      checkboxSelection
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      loading={isLoading}
      density="compact"
      sx={{
        '& .MuiDataGrid-root': {
          overflow: 'auto',
        },
        '& .MuiDataGrid-virtualScroller': {
          overflow: 'auto',
        },
      }}
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
