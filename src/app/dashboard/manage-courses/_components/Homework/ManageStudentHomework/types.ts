import type { UserDto } from '@/app/_lib/interfaces/types';

export type ManageStudentHomeworkProps = {
  student: UserDto | null;
  classId: string;
}
