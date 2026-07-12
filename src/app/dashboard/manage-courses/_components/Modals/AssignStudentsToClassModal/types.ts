export type AssignStudentsToClassModalProps = {
  open: boolean;
  handleClose: () => void;
}

export type EnrollmentState = {
  canEnroll: boolean;
  selectedCount: number;
  enroll: () => void;
}
