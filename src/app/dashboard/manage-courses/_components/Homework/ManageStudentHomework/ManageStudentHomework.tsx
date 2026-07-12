'use client';

import React, { useState, useCallback } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Chip,
    AppBar,
    Toolbar,
    Typography,
    Button,
} from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import { Close } from '@mui/icons-material';
import useSWR, { mutate } from 'swr';
import { format } from 'date-fns';
import { getAssignmentById } from '@/app/_lib/actions/homework';
import type {
    AssignmentDetailsDto,
    HomeworkAssignmentDto,
    GradedHomework,
} from '@/app/_lib/interfaces/types';
import GradedHomeworkComponent from '@/app/_lib/components/homework/GradedHomeworkComponent';
import { PercentageCell } from '@/app/_lib/components/homework/PercentageCell';
import { GradeCell } from '@/app/_lib/components/homework/GradeCell';
import EDataGrid from '../../../../_components/EDataGrid';
import ReviewAndGradeHomework from '../ReviewAndGradeHomework';
import { getStatusChipConfig } from '@/app/_lib/common/functions';
import HomeworkReview from '@/app/dashboard/courses/_components/Homework/HomeworkReview';
import type { ManageStudentHomeworkProps } from './types';
import { TabContentBox } from './elements';
import { getStatusAndTab, buildFetchAssignments, submitGradedHomework } from './utils';

const ManageStudentHomework: React.FC<ManageStudentHomeworkProps> = ({
    student,
    classId,
}) => {
    const [selectedAssignment, setSelectedAssignment] =
        useState<AssignmentDetailsDto | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<
        'graded' | 'submitted' | 'pending'
    >('pending');
    const [activeTab, setActiveTab] = useState(0);

    const fetchAssignments = useCallback(
        () => buildFetchAssignments(student?.userId ?? '', classId),
        [student?.userId, classId],
    );

    const { data, isLoading } = useSWR<HomeworkAssignmentDto[]>(
        'homework',
        fetchAssignments(),
        { revalidateOnFocus: true },
    );

    const handleRowClick = useCallback(
        async (params: any) => {
            const { status, tab } = getStatusAndTab(params.row);
            setSelectedStatus(status);
            const assignment = await getAssignmentById(params.row.assignmentId);
            setSelectedAssignment({ ...assignment, status });
            setActiveTab(tab);
        },
        [],
    );

    const handleBack = useCallback(() => {
        setSelectedAssignment(null);
    }, []);

    const handleSubmitGradedHomework = useCallback(
        (submitted: GradedHomework) => {
            submitGradedHomework(
                submitted,
                selectedAssignment?.assignmentId ?? '',
                () => mutate('homework'),
                handleBack,
            );
        },
        [handleBack, selectedAssignment?.assignmentId],
    );

    const handleTabChange = useCallback(
        (_event: React.SyntheticEvent, newValue: number) => {
            setActiveTab(newValue);
        },
        [],
    );

    const columns: GridColDef[] = [
        {
            field: 'homeworkTitle',
            headerName: 'Assignment Title',
            flex: 1,
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
            renderCell: (params) => <GradeCell assignment={params.row} />,
        },
        {
            field: 'percentage',
            headerName: 'Percentage',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => <PercentageCell assignment={params.row} />,
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
                return <Chip size="small" label={label} color={color} sx={{ ml: 1 }} />;
            },
        },
    ];

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography sx={{ flex: 1 }} variant="h6">
                        {selectedAssignment
                            ? ` ${selectedAssignment.homework.title} - ${student?.firstName + ' ' + student?.lastName}`
                            : `${student?.firstName + ' ' + student?.lastName}'s Assignments`}
                    </Typography>
                    {selectedAssignment && (
                        <Button color="inherit" onClick={handleBack} startIcon={<Close />}>
                            Back
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {!selectedAssignment ? (
                <EDataGrid
                    rows={data || []}
                    columns={columns}
                    getRowId={(r) => r.assignmentId}
                    onRowClick={handleRowClick}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                    initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
                    pageSizeOptions={[10, 20, 50]}
                    loading={isLoading}
                    slotProps={{
                        loadingOverlay: {
                            variant: 'linear-progress',
                            noRowsVariant: 'linear-progress',
                        },
                    }}
                />
            ) : (
                <Box>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Submitted work" />
                        <Tab
                            label="Review Submission"
                            disabled={selectedStatus === 'pending'}
                        />
                        <Tab label="Graded Result" disabled={selectedStatus !== 'graded'} />
                    </Tabs>

                    <TabContentBox>
                        {activeTab === 0 && (
                            <HomeworkReview
                                submittedHomework={{
                                    homework: selectedAssignment.homework,
                                    answers: selectedAssignment.answers,
                                }}
                            />
                        )}
                        {activeTab === 1 && selectedStatus !== 'pending' && (
                            <ReviewAndGradeHomework
                                submittedHomework={{
                                    homework: selectedAssignment.homework,
                                    answers: selectedAssignment.answers,
                                }}
                                onSubmitGrading={handleSubmitGradedHomework}
                            />
                        )}
                        {activeTab === 2 && selectedStatus === 'graded' && (
                            <GradedHomeworkComponent
                                gradedHomework={{
                                    homework: selectedAssignment.homework,
                                    answers: selectedAssignment.answers,
                                    grading: selectedAssignment.grading || {},
                                    overallComment: selectedAssignment.overallComment,
                                }}
                            />
                        )}
                    </TabContentBox>
                </Box>
            )}
        </>
    );
};

export default ManageStudentHomework;
