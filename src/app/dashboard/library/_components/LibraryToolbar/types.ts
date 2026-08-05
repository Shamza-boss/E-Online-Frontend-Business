import type { AcademicLevelDto } from '@/app/_lib/interfaces/types';

export type LibraryViewMode = 'cards' | 'table';

export type LibraryToolbarProps = {
  viewMode: LibraryViewMode;
  onViewModeChange: (mode: LibraryViewMode) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  academicLevelId: string;
  onAcademicLevelChange: (value: string) => void;
  academicOptions: AcademicLevelDto[];
  unlinkedOnly: boolean;
  onUnlinkedOnlyChange: (value: boolean) => void;
}
