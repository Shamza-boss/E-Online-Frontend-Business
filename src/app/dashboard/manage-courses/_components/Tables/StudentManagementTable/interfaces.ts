import type {
  UserDto,
  EnrollStudentsDto,
  ClassroomDetailsDto,
} from '@/app/_lib/interfaces/types';

export interface EnrollmentState {
  canEnroll: boolean;
  selectedCount: number;
  enroll: () => void;
}

export interface StudentManagementTableProps {
  onEnrollmentStateChange?: (state: EnrollmentState) => void;
}

export type NormalizedSelection = {
  type: 'include' | 'exclude';
  ids: Set<string>;
};
