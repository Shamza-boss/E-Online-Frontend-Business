import type { ClassDto, UserDto } from '@/app/_lib/interfaces/types';

export interface StudentManagementComponentProps {
  userData: UserDto[] | undefined;
  classDetails: ClassDto;
}
