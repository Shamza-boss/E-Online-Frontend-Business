import type {
  AssignmentDetailsDto,
  SubmittedHomework,
} from '../../../../../_lib/interfaces/types';

export type AssignmentStatus = 'graded' | 'submitted' | 'pending';

export type StatusAndTab = {
  status: AssignmentStatus;
  tab: number;
}

export type SeeAssignmentsAndPreviewProps = {
  canEdit: boolean;
  classId: string;
  onExamModeChange?: (isExamMode: boolean) => void;
}

export type SelectedAssignmentState = {
  assignment: AssignmentDetailsDto;
  status: AssignmentStatus;
}
