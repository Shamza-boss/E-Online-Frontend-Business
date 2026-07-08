import type { AcademicLevelDto, SubjectDto } from '@/app/_lib/interfaces/types';

export interface ManagementTabsProps {
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  searchTerm: string;
  initialAcademics?: AcademicLevelDto[];
  initialSubjects?: SubjectDto[];
}