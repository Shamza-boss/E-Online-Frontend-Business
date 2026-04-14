'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Slide,
  Paper,
  Box,
  Stack,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { TransitionProps } from '@mui/material/transitions';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import {
  Homework,
  HomeworkPayload,
  Question,
} from '../../../../_lib/interfaces/types';
import Splitter from '@devbookhq/splitter';
import PaginatedQuestionLayout from '@/app/_lib/components/homework/PaginatedQuestionLayout';
import QuestionEditorPanel, { BufferedTextField } from '../FormBuilder/QuestionEditorPanel';
import QuestionPreviewPanel from '../FormBuilder/QuestionPreviewPanel';
import { GutterStyles } from '@/app/_lib/components/shared-theme/customizations/SplitterComponent';
import {
  buildValidatedHomework,
  createLeafQuestion,
  createVideoQuestion,
  createPdfQuestion,
  findQuestionMeta,
  isChoiceType,
  updateQuestionTree,
  NEW_QUESTION_DND_MIME,
  IsValidChild,
  convertQuestionToContainer,
} from '../FormBuilder/questionUtils';
import ConfirmConvertQuestionModal from './ConfirmConvertQuestionModal';
import {
  getHomeworkDraft,
  setHomeworkDraft,
  removeHomeworkDraft,
  migrateLocalStorageDrafts,
} from '@/app/_lib/utils/homeworkDraftStore';

interface FormBuilderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    homework: HomeworkPayload,
    options: { isDraft: boolean; homeworkId?: string }
  ) => void;
  initialHomework?: Homework | null;
}

const QUESTION_TYPES = [
  { value: 'video', label: 'Video Section' },
  { value: 'pdf', label: 'PDF Section' },
  { value: 'single-select', label: 'Single Choice' },
  { value: 'multi-select', label: 'Multiple Choice' },
] as const;

const FORM_STORAGE_KEY = 'form_builder_homework_draft_v1';
const LEGACY_FORM_STORAGE_KEY = 'form_builder_modal_state_v3';
const BUILDER_STEPS = ['Module details', 'Create questions', 'Review and publish'] as const;
const HOMEWORK_DRAFT_IDLE_MS = 1000;

const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormBuilderModal: NextPage<FormBuilderModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialHomework = null,
}) => {
  const [formTitle, setFormTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTomorrowDate());
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [activeHomeworkId, setActiveHomeworkId] = useState<string | null>(null);
  const [prefillSource, setPrefillSource] = useState<string | null>(null);
  const [splitSizes, setSplitSizes] = useState<number[] | undefined>();
  const [activeStep, setActiveStep] = useState(0);
  const [paletteDragType, setPaletteDragType] = useState<Question['type'] | null>(
    null
  );
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'reset' | 'saveDraft' | 'publish' | 'close' | null;
  }>({ open: false, type: null });
  const [convertQuestionModalOpen, setConvertQuestionModalOpen] = useState(false);
  const [convertQuestionPending, setConvertQuestionPending] = useState<{
    parentId: string;
    type: Question['type'];
  } | null>(null);
  const draftSaveTimeoutRef = useRef<number | null>(null);
  const latestDraftPayloadRef = useRef<object | null>(null);
  const lastDraftSnapshotRef = useRef<string | null>(null);
  const { showAlert } = useAlert();

  const clearDraftStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    void removeHomeworkDraft(FORM_STORAGE_KEY);
    localStorage.removeItem(LEGACY_FORM_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;

    const applyDraft = (homework: HomeworkPayload | null, questionIndex: number) => {
      if (cancelled) return;
      const storedQuestions: Question[] = Array.isArray(homework?.questions)
        ? homework!.questions
        : [];

      setFormTitle(homework?.title ?? '');
      setDescription(homework?.description ?? '');
      setDueDate(homework?.dueDate ?? '');
      setHasExpiry(Boolean(homework?.hasExpiry));
      setExpiryDate(homework?.expiryDate ?? '');
      setQuestions(storedQuestions);
      if (storedQuestions.length > 0) {
        const index = Math.min(questionIndex, storedQuestions.length - 1);
        setCurrentQuestionIndex(index);
      }
    };

    void (async () => {
      try {
        // Migrate any leftover localStorage entries first
        await migrateLocalStorageDrafts([FORM_STORAGE_KEY, LEGACY_FORM_STORAGE_KEY]);

        const record = await getHomeworkDraft(FORM_STORAGE_KEY);
        if (record) {
          const homework = record.homework as HomeworkPayload | null;
          applyDraft(homework, record.currentQuestionIndex);
          return;
        }

        // Check legacy key in IndexedDB (may have been migrated)
        const legacy = await getHomeworkDraft(LEGACY_FORM_STORAGE_KEY);
        if (legacy) {
          const parsed = legacy.homework as Record<string, unknown>;
          const legacyHomework: HomeworkPayload = {
            title: (parsed?.formTitle as string) ?? (parsed?.title as string) ?? '',
            description: (parsed?.description as string) ?? '',
            dueDate: (parsed?.dueDate as string) ?? '',
            hasExpiry: Boolean(parsed?.hasExpiry),
            expiryDate: (parsed?.expiryDate as string) ?? '',
            questions: Array.isArray(parsed?.questions) ? parsed.questions as Question[] : [],
          };
          applyDraft(legacyHomework, legacy.currentQuestionIndex);
        }
      } catch (error) {
        console.error('Failed to restore form builder draft', error);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    if (draftSaveTimeoutRef.current) {
      window.clearTimeout(draftSaveTimeoutRef.current);
      draftSaveTimeoutRef.current = null;
    }

    const isEmpty =
      formTitle.trim() === '' &&
      description.trim() === '' &&
      dueDate.trim() === '' &&
      !hasExpiry &&
      expiryDate.trim() === '' &&
      questions.length === 0;
    if (isEmpty) {
      lastDraftSnapshotRef.current = null;
      clearDraftStorage();
      return;
    }

    const payload = {
      homework: {
        title: formTitle,
        description,
        dueDate,
        hasExpiry,
        expiryDate: hasExpiry ? expiryDate : null,
        questions,
      } satisfies HomeworkPayload,
      currentQuestionIndex,
    };
    latestDraftPayloadRef.current = payload;

    const snapshot = JSON.stringify(payload);
    if (snapshot === lastDraftSnapshotRef.current) {
      return;
    }
    lastDraftSnapshotRef.current = snapshot;

    draftSaveTimeoutRef.current = window.setTimeout(() => {
      void setHomeworkDraft({
        key: FORM_STORAGE_KEY,
        homework: payload.homework,
        currentQuestionIndex: payload.currentQuestionIndex,
        updatedAt: Date.now(),
      });
    }, HOMEWORK_DRAFT_IDLE_MS);

    return () => {
      if (draftSaveTimeoutRef.current) {
        window.clearTimeout(draftSaveTimeoutRef.current);
        draftSaveTimeoutRef.current = null;
      }
    };
  }, [
    hydrated,
    formTitle,
    description,
    dueDate,
    hasExpiry,
    expiryDate,
    questions,
    currentQuestionIndex,
    clearDraftStorage,
  ]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      if (!draftSaveTimeoutRef.current) return;

      window.clearTimeout(draftSaveTimeoutRef.current);
      draftSaveTimeoutRef.current = null;

      const latestPayload = latestDraftPayloadRef.current as {
        homework: HomeworkPayload;
        currentQuestionIndex: number;
      } | null;

      if (!latestPayload) return;

      void setHomeworkDraft({
        key: FORM_STORAGE_KEY,
        homework: latestPayload.homework,
        currentQuestionIndex: latestPayload.currentQuestionIndex,
        updatedAt: Date.now(),
      });
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    if (initialHomework) {
      const resolvedId =
        initialHomework.id ?? initialHomework.homeworkId ?? null;
      const sourceKey = resolvedId ?? 'unknown';
      if (prefillSource !== sourceKey) {
        setActiveHomeworkId(resolvedId);
        setFormTitle(initialHomework.title ?? '');
        setDescription(initialHomework.description ?? '');
        setDueDate(initialHomework.dueDate ?? '');
        const enableExpiry = Boolean(initialHomework.hasExpiry);
        setHasExpiry(enableExpiry);
        setExpiryDate(
          enableExpiry && initialHomework.expiryDate
            ? initialHomework.expiryDate
            : ''
        );
        const clonedQuestions: Question[] = initialHomework.questions
          ? JSON.parse(JSON.stringify(initialHomework.questions))
          : [];
        setQuestions(clonedQuestions);
        setCurrentQuestionIndex(0);
        setPrefillSource(sourceKey);
      }
    } else if (prefillSource !== 'create') {
      setActiveHomeworkId(null);
      setPrefillSource('create');
    }
  }, [open, initialHomework, prefillSource]);

  useEffect(() => {
    if (!open) {
      setPrefillSource(null);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
    }
  }, [open, activeHomeworkId]);

  useEffect(() => {
    setCurrentQuestionIndex((idx) => {
      if (questions.length === 0) {
        return 0;
      }
      return Math.min(idx, questions.length - 1);
    });
  }, [questions.length]);

  const resetForm = () => {
    setFormTitle('');
    setDescription('');
    setDueDate(getTomorrowDate());
    setHasExpiry(false);
    setExpiryDate('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setActiveHomeworkId(null);
    setPrefillSource(null);
    clearDraftStorage();
  };

  const handleConfirmReset = () => {
    resetForm();
    setConfirmDialog({ open: false, type: null });
  };

  const handleConfirmClose = () => {
    setConfirmDialog({ open: false, type: null });
    onClose();
  };

  const handleCloseAttempt = () => {
    const hasUnsavedChanges =
      formTitle.trim() !== '' ||
      description.trim() !== '' ||
      questions.length > 0;

    if (hasUnsavedChanges) {
      setConfirmDialog({ open: true, type: 'close' });
    } else {
      onClose();
    }
  };

  const handleCancelDialog = () => {
    setConfirmDialog({ open: false, type: null });
  };

  const handleQuestionFieldChange = (
    questionId: string,
    key: keyof Question,
    value: any
  ) => {
    setQuestions((prev) => {
      const { updated, changed } = updateQuestionTree(
        prev,
        questionId,
        (q) => ({
          ...q,
          [key]: value,
        })
      );
      return changed ? updated : prev;
    });
  };

  const handleQuestionTypeChange = (
    questionId: string,
    newType: Question['type']
  ) => {
    setQuestions((prev) => {
      const meta = findQuestionMeta(prev, questionId);
      if (!meta) return prev;

      // Only allow nested containers (video/pdf) when the direct parent is a group.
      if (
        meta.depth > 0 &&
        (newType === 'video' || newType === 'pdf') &&
        meta.parent?.type !== 'group'
      ) {
        return prev;
      }

      const { updated, changed } = updateQuestionTree(prev, questionId, (q) => {
        if (newType === 'video') {
          return {
            ...q,
            type: 'video',
            required: false,
            weight: 0,
            options: undefined,
            subquestions: q.subquestions ?? [],
            video: q.video,
            pdf: undefined,
            correctAnswer: undefined,
            correctAnswers: undefined,
          };
        }

        if (newType === 'pdf') {
          return {
            ...q,
            type: 'pdf',
            required: false,
            weight: 0,
            options: undefined,
            subquestions: q.subquestions ?? [],
            video: undefined,
            pdf: q.pdf,
            correctAnswer: undefined,
            correctAnswers: undefined,
          };
        }

        const hasChildren = (q.subquestions ?? []).length > 0;
        const fallbackOptions =
          q.options && q.options.length > 0 ? [...q.options] : ['', ''];

        if (meta.depth === 0) {
          return {
            ...q,
            type: newType,
            video: undefined,
            pdf: undefined,
            subquestions: [],
            options: fallbackOptions,
            correctAnswer: newType === 'single-select' ? '' : undefined,
            correctAnswers: newType === 'multi-select' ? [] : undefined,
            weight: Math.max(q.weight || 1, 1),
          };
        }

        return {
          ...q,
          type: newType,
          video: undefined,
          pdf: undefined,
          options: hasChildren ? undefined : fallbackOptions,
          correctAnswer: newType === 'single-select' ? '' : undefined,
          correctAnswers: newType === 'multi-select' ? [] : undefined,
          weight: Math.max(q.weight || 1, 1),
        };
      });

      return changed ? updated : prev;
    });
  };

  const handleQuestionWeightChange = (questionId: string, value: string) => {
    const numeric = Number(value);
    handleQuestionFieldChange(
      questionId,
      'weight',
      Number.isFinite(numeric) && numeric > 0 ? numeric : 1
    );
  };

  const addOption = (questionId: string) => {
    setQuestions((prev) => {
      const { updated, changed } = updateQuestionTree(prev, questionId, (q) => {
        if (q.subquestions && q.subquestions.length > 0) {
          return q;
        }
        const options = [...(q.options ?? [])];
        options.push('');
        return {
          ...q,
          options,
        };
      });
      return changed ? updated : prev;
    });
  };

  const handleOptionChange = (
    questionId: string,
    index: number,
    value: string
  ) => {
    setQuestions((prev) => {
      const { updated, changed } = updateQuestionTree(prev, questionId, (q) => {
        const options = [...(q.options ?? [])];
        const previous = options[index];
        options[index] = value;
        let correctAnswer = q.correctAnswer;
        let correctAnswers = q.correctAnswers;

        if (q.type === 'single-select' && previous === q.correctAnswer) {
          correctAnswer = value;
        }

        if (q.type === 'multi-select' && Array.isArray(correctAnswers)) {
          correctAnswers = correctAnswers.map((answer) =>
            answer === previous ? value : answer
          );
        }

        return {
          ...q,
          options,
          correctAnswer,
          correctAnswers,
        };
      });
      return changed ? updated : prev;
    });
  };

  const addSubquestionInternal = (parentId: string, type: Question['type'] = 'single-select') => {
    setQuestions((prev) => {
      const meta = findQuestionMeta(prev, parentId);
      if (!meta) return prev;

      if (!IsValidChild(meta.question.type, type)) {
        return prev;
      }

      let newSub: Question;
      if (type === 'single-select' || type === 'multi-select') {
        newSub = { ...createLeafQuestion(), type };
      } else if (type === 'video') {
        newSub = createVideoQuestion();
      } else if (type === 'pdf') {
        newSub = createPdfQuestion();
      } else {
        return prev;
      }

      const { updated, changed } = updateQuestionTree(prev, parentId, (q) => {
        const existing = q.subquestions ?? [];
        const updatedSubquestions = [...existing, newSub];
        const base: Question = {
          ...q,
          subquestions: updatedSubquestions,
        };
        if (meta.depth === 1) {
          return {
            ...base,
            options: undefined,
          };
        }
        return base;
      });

      return changed ? updated : prev;
    });
  };

  const addSubquestion = (parentId: string, type: Question['type'] = 'single-select') => {
    const meta = findQuestionMeta(questions, parentId);
    if (!meta) return;

    // Check if this is a standalone single/multi choice question that needs conversion
    if (
      isChoiceType(meta.question.type) &&
      (!meta.question.subquestions || meta.question.subquestions.length === 0)
    ) {
      // Show confirmation modal
      setConvertQuestionPending({ parentId, type });
      setConvertQuestionModalOpen(true);
      return;
    }

    // Otherwise, directly add the subquestion
    addSubquestionInternal(parentId, type);
  };

  const removeSubquestion = (parentId: string, subId: string) => {
    setQuestions((prev) => {
      const meta = findQuestionMeta(prev, parentId);
      if (!meta) return prev;

      const { updated, changed } = updateQuestionTree(
        prev,
        parentId,
        (parent) => {
          const filtered = (parent.subquestions ?? []).filter(
            (sub) => sub.id !== subId
          );
          const base: Question = {
            ...parent,
            subquestions: filtered,
          };

          if (
            meta.depth > 0 &&
            filtered.length === 0 &&
            isChoiceType(parent.type)
          ) {
            return {
              ...base,
              options:
                parent.options && parent.options.length > 0
                  ? [...parent.options]
                  : ['', ''],
              correctAnswer:
                parent.type === 'single-select'
                  ? (parent.correctAnswer ?? '')
                  : undefined,
              correctAnswers:
                parent.type === 'multi-select'
                  ? (parent.correctAnswers ?? [])
                  : undefined,
            };
          }

          return base;
        }
      );

      return changed ? updated : prev;
    });
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== questionId);
      setCurrentQuestionIndex((idx) => {
        if (updated.length === 0) return 0;
        return Math.min(idx, updated.length - 1);
      });
      return updated;
    });
  };

  const addQuestion = () => {
    const newQuestion = createLeafQuestion();
    setQuestions((prev) => {
      const updated = [...prev, newQuestion];
      setCurrentQuestionIndex(updated.length - 1);
      return updated;
    });
  };

  const handleConfirmConvert = () => {
    if (!convertQuestionPending) return;

    const { parentId, type } = convertQuestionPending;
    
    setQuestions((prev) => {
      const { updated: convertedQuestions, changed: converted } = updateQuestionTree(
        prev,
        parentId,
        (q) => convertQuestionToContainer(q)
      );

      if (!converted) return prev;

      // Now add the subquestion after conversion
      const { updated: finalQuestions } = updateQuestionTree(
        convertedQuestions,
        parentId,
        (q) => {
          const existing = q.subquestions ?? [];
          let newSub: Question;
          
          if (type === 'single-select' || type === 'multi-select') {
            newSub = { ...createLeafQuestion(), type };
          } else if (type === 'video') {
            newSub = createVideoQuestion();
          } else if (type === 'pdf') {
            newSub = createPdfQuestion();
          } else {
            return q;
          }

          return {
            ...q,
            subquestions: [...existing, newSub],
          };
        }
      );

      return finalQuestions;
    });

    setConvertQuestionModalOpen(false);
    setConvertQuestionPending(null);
  };

  const handleCancelConvert = () => {
    setConvertQuestionModalOpen(false);
    setConvertQuestionPending(null);
  };

  const handleContainerDragOver = (event: React.DragEvent) => {
    if (event.dataTransfer.types.includes(NEW_QUESTION_DND_MIME)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleContainerDrop = (event: React.DragEvent) => {
    const type = event.dataTransfer.getData(NEW_QUESTION_DND_MIME) as Question['type'];
    if (!type) return;

    event.preventDefault();
    event.stopPropagation();

    setQuestions((prev) => {
      let newQuestion: Question;
      if (type === 'single-select' || type === 'multi-select') {
        newQuestion = { ...createLeafQuestion(), type };
      } else if (type === 'video') {
        newQuestion = createVideoQuestion();
      } else if (type === 'pdf') {
        newQuestion = createPdfQuestion();
      } else {
        return prev;
      }

      const updated = [...prev, newQuestion];
      setCurrentQuestionIndex(updated.length - 1);
      return updated;
    });
  };

  const handleSubmit = (isDraft: boolean) => {
    const { homework, errors } = buildValidatedHomework(
      formTitle,
      description,
      dueDate,
      hasExpiry,
      hasExpiry ? expiryDate : '',
      questions
    );

    if (errors.length > 0) {
      const remainingErrors = errors.length - 1;
      const issueLabel = remainingErrors === 1 ? 'issue' : 'issues';
      const message =
        errors.length === 1
          ? errors[0]
          : `${errors[0]} (+${remainingErrors} more validation ${issueLabel})`;

      showAlert({
        type: 'error',
        title: isDraft ? 'Cannot save draft yet' : 'Cannot publish yet',
        message,
        details: errors,
        persistent: true,
        duration: 0,
      });
      return;
    }

    const submissionHomeworkId =
      activeHomeworkId ?? initialHomework?.id ?? initialHomework?.homeworkId;

    onSubmit(homework, {
      isDraft,
      homeworkId: submissionHomeworkId ?? undefined,
    });
    resetForm();
    setConfirmDialog({ open: false, type: null });
    onClose();
  };

  const handleConfirmSubmit = () => {
    if (confirmDialog.type === 'saveDraft') {
      handleSubmit(true);
    } else if (confirmDialog.type === 'publish') {
      handleSubmit(false);
    }
  };

  const computeTotalWeight = (question: Question): number => {
    if (question.subquestions && question.subquestions.length > 0) {
      return question.subquestions.reduce(
        (total, sub) => total + computeTotalWeight(sub),
        0
      );
    }
    return question.weight;
  };

  const onInsertSubquestionFromPalette = (
    parentId: string,
    insertIndex: number,
    type: Question['type']
  ) => {
    setQuestions((prev) => {
      const meta = findQuestionMeta(prev, parentId);
      if (!meta) return prev;

      if (!IsValidChild(meta.question.type, type)) {
        return prev;
      }

      let newSub: Question;
      if (type === 'single-select' || type === 'multi-select') {
        newSub = { ...createLeafQuestion(), type };
      } else if (type === 'video') {
        newSub = createVideoQuestion();
      } else if (type === 'pdf') {
        newSub = createPdfQuestion();
      } else {
        return prev;
      }

      const { updated, changed } = updateQuestionTree(prev, parentId, (q) => {
        const existing = q.subquestions ?? [];
        const updatedSubquestions = [...existing];
        updatedSubquestions.splice(insertIndex, 0, newSub);
        
        const base: Question = {
          ...q,
          subquestions: updatedSubquestions,
        };
        if (meta.depth === 1) {
          return {
            ...base,
            options: undefined,
          };
        }
        return base;
      });

      return changed ? updated : prev;
    });
  };

  const onReorderSubquestions = (
    parentId: string,
    fromIdx: number,
    toIdx: number
  ) => {
    setQuestions((prev) => {
      const { updated, changed } = updateQuestionTree(prev, parentId, (q) => {
        const subs = [...(q.subquestions ?? [])];
        const [moved] = subs.splice(fromIdx, 1);
        subs.splice(toIdx, 0, moved);
        return { ...q, subquestions: subs };
      });
      return changed ? updated : prev;
    });
  };

  const questionEditor = (
    question: Question,
    index: number
  ): React.ReactNode => (
    <QuestionEditorPanel
      question={question}
      questionIndex={index}
      questionTypeOptions={QUESTION_TYPES}
      computeTotalWeight={computeTotalWeight}
      onFieldChange={handleQuestionFieldChange}
      onTypeChange={handleQuestionTypeChange}
      onWeightChange={handleQuestionWeightChange}
      onAddOption={addOption}
      onOptionChange={handleOptionChange}
      onAddSubquestion={addSubquestion}
      onRemoveSubquestion={removeSubquestion}
      onRemoveQuestion={removeQuestion}
      onInsertSubquestionFromPalette={onInsertSubquestionFromPalette}
      onReorderSubquestions={onReorderSubquestions}
      paletteMimeType={NEW_QUESTION_DND_MIME}
      paletteDragType={paletteDragType}
    />
  );

  const emptyEditor = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.secondary',
        p: 4,
        textAlign: 'center',
      }}
      onDragOver={handleContainerDragOver}
      onDrop={handleContainerDrop}
    >
      <Box>
        <DragIndicatorIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag a question type here
        </Typography>
        <Typography variant="body2">
          Select a question type from the sidebar and drag it here to start building your module.
        </Typography>
      </Box>
    </Box>
  );

  const questionPreview = (
    question: Question,
    index: number
  ): React.ReactNode => (
    <QuestionPreviewPanel
      question={question}
      questionIndex={index}
      computeTotalWeight={computeTotalWeight}
    />
  );

  const renderEditorSummary = (index: number, total: number): React.ReactNode => (
    <Box>
      <Typography variant="subtitle1" fontWeight={700}>
        Teacher Editor - Active Question {index + 1} of {total}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        You are editing this question right now.
      </Typography>
    </Box>
  );

  const renderStudentSummary = (index: number, total: number): React.ReactNode => (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} color="success.dark">
        Student Preview - Question {index + 1} of {total}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Live student-facing rendering for the active editor question.
      </Typography>
    </Box>
  );

  const emptyPreview = (
    <QuestionPreviewPanel
      question={undefined}
      questionIndex={0}
      computeTotalWeight={computeTotalWeight}
    />
  );

  const isEditing = Boolean(activeHomeworkId);
  const modalTitle = isEditing ? 'Edit module' : 'Create module';
  const totalSteps = BUILDER_STEPS.length;
  const goToStep = (next: number) =>
    setActiveStep((prev) => {
      const clamped = Math.max(0, Math.min(next, totalSteps - 1));
      return clamped === prev ? prev : clamped;
    });
  const handleNextStep = () => goToStep(activeStep + 1);
  const handlePreviousStep = () => goToStep(activeStep - 1);
  const canAdvanceToBuilder = Boolean(formTitle.trim()) && Boolean(dueDate);
  const onDetailsStep = activeStep === 0;
  const onBuilderStep = activeStep === 1;
  const onReviewStep = activeStep === 2;

  const handlePublishClick = () => {
    setConfirmDialog({ open: true, type: 'publish' });
  };

  const handleReviewBeforePublish = () => {
    goToStep(2); // Move to review step
  };

  const handleSplitResizeFinished = useCallback(
    (_gutterIdx: number, sizes: number[]) => {
      setSplitSizes(sizes);
    },
    []
  );

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleCloseAttempt}
        slots={{ transition: Transition }}
        slotProps={{
          paper: {
            sx: {
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.default',
            },
          },
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
            <IconButton edge="start" onClick={handleCloseAttempt}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
              {modalTitle}
            </Typography>
          <Box sx={{ flex: 1, paddingInline: 5 }}>
            <Stepper  activeStep={activeStep}>
              {BUILDER_STEPS.map((label) => (
                <Step  key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                color="warning"
                variant="contained"
                onClick={() => setConfirmDialog({ open: true, type: 'reset' })}
              >
                Reset {isEditing ? 'form' : 'draft'}
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => setConfirmDialog({ open: true, type: 'saveDraft' })}
              >
                Save draft
              </Button>
              <Button
                color="success"
                variant="contained"
                onClick={handleReviewBeforePublish}
              >
                Publish module
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, md: 3 },
          pt: { xs: 2, md: 3 },
          gap: 2,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {onReviewStep ? (
            <Paper
              sx={{
                p: { xs: 2, md: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                maxWidth: 960,
                mx: 'auto',
                overflow: 'auto',
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Review and publish
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Review your module details before publishing to students.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Module Title
                </Typography>
                <Typography variant="body1">{formTitle || 'Untitled module'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">{description || 'No description provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Due Date
                </Typography>
                <Typography variant="body1">{dueDate || 'Not set'}</Typography>
              </Box>
              {hasExpiry && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Expiry Date
                  </Typography>
                  <Typography variant="body1">{expiryDate || 'Not set'}</Typography>
                </Box>
              )}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Questions
                </Typography>
                <Typography variant="body1">
                  {questions.length} question{questions.length !== 1 ? 's' : ''} created
                </Typography>
              </Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
                mt={{ xs: 1, sm: 3 }}
              >
                <Button onClick={handlePreviousStep} variant="outlined">
                  Back to questions
                </Button>
                <Button onClick={handlePublishClick} color="success" variant="contained">
                  Confirm and publish
                </Button>
              </Stack>
            </Paper>
          ) : onDetailsStep ? (
            <Paper
              sx={{
                p: { xs: 2, md: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 960,
                mx: 'auto',
                overflow: 'auto',
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Module overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provide the basic information for your module before building questions.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                  gap: 2,
                }}
              >
                <BufferedTextField
                  label="Title"
                  fullWidth
                  value={formTitle}
                  onCommit={setFormTitle}
                  debounceMs={HOMEWORK_DRAFT_IDLE_MS}
                />
                <DatePicker
                  label="Due Date"
                  value={dueDate ? dayjs(dueDate) : null}
                  onChange={(newValue) =>
                    setDueDate(newValue ? newValue.format('YYYY-MM-DD') : '')
                  }
                  minDate={dayjs(getTodayDate())}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: 'Cannot select dates in the past',
                    },
                  }}
                />
              </Box>
              <BufferedTextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={description}
                onCommit={setDescription}
                debounceMs={HOMEWORK_DRAFT_IDLE_MS}
              />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={hasExpiry}
                      onChange={(event) => {
                        const enabled = event.target.checked;
                        setHasExpiry(enabled);
                        if (!enabled) {
                          setExpiryDate('');
                        }
                      }}
                    />
                  }
                  label="Module expires"
                />
                {!hasExpiry && (
                  <Typography variant="body2" color="text.secondary">
                    Optional: automatically revert the module to draft on a specific date.
                  </Typography>
                )}
              </Stack>
              {hasExpiry && (
                <DatePicker
                  label="Expiry Date"
                  value={expiryDate ? dayjs(expiryDate) : null}
                  onChange={(newValue) =>
                    setExpiryDate(newValue ? newValue.format('YYYY-MM-DD') : '')
                  }
                  minDate={dayjs(dueDate || getTodayDate())}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText:
                        'When the module expires it will move back to draft. Must be after the due date.',
                    },
                  }}
                />
              )}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="flex-end"
                spacing={2}
                mt={{ xs: 1, sm: 3 }}
              >
                {!canAdvanceToBuilder && (
                  <Typography variant="body2" color="text.secondary">
                    Add a title and due date to continue.
                  </Typography>
                )}
                <Button
                  variant="contained"
                  onClick={handleNextStep}
                  disabled={!canAdvanceToBuilder}
                >
                  Next: Questions
                </Button>
              </Stack>
            </Paper>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                minHeight: 0,
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={2}
              >
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    Build questions & preview responses
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drag the divider to resize the editor and the live student preview.
                  </Typography>
                </Box>
                <Button variant="text" onClick={handlePreviousStep}>
                  Back to details
                </Button>
              </Stack>
              <Box sx={{ flex: 1, minHeight: 0, display: 'flex', gap: 2 }}>
                <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Drag to add
                  </Typography>
                  {QUESTION_TYPES.map((type) => (
                    <Box
                      key={type.value}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(NEW_QUESTION_DND_MIME, type.value);
                        e.dataTransfer.effectAllowed = 'copy';
                        setPaletteDragType(type.value as Question['type']);
                      }}
                      onDragEnd={() => setPaletteDragType(null)}
                      
                    >
                      <Paper variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'grab',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}>
                        
                      <DragIndicatorIcon color="action" />
                      <Typography variant="body2">{type.label}</Typography>
                      </Paper>
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    color="success"
                    onClick={addQuestion}
                    sx={{ mt: 2 }}
                  >
                    Add Question
                  </Button>
                </Box>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <GutterStyles />
                  <Splitter
                    gutterClassName="custom-gutter-horizontal"
                    draggerClassName="custom-dragger-horizontal"
                    initialSizes={splitSizes ?? [55, 45]}
                    onResizeFinished={handleSplitResizeFinished}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        pr: { xs: 0, md: 2 },
                      }}
                      onDragOver={handleContainerDragOver}
                      onDrop={handleContainerDrop}
                    >
                      <Box sx={{ flex: 1, overflow: 'auto' }}>
                        <PaginatedQuestionLayout
                          questions={questions}
                          currentIndex={currentQuestionIndex}
                          onIndexChange={setCurrentQuestionIndex}
                          renderQuestion={(question, _numbering, index) =>
                            questionEditor(question, index)
                          }
                          emptyState={emptyEditor}
                          paginationLabel="Question"
                          summaryLabel={renderEditorSummary}
                          topSpacing={0}
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'auto',
                        pl: { xs: 0, md: 2 },
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          flex: 1,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'success.light',
                          bgcolor: 'success.50',
                        }}
                      >
                        <PaginatedQuestionLayout
                          questions={questions}
                          currentIndex={currentQuestionIndex}
                          onIndexChange={setCurrentQuestionIndex}
                          renderQuestion={(question, _numbering, index) =>
                            questionPreview(question, index)
                          }
                          emptyState={emptyPreview}
                          paginationLabel="Question"
                          summaryLabel={renderStudentSummary}
                          topSpacing={0}
                        />
                      </Paper>
                    </Box>
                  </Splitter>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>

    <Dialog
      open={confirmDialog.open}
      onClose={handleCancelDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {confirmDialog.type === 'reset' && 'Reset Form?'}
        {confirmDialog.type === 'saveDraft' && 'Save Draft?'}
        {confirmDialog.type === 'publish' && 'Publish Module?'}
        {confirmDialog.type === 'close' && 'Unsaved Changes'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {confirmDialog.type === 'reset' &&
            'This will clear all your work and remove the local draft. This action cannot be undone.'}
          {confirmDialog.type === 'saveDraft' &&
            `This will save your module as a draft to the database. The module will remain hidden from students until you publish it. Your local browser draft will be cleared after saving.`}
          {confirmDialog.type === 'publish' &&
            `This will publish the module immediately, making it visible to all students in the class. Students will be able to view and submit this module. Your local browser draft will be cleared after publishing.`}
          {confirmDialog.type === 'close' &&
            `You have unsaved changes that only exist in your current browser session. These changes are NOT saved to the database and will be lost if you clear browser data or use a different device. Click "Save draft" to persist your work to the database before closing.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDialog} color="inherit">
          Cancel
        </Button>
        {confirmDialog.type === 'reset' && (
          <Button onClick={handleConfirmReset} color="error" variant="contained">
            Reset
          </Button>
        )}
        {confirmDialog.type === 'saveDraft' && (
          <Button onClick={handleConfirmSubmit} color="primary" variant="contained">
            Save Draft
          </Button>
        )}
        {confirmDialog.type === 'publish' && (
          <Button onClick={handleConfirmSubmit} color="success" variant="contained">
            Publish Module
          </Button>
        )}
        {confirmDialog.type === 'close' && (
          <Button onClick={handleConfirmClose} color="primary" variant="contained">
            Close Anyway
          </Button>
        )}
      </DialogActions>
    </Dialog>

    <ConfirmConvertQuestionModal
      open={convertQuestionModalOpen}
      question={
        convertQuestionPending
          ? findQuestionMeta(questions, convertQuestionPending.parentId)?.question ?? null
          : null
      }
      onConfirm={handleConfirmConvert}
      onCancel={handleCancelConvert}
    />
  </>
  );
};

export default FormBuilderModal;
