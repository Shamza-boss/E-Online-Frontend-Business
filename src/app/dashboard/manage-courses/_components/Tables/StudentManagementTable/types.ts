import type {
  UserDto,
  EnrollStudentsDto,
  ClassroomDetailsDto,
} from '@/app/_lib/interfaces/types';

export type EnrollmentState = {
  canEnroll: boolean;
  selectedCount: number;
  enroll: () => void;
}

export type StudentManagementTableProps = {
  onEnrollmentStateChange?: (state: EnrollmentState) => void;
}

export type NormalizedSelection = {
  type: 'include' | 'exclude';
  ids: Set<string>;
};
