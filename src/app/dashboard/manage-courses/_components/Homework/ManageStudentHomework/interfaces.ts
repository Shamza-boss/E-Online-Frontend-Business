import type { UserDto } from '@/app/_lib/interfaces/types';

export interface ManageStudentHomeworkProps {
  student: UserDto | null;
  classId: string;
}
