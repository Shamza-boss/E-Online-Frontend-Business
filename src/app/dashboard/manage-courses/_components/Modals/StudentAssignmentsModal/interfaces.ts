import type { UserDto } from '@/app/_lib/interfaces/types';

export interface StudentAssignmentsModalProps {
  open: boolean;
  onClose: () => void;
  student: UserDto | null;
  classId: string;
}
