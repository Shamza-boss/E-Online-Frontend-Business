import type {
  AssignmentDetailsDto,
  SubmittedHomework,
} from '../../../../../_lib/interfaces/types';

export type AssignmentStatus = 'graded' | 'submitted' | 'pending';

export interface StatusAndTab {
  status: AssignmentStatus;
  tab: number;
}

export interface SeeAssignmentsAndPreviewProps {
  canEdit: boolean;
  classId: string;
}

export interface SelectedAssignmentState {
  assignment: AssignmentDetailsDto;
  status: AssignmentStatus;
}
