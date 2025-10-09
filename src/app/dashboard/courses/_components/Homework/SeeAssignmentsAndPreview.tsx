import {
  Box,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import EDataGrid from '../../../_components/EDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { Close } from '@mui/icons-material';
import {
  HomeworkAssignmentDto,
  AssignmentDetailsDto,
  SubmittedHomework,
  SubmitHomeworkDto,
} from '../../../../_lib/interfaces/types';
import {
  getAssignmentById,
  submitHomework,
  getStudentAssignments,
} from '../../../../_lib/actions/homework';
import HomeworkView from './HomeworkView';
import HomeworkReview from './HomeworkReview';
import GradedHomeworkComponent from '../../../../_lib/components/homework/GradedHomeworkComponent';
import useSWR, { mutate } from 'swr';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { getStatusChipConfig } from '@/app/_lib/common/functions';
import { GradeCell, PercentageCell } from '@/app/_lib/homework';

export default function SeeAssignmentsAndPreview({
  canEdit,
  classId,
}: {
  canEdit: boolean;
  classId: string;
}) {
  const { data: session } = useSession();
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentDetailsDto | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    'graded' | 'submitted' | 'pending'
  >('pending');

  const fetchAssignments = async () => {
    const allAssignments = await getStudentAssignments(session?.user.id || '');
    return allAssignments.filter((a) => a.classroomId === classId);
  };

  const { data, isLoading } = useSWR<HomeworkAssignmentDto[]>(
    'homeworkForClass',
    fetchAssignments,
    { revalidateOnFocus: true }
  );
  const [activeTab, setActiveTab] = useState(0);

  const getStatusAndTab = (
    row: any
  ): { status: 'graded' | 'submitted' | 'pending'; tab: number } => {
    if (row.isGraded) return { status: 'graded', tab: 2 };
    if (row.isSubmitted) return { status: 'submitted', tab: 1 };
    return { status: 'pending', tab: 0 };
  };

  const handleRowClick = async (params: any) => {
    const { status, tab } = getStatusAndTab(params.row);
    setSelectedStatus(status);
    const assignmentId = params.row.assignmentId || params.row.id;
    const assignment = await getAssignmentById(assignmentId);
    setSelectedAssignment({ ...assignment, status });
    setActiveTab(tab);
  };

  const handleBack = () => {
    setSelectedAssignment(null);
  };

  const handleHomeworkSubmit = async (submitted: SubmittedHomework) => {
    handleBack();
    const newAssignment: SubmitHomeworkDto = {
      ...submitted,
      assignmentId:
        selectedAssignment?.assignmentId ||
        (selectedAssignment as any)?.id ||
        '',
      submittedAt: new Date().toISOString(),
    };
    await submitHomework(newAssignment);
    mutate('homeworkForClass');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const columns: GridColDef[] = [
    {
      field: 'homeworkTitle',
      headerName: 'Title',
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
              ? selectedAssignment.homework.title
              : 'Your modules'}
          </Typography>
          {selectedAssignment && (
            <Button color="inherit" onClick={handleBack} startIcon={<Close />}>
              Back
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {!selectedAssignment ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          <EDataGrid
            rows={data || []}
            sx={{ flex: 1, width: '100%', height: '100%' }}
            columns={columns}
            getRowId={(r) => r.assignmentId || r.id}
            disableRowSelectionOnClick={canEdit}
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
        </Box>
      ) : (
        <Box>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label="Complete Assignment"
              disabled={selectedStatus !== 'pending'}
            />
            <Tab
              label="Review Submission"
              disabled={selectedStatus === 'pending'}
            />
            <Tab label="Graded Result" disabled={selectedStatus !== 'graded'} />
          </Tabs>

          <Box
            sx={{
              p: 2,
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch', // don't center horizontally
              justifyContent: 'flex-start', // ✅ ensures top-alignment vertically
            }}
          >
            {activeTab === 0 && selectedStatus === 'pending' && (
              <HomeworkView
                homework={selectedAssignment.homework}
                onSubmit={handleHomeworkSubmit}
              />
            )}
            {activeTab === 1 && selectedStatus !== 'pending' && (
              <HomeworkReview
                submittedHomework={{
                  homework: selectedAssignment.homework,
                  answers: selectedAssignment.answers,
                }}
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
}
