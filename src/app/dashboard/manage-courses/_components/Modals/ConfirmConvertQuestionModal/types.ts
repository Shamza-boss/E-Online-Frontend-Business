import type { Question } from '@/app/_lib/interfaces/types';

export type ConfirmConvertQuestionModalProps = {
  open: boolean;
  question: Question | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}
