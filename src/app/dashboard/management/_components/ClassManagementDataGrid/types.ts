import type { AcademicLevelDto, SubjectDto } from '@/app/_lib/interfaces/types';

export type ClassManagementDataGridProps = {
  active: boolean;
  searchTerm: string;
  initialAcademics?: AcademicLevelDto[];
  initialSubjects?: SubjectDto[];
}