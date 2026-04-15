import type { Question } from '@/app/_lib/interfaces/types';
import type { TextField } from '@mui/material';

export type BufferedTextFieldProps = Omit<
  React.ComponentProps<typeof TextField>,
  'value' | 'onChange'
> & {
  value?: string | number | null;
  onCommit: (value: string) => void;
  debounceMs?: number;
};

export interface QuestionRichTextFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  minHeight?: number;
  showToolbar?: boolean;
  debounceMs?: number;
}

export interface QuestionEditorPanelProps {
  question?: Question;
  questionIndex: number;
  displayNumber?: string;
  childNumberPrefix?: string;
  questionTypeOptions: ReadonlyArray<{
    value: Question['type'];
    label: string;
  }>;
  computeTotalWeight: (question: Question) => number;
  onFieldChange: (questionId: string, key: keyof Question, value: any) => void;
  onTypeChange: (questionId: string, newType: Question['type']) => void;
  onWeightChange: (questionId: string, value: string) => void;
  onAddOption: (questionId: string) => void;
  onOptionChange: (questionId: string, index: number, value: string) => void;
  onAddSubquestion: (parentId: string, type?: Question['type']) => void;
  onRemoveSubquestion: (parentId: string, subId: string) => void;
  onRemoveQuestion: (questionId: string) => void;
  onReorderSubquestions?: (
    parentId: string,
    fromIdx: number,
    toIdx: number
  ) => void;
  onDragHandleStart?: (event: React.DragEvent<HTMLElement>) => void;
  onDragHandleEnd?: () => void;
  isDragging?: boolean;
  onInsertSubquestionFromPalette?: (
    parentId: string,
    insertIndex: number,
    type: Question['type']
  ) => void;
  paletteMimeType?: string;
  paletteDragType?: Question['type'] | null;
}
