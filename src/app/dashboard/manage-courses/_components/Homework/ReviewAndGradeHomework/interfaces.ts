import type {
  SubmittedHomework,
  GradedHomework,
} from '@/app/_lib/interfaces/types';

export interface ReviewAndGradeHomeworkProps {
  submittedHomework: SubmittedHomework;
  onSubmitGrading: (gradedHomework: GradedHomework) => void;
}

export interface GradingEntry {
  grade: number;
  comment: string;
}

export type GradingData = Record<string, GradingEntry>;
