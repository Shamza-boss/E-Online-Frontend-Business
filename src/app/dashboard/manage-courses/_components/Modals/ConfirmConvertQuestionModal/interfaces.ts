import type { Question } from '@/app/_lib/interfaces/types';

export interface ConfirmConvertQuestionModalProps {
  open: boolean;
  question: Question | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}
