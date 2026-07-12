import type {
  SubmittedHomework,
  GradedHomework,
} from '@/app/_lib/interfaces/types';

export type ReviewAndGradeHomeworkProps = {
  submittedHomework: SubmittedHomework;
  onSubmitGrading: (gradedHomework: GradedHomework) => void;
}

export type GradingEntry = {
  grade: number;
  comment: string;
}

export type GradingData = Record<string, GradingEntry>;
