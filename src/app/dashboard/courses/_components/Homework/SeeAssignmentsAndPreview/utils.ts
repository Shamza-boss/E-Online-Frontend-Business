import type { StatusAndTab } from './interfaces';
import type {
  AssignmentDetailsDto,
  SubmittedHomework,
  SubmitHomeworkDto,
} from '../../../../../_lib/interfaces/types';
import { getAssignmentById, submitHomework } from '../../../../../_lib/actions';
import { mutate } from 'swr';

/** Derive status and target tab from a grid row */
export const getStatusAndTab = (row: any): StatusAndTab => {
  if (row.isGraded) return { status: 'graded', tab: 1 };
  if (row.isSubmitted) return { status: 'submitted', tab: 1 };
  return { status: 'pending', tab: 0 };
};

/** Open an assignment by fetching its details and setting state */
export const openAssignment = async (
  params: any,
  setSelectedStatus: (s: 'graded' | 'submitted' | 'pending') => void,
  setSelectedAssignment: (a: AssignmentDetailsDto | null) => void,
  setActiveTab: (t: number) => void
) => {
  const { status, tab } = getStatusAndTab(params.row);
  setSelectedStatus(status);
  const assignmentId = params.row.assignmentId || params.row.id;
  const assignment = await getAssignmentById(assignmentId);
  setSelectedAssignment({ ...assignment, status });
  setActiveTab(tab);
};

/** Handle row click — pending shows confirm, otherwise opens directly */
export const handleRowClick = async (
  params: any,
  setPendingRowParams: (p: any) => void,
  setSelectedStatus: (s: 'graded' | 'submitted' | 'pending') => void,
  setSelectedAssignment: (a: AssignmentDetailsDto | null) => void,
  setActiveTab: (t: number) => void
) => {
  const { status } = getStatusAndTab(params.row);
  if (status === 'pending') {
    setPendingRowParams(params);
    return;
  }
  await openAssignment(
    params,
    setSelectedStatus,
    setSelectedAssignment,
    setActiveTab
  );
};

/** Confirm opening a pending assignment after warning dialog */
export const confirmModuleOpen = async (
  pendingRowParams: any,
  setPendingRowParams: (p: any) => void,
  setSelectedStatus: (s: 'graded' | 'submitted' | 'pending') => void,
  setSelectedAssignment: (a: AssignmentDetailsDto | null) => void,
  setActiveTab: (t: number) => void
) => {
  const params = pendingRowParams;
  setPendingRowParams(null);
  if (params) {
    await openAssignment(
      params,
      setSelectedStatus,
      setSelectedAssignment,
      setActiveTab
    );
  }
};

/** Submit homework and refresh the data */
export const submitHomeworkAndRefresh = async (
  submitted: SubmittedHomework,
  selectedAssignment: AssignmentDetailsDto | null,
  userId: string | undefined,
  setSelectedAssignment: (a: AssignmentDetailsDto | null) => void
) => {
  setSelectedAssignment(null);
  const newAssignment: SubmitHomeworkDto = {
    ...submitted,
    assignmentId:
      selectedAssignment?.assignmentId || (selectedAssignment as any)?.id || '',
    submittedAt: new Date().toISOString(),
  };
  await submitHomework(newAssignment);
  mutate(['student-assignments', userId]);
};
