'use client';
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
import React, { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Close } from '@mui/icons-material';
import useSWR, { mutate } from 'swr';
import { format } from 'date-fns';
import {
  getStudentAssignments,
  getAssignmentById,
  gradeHomework,
} from '../../../../_lib/actions/homework';
import {
  AssignmentDetailsDto,
  HomeworkAssignmentDto,
  UserDto,
  GradedHomework,
  GradeHomeworkDto,
} from '../../../../_lib/interfaces/types';
import GradedHomeworkComponent from '../../../../_lib/components/homework/GradedHomeworkComponent';
import { PercentageCell } from '../../../../_lib/components/homework/PercentageCell';
import { GradeCell } from '../../../../_lib/components/homework/GradeCell';
import EDataGrid from '../../../_components/EDataGrid';
import ReviewAndGradeHomework from './ReviewAndGradeHomework';
import { getStatusChipConfig } from '@/app/_lib/common/functions';
import HomeworkReview from '@/app/dashboard/classes/_components/Homework/HomeworkReview';

interface ManageStudentHomeworkProps {
  student: UserDto | null;
  classId: string;
}

const ManageStudentHomework: React.FC<ManageStudentHomeworkProps> = ({
  student,
  classId,
}) => {
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentDetailsDto | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    'graded' | 'submitted' | 'pending'
  >('pending');

  const fetchAssignments = async () => {
    const allAssignments = await getStudentAssignments(student?.userId || '');
    return allAssignments.filter((a) => a.classroomId === classId);
  };

  const { data, isLoading } = useSWR<HomeworkAssignmentDto[]>(
    'homework',
    fetchAssignments,
    { revalidateOnFocus: true }
  );
  const [activeTab, setActiveTab] = useState(0);

  const getStatusAndTab = (
    row: any
  ): { status: 'graded' | 'submitted' | 'pending'; tab: number } => {
    if (row.isGraded) return { status: 'graded', tab: 2 };
    else if (row.isSubmitted) return { status: 'submitted', tab: 1 };
    return { status: 'pending', tab: 0 };
  };

  const handleRowClick = async (params: any) => {
    const { status, tab } = getStatusAndTab(params.row);
    setSelectedStatus(status);
    const assignment = await getAssignmentById(params.row.assignmentId);
    setSelectedAssignment({ ...assignment, status });
    setActiveTab(tab);
  };

  const handleBack = () => {
    setSelectedAssignment(null);
  };

  const handleSubmitGradedHomework = (submitted: GradedHomework) => {
    const gradedAssignment: GradeHomeworkDto = {
      ...submitted,
      assignmentId: selectedAssignment?.assignmentId || '',
      gradePublishDate: new Date().toISOString(),
    };
    gradeHomework(gradedAssignment).then(() => {
      mutate('homework');
      handleBack();
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
      renderCell: (params) => {
        return <GradeCell assignment={params.row} />;
      },
    },
    {
      field: 'percentage',
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
          params.row.dueDate
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
          rows={data}
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

          <Box
            sx={{
              p: 2,
              height: '100%',
              maxHeight: '100%',
              overflow: 'auto',
            }}
          >
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
          </Box>
        </Box>
      )}
    </>
  );
};

export default ManageStudentHomework;
