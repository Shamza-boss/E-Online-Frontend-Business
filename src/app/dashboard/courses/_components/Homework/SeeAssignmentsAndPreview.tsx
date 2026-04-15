import {
  Box,
  Tabs,
  Tab,
  Chip,
  Alert,
  Button,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import EDataGrid from '../../../_components/EDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import {
  HomeworkAssignmentDto,
  AssignmentDetailsDto,
  SubmittedHomework,
  SubmitHomeworkDto,
} from '../../../../_lib/interfaces/types';
import {
  getAssignmentById,
  getStudentAssignments,
  submitHomework,
} from '../../../../_lib/actions';
import HomeworkView from './HomeworkView';
import GradedHomeworkComponent from '../../../../_lib/components/homework/GradedHomeworkComponent';
import useSWR, { mutate } from 'swr';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { getStatusChipConfig } from '@/app/_lib/common/functions';
import { GradeCell, PercentageCell } from '@/app/_lib/homework';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';

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

  const userId = session?.user.id;
  const userRole = session?.user?.role ? Number(session.user.role) : null;
  const isStudent = userRole === UserRole.Trainee;

  // Only fetch assignments if user is a student
  // Teachers and admins cannot be enrolled in assessments
  const { data: allAssignments, isLoading } = useSWR<HomeworkAssignmentDto[]>(
    isStudent && userId ? ['student-assignments', userId] : null,
    () => getStudentAssignments(userId!),
    { 
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 1,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
      onError: (error) => {
        console.warn('Failed to load student assignments:', error);
      },
    }
  );

  // Show loading when session is loading or data is fetching
  const isDataLoading = !session || isLoading;

  // Filter assignments for this classroom
  const data = useMemo(() => {
    return allAssignments?.filter((a) => a.classroomId === classId);
  }, [allAssignments, classId]);

  const [activeTab, setActiveTab] = useState(0);
  const [pendingRowParams, setPendingRowParams] = useState<any>(null);



  const getStatusAndTab = (
    row: any
  ): { status: 'graded' | 'submitted' | 'pending'; tab: number } => {
    if (row.isGraded) return { status: 'graded', tab: 1 };
    if (row.isSubmitted) return { status: 'submitted', tab: 1 };
    return { status: 'pending', tab: 0 };
  };

  const handleRowClick = async (params: any) => {
    const { status } = getStatusAndTab(params.row);
    if (status === 'pending') {
      setPendingRowParams(params);
      return;
    }
    await openAssignment(params);
  };

  const openAssignment = async (params: any) => {
    const { status, tab } = getStatusAndTab(params.row);
    setSelectedStatus(status);
    const assignmentId = params.row.assignmentId || params.row.id;
    const assignment = await getAssignmentById(assignmentId);
    setSelectedAssignment({ ...assignment, status });
    setActiveTab(tab);
  };

  const confirmModuleOpen = async () => {
    const params = pendingRowParams;
    setPendingRowParams(null);
    if (params) {
      await openAssignment(params);
    }
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
    mutate(['student-assignments', userId]);
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
          params.row.dueDate
        );
        return <Chip size="small" label={label} color={color} sx={{ ml: 1 }} />;
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
              handleRowClick(params);
            }}
          >
            {isPending ? 'Start Assessment' : 'View Result'}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      {!isStudent ? (
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
            rows={[]}
            sx={{ flex: 1, width: '100%', height: '100%' }}
            columns={columns}
            getRowId={(r) => r.assignmentId || r.id}
            disableRowSelectionOnClick={canEdit}
            initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
            pageSizeOptions={[10, 20, 50]}
            slots={{
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Alert severity="info" sx={{ mb: 0 }}>
                    Only students can view enrolled assessments
                  </Alert>
                </Box>
              ),
            }}
          />
        </Box>
      ) : !selectedAssignment ? (
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
            sx={{ flex: 1, width: '100%', height: '100%', '& .MuiDataGrid-row': { cursor: 'pointer' } }}
            columns={columns}
            getRowId={(r) => r.assignmentId || r.id}
            disableRowSelectionOnClick={canEdit}
            onRowClick={handleRowClick}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
            pageSizeOptions={[10, 20, 50]}
            loading={isDataLoading}
            slotProps={{
              loadingOverlay: {
                variant: 'skeleton',
                noRowsVariant: 'skeleton',
              },
            }}
          />
        </Box>
      ) : (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}
          >
            <Tab
              label="Complete Assignment"
              disabled={selectedStatus !== 'pending'}
            />
            <Tab
              label="Graded Result"
              disabled={selectedStatus === 'pending'}
            />
          </Tabs>

          <Box
            sx={{
              p: 1,
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              justifyContent: 'flex-start',
            }}
          >
            {activeTab === 0 && selectedStatus === 'pending' && (
              <HomeworkView
                homework={selectedAssignment.homework}
                onSubmit={handleHomeworkSubmit}
                onBack={handleBack}
              />
            )}
            {activeTab === 1 && (selectedStatus === 'graded' || selectedStatus === 'submitted') && (
              <GradedHomeworkComponent
                gradedHomework={{
                  homework: selectedAssignment.homework,
                  answers: selectedAssignment.answers,
                  grading: selectedAssignment.grading || {},
                  overallComment: selectedAssignment.overallComment,
                }}
                onBack={handleBack}
              />
            )}
          </Box>
        </Box>
      )}

      {/* ── Assessment open warning dialog ── */}
      <ConfirmDialog
        open={!!pendingRowParams}
        title="Open Assessment?"
        description={
          <>
            Once you open this assessment, you will be <strong>required to complete it</strong>.
          </>
        }
        confirmText="Open Assessment"
        cancelText="Cancel"
        onConfirm={confirmModuleOpen}
        onCancel={() => setPendingRowParams(null)}
        confirmButtonProps={{ color: 'warning' }}
      />
    </>
  );
}
