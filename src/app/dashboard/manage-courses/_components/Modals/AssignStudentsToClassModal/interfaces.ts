export interface AssignStudentsToClassModalProps {
  open: boolean;
  handleClose: () => void;
}

export interface EnrollmentState {
  canEnroll: boolean;
  selectedCount: number;
  enroll: () => void;
}
