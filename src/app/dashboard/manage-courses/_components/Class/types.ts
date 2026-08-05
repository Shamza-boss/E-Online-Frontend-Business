import type { ClassDto, UserDto } from '@/app/_lib/interfaces/types';

export type StudentManagementComponentProps = {
  userData: UserDto[] | undefined;
  classDetails: ClassDto;
}
