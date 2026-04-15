import { GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { getStatusChipConfig } from '@/app/_lib/common/functions';
import { GradeCell, PercentageCell } from '@/app/_lib/homework';
import { Chip, Button } from '@mui/material';
import React from 'react';

export const buildColumns = (
    onRowClick: (params: any) => void,
): GridColDef[] => [
    {
        field: 'homeworkTitle',
        headerName: 'Title',
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'homeworkDescription',
        headerName: 'Description',
        flex: 1.5,
        minWidth: 200,
    },
    {
        field: 'dueDate',
        headerName: 'Due Date',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => {
            if (!params.value) return '';
            return format(new Date(params.value), 'MM/dd/yyyy');
        },
    },
    {
        field: 'totalScore',
        headerName: 'Grade',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
            return <GradeCell assignment={params.row} />;
        },
    },
    {
        field: 'studentPercentage',
        headerName: 'Percentage',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => {
            return <PercentageCell assignment={params.row} />;
        },
    },
    { field: 'overallComment', headerName: 'Comments', flex: 1, minWidth: 150 },
    {
        field: 'isSubmitted',
        headerName: 'Status',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => {
            const { label, color } = getStatusChipConfig(
                params.row.isGraded,
                params.row.isSubmitted,
                params.row.dueDate,
            );
            return <Chip size="small" label={label} color={color} />;
        },
    },
    {
        field: 'actions',
        headerName: 'Action',
        flex: 0.8,
        minWidth: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const isPending = !params.row.isSubmitted && !params.row.isGraded;
            return (
                <Button
                    size="small"
                    variant="outlined"
                    color={isPending ? 'primary' : 'success'}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRowClick(params);
                    }}
                >
                    {isPending ? 'Start Assessment' : 'View Result'}
                </Button>
            );
        },
    },
];
