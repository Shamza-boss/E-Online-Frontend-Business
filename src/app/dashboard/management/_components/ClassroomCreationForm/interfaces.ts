import type { ClassDto } from '@/app/_lib/interfaces/types';

export interface ClassroomCreationFormProps {
  formId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  initialClassroom?: ClassDto | null;
  isAdmin?: boolean;
}
