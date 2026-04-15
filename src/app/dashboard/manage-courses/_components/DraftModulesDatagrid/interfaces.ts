import type { Homework } from '@/app/_lib/interfaces/types';

export type HomeworkRow = Homework & { __gridId?: string };

export interface ModulesPanelProps {
  teacherId: string;
  classroomId: string;
  refreshIndex: number;
  onEdit: (homeworkId: string) => void | Promise<void>;
  onAfterChange?: () => void;
  onRowClick?: (homeworkId: string) => void;
}
