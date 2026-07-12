import type {
  Homework,
  SubmittedHomework,
} from '../../../../../_lib/interfaces/types';

/** Public type for toolbar render-prop */
export type HomeworkNavState = {
  currentIndex: number;
  totalQuestions: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  isCompleted: (index: number) => boolean;
  readOnly: boolean;
  onSubmit: () => void;
}

export type HomeworkViewProps = {
  homework: Homework;
  onSubmit: (submittedHomework: SubmittedHomework) => void;
  readOnly?: boolean;
  onBack?: () => void;
  onNavChange?: (nav: HomeworkNavState) => void;
}

export type PdfPreviewState = {
  title: string;
  url: string;
  key?: string | null;
};

export type HomeworkAnswerValue = string | string[] | boolean | null;

export type HomeworkAnswersMap = Record<string, HomeworkAnswerValue>;
