import type { Homework, HomeworkPayload } from '@/app/_lib/interfaces/types';

export interface FormBuilderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    homework: HomeworkPayload,
    options: { isDraft: boolean; homeworkId?: string }
  ) => void;
  initialHomework?: Homework | null;
}
