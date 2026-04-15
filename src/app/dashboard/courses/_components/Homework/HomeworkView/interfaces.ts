import type {
  Homework,
  SubmittedHomework,
} from '../../../../../_lib/interfaces/types';

/** Public type for toolbar render-prop */
export interface HomeworkNavState {
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

export interface HomeworkViewProps {
  homework: Homework;
  onSubmit: (submittedHomework: SubmittedHomework) => void;
  readOnly?: boolean;
  onBack?: () => void;
  onNavChange?: (nav: HomeworkNavState) => void;
}

export interface PdfPreviewState {
  title: string;
  url: string;
  key?: string | null;
}
