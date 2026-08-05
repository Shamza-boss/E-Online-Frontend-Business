import type { ClassDto } from '@/app/_lib/interfaces/types';

export type ClassroomCreationFormProps = {
  formId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  initialClassroom?: ClassDto | null;
  isAdmin?: boolean;
}
