import type { SubmittedHomework } from '../../../../../_lib/interfaces/types';

export type HomeworkReviewProps = {
  submittedHomework: SubmittedHomework;
}

export type PdfPreviewState = {
  title: string;
  url: string;
  key?: string | null;
}
