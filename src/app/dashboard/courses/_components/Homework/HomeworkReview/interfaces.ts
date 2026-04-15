import type { SubmittedHomework } from '../../../../../_lib/interfaces/types';

export interface HomeworkReviewProps {
  submittedHomework: SubmittedHomework;
}

export interface PdfPreviewState {
  title: string;
  url: string;
  key?: string | null;
}
