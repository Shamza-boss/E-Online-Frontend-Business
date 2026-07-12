import type { Question } from '@/app/_lib/interfaces/types';

export type PreviewTone =
  | 'question'
  | 'subquestion'
  | 'video'
  | 'pdf'
  | 'group';

export type ToneStyle = {
  label: string;
  accentColor: string;
  borderColor: string;
  backgroundColor: string;
}

export type QuestionPreviewPanelProps = {
  question?: Question;
  questionIndex: number;
  questionNumber?: string;
  computeTotalWeight: (question: Question) => number;
}
