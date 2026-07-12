'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { type NextPage } from 'next';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { type TransitionProps } from '@mui/material/transitions';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import type {
  Homework,
  HomeworkPayload,
  Question,
} from '@/app/_lib/interfaces/types';
import QuestionEditorPanel from '../../FormBuilder/QuestionEditorPanel';
import QuestionPreviewPanel from '../../FormBuilder/QuestionPreviewPanel';
import {
  buildValidatedHomework,
  findQuestionMeta,
  NEW_QUESTION_DND_MIME,
} from '../../FormBuilder/questionUtils';
import ConfirmConvertQuestionModal from '../ConfirmConvertQuestionModal';
import {
  getHomeworkDraft,
  setHomeworkDraft,
  removeHomeworkDraft,
  migrateLocalStorageDrafts,
} from '@/app/_lib/utils/homeworkDraftStore';
import type { FormBuilderModalProps } from './types';
import {
  QUESTION_TYPES,
  FORM_STORAGE_KEY,
  LEGACY_FORM_STORAGE_KEY,
  BUILDER_STEPS,
  HOMEWORK_DRAFT_IDLE_MS,
} from './constants';
import { getTomorrowDate, computeTotalWeight } from './utils';
import { ModalContentArea } from './elements';
import FormBuilderStepper from './components/FormBuilderStepper';
import FormBuilderToolbar from './components/FormBuilderToolbar';
import FormBuilderDetailsStep from './components/FormBuilderDetailsStep';
import FormBuilderReviewStep from './components/FormBuilderReviewStep';
import FormBuilderBuilderStep, {
  FormBuilderEmptyEditor,
} from './components/FormBuilderBuilderStep';
import FormBuilderConfirmDialog, {
  type FormBuilderConfirmType,
} from './components/FormBuilderConfirmDialog';
import { createQuestionTreeHandlers } from './questionTreeHandlers';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any> },
  ref: React.Ref<unknown>,
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
  const [isExam, setIsExam] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [allowReset, setAllowReset] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [activeHomeworkId, setActiveHomeworkId] = useState<string | null>(null);
  const [prefillSource, setPrefillSource] = useState<string | null>(null);
  const [splitSizes, setSplitSizes] = useState<number[] | undefined>();
  const [activeStep, setActiveStep] = useState(0);
  const [paletteDragType, setPaletteDragType] = useState<Question['type'] | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: FormBuilderConfirmType;
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
        setCurrentQuestionIndex(Math.min(questionIndex, storedQuestions.length - 1));
      }
    };

    void (async () => {
      try {
        await migrateLocalStorageDrafts([FORM_STORAGE_KEY, LEGACY_FORM_STORAGE_KEY]);
        const record = await getHomeworkDraft(FORM_STORAGE_KEY);
        if (record) {
          applyDraft(record.homework as HomeworkPayload | null, record.currentQuestionIndex);
          return;
        }

        const legacy = await getHomeworkDraft(LEGACY_FORM_STORAGE_KEY);
        if (legacy) {
          const parsed = legacy.homework as Record<string, unknown>;
          applyDraft(
            {
              title: (parsed?.formTitle as string) ?? (parsed?.title as string) ?? '',
              description: (parsed?.description as string) ?? '',
              dueDate: (parsed?.dueDate as string) ?? '',
              hasExpiry: Boolean(parsed?.hasExpiry),
              expiryDate: (parsed?.expiryDate as string) ?? '',
              questions: Array.isArray(parsed?.questions)
                ? (parsed.questions as Question[])
                : [],
            },
            legacy.currentQuestionIndex,
          );
        }
      } catch (error) {
        console.error('Failed to restore form builder draft', error);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
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
        isExam,
        scheduledAt: isExam ? scheduledAt || null : null,
        allowReset,
        questions,
      } satisfies HomeworkPayload,
      currentQuestionIndex,
    };
    latestDraftPayloadRef.current = payload;

    const snapshot = JSON.stringify(payload);
    if (snapshot === lastDraftSnapshotRef.current) return;
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
    isExam,
    scheduledAt,
    allowReset,
    questions,
    currentQuestionIndex,
    clearDraftStorage,
  ]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined' || !draftSaveTimeoutRef.current) return;
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
      const resolvedId = initialHomework.id ?? initialHomework.homeworkId ?? null;
      const sourceKey = resolvedId ?? 'unknown';
      if (prefillSource !== sourceKey) {
        setActiveHomeworkId(resolvedId);
        setFormTitle(initialHomework.title ?? '');
        setDescription(initialHomework.description ?? '');
        setDueDate(initialHomework.dueDate ?? '');
        const enableExpiry = Boolean(initialHomework.hasExpiry);
        setHasExpiry(enableExpiry);
        setExpiryDate(enableExpiry && initialHomework.expiryDate ? initialHomework.expiryDate : '');
        setIsExam(Boolean(initialHomework.isExam));
        setScheduledAt(initialHomework.scheduledAt ?? '');
        setAllowReset(Boolean(initialHomework.allowReset));
        setQuestions(
          initialHomework.questions
            ? JSON.parse(JSON.stringify(initialHomework.questions))
            : [],
        );
        setCurrentQuestionIndex(0);
        setPrefillSource(sourceKey);
      }
    } else if (prefillSource !== 'create') {
      setActiveHomeworkId(null);
      setPrefillSource('create');
    }
  }, [open, initialHomework, prefillSource]);

  useEffect(() => {
    if (!open) setPrefillSource(null);
  }, [open]);

  useEffect(() => {
    if (open) setActiveStep(0);
  }, [open, activeHomeworkId]);

  useEffect(() => {
    setCurrentQuestionIndex((idx) => {
      if (questions.length === 0) return 0;
      return Math.min(idx, questions.length - 1);
    });
  }, [questions.length]);

  const resetForm = () => {
    setFormTitle('');
    setDescription('');
    setDueDate(getTomorrowDate());
    setHasExpiry(false);
    setExpiryDate('');
    setIsExam(false);
    setScheduledAt('');
    setAllowReset(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setActiveHomeworkId(null);
    setPrefillSource(null);
    clearDraftStorage();
  };

  const {
    handleQuestionFieldChange,
    handleQuestionTypeChange,
    handleQuestionWeightChange,
    addOption,
    handleOptionChange,
    addSubquestion,
    removeSubquestion,
    removeQuestion,
    addQuestion,
    handleConfirmConvert,
    onInsertSubquestionFromPalette,
    onReorderSubquestions,
    handleContainerDrop,
  } = createQuestionTreeHandlers(
    questions,
    setQuestions,
    setCurrentQuestionIndex,
    (parentId, type) => {
      setConvertQuestionPending({ parentId, type });
      setConvertQuestionModalOpen(true);
    },
  );

  const handleContainerDragOver = (event: React.DragEvent) => {
    if (event.dataTransfer.types.includes(NEW_QUESTION_DND_MIME)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  const onContainerDrop = (event: React.DragEvent) => {
    handleContainerDrop(event, NEW_QUESTION_DND_MIME);
  };

  const handleSubmit = (isDraft: boolean) => {
    const { homework, errors } = buildValidatedHomework(
      formTitle,
      description,
      dueDate,
      hasExpiry,
      hasExpiry ? expiryDate : '',
      questions,
      { isExam, scheduledAt: isExam ? scheduledAt || null : null, allowReset },
    );

    if (errors.length > 0) {
      const remainingErrors = errors.length - 1;
      const issueLabel = remainingErrors === 1 ? 'issue' : 'issues';
      showAlert({
        type: 'error',
        title: isDraft ? 'Cannot save draft yet' : 'Cannot publish yet',
        message:
          errors.length === 1
            ? (errors[0] ?? 'Validation failed')
            : `${errors[0] ?? 'Validation failed'} (+${remainingErrors} more validation ${issueLabel})`,
        details: errors,
        persistent: true,
        duration: 0,
      });
      return;
    }

    onSubmit(homework, {
      isDraft,
      homeworkId:
        activeHomeworkId ?? initialHomework?.id ?? initialHomework?.homeworkId ?? undefined,
    });
    resetForm();
    setConfirmDialog({ open: false, type: null });
    onClose();
  };

  const handleSplitResizeFinished = useCallback((_gutterIdx: number, sizes: number[]) => {
    setSplitSizes(sizes);
  }, []);

  const isEditing = Boolean(activeHomeworkId);
  const modalTitle = isEditing ? 'Edit module' : 'Create module';
  const totalSteps = BUILDER_STEPS.length;
  const goToStep = (next: number) =>
    setActiveStep((prev) => {
      const clamped = Math.max(0, Math.min(next, totalSteps - 1));
      return clamped === prev ? prev : clamped;
    });
  const canAdvanceToBuilder = Boolean(formTitle.trim()) && Boolean(dueDate);
  const totalMarks = questions.reduce((sum, q) => sum + computeTotalWeight(q), 0);

  const questionEditor = (question: Question, index: number) => (
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

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={() => {
          const hasUnsavedChanges =
            formTitle.trim() !== '' || description.trim() !== '' || questions.length > 0;
          if (hasUnsavedChanges) {
            setConfirmDialog({ open: true, type: 'close' });
          } else {
            onClose();
          }
        }}
        slots={{ transition: Transition }}
        slotProps={{
          paper: {
            sx: { display: 'flex', flexDirection: 'column', bgcolor: 'background.default' },
          },
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
            <IconButton
              edge="start"
              onClick={() => {
                const hasUnsavedChanges =
                  formTitle.trim() !== '' || description.trim() !== '' || questions.length > 0;
                if (hasUnsavedChanges) {
                  setConfirmDialog({ open: true, type: 'close' });
                } else {
                  onClose();
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
              {modalTitle}
            </Typography>
            <FormBuilderStepper activeStep={activeStep} />
            <FormBuilderToolbar
              isEditing={isEditing}
              onReset={() => setConfirmDialog({ open: true, type: 'reset' })}
              onSaveDraft={() => setConfirmDialog({ open: true, type: 'saveDraft' })}
              onReviewBeforePublish={() => goToStep(2)}
            />
          </Toolbar>
        </AppBar>
        <ModalContentArea>
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {activeStep === 2 ? (
              <FormBuilderReviewStep
                formTitle={formTitle}
                description={description}
                dueDate={dueDate}
                hasExpiry={hasExpiry}
                expiryDate={expiryDate}
                isExam={isExam}
                scheduledAt={scheduledAt}
                allowReset={allowReset}
                questions={questions}
                totalMarks={totalMarks}
                onPrevious={() => goToStep(1)}
                onPublish={() => setConfirmDialog({ open: true, type: 'publish' })}
              />
            ) : activeStep === 0 ? (
              <FormBuilderDetailsStep
                formTitle={formTitle}
                description={description}
                dueDate={dueDate}
                hasExpiry={hasExpiry}
                expiryDate={expiryDate}
                isExam={isExam}
                scheduledAt={scheduledAt}
                allowReset={allowReset}
                canAdvanceToBuilder={canAdvanceToBuilder}
                onFormTitleChange={setFormTitle}
                onDescriptionChange={setDescription}
                onDueDateChange={setDueDate}
                onHasExpiryChange={setHasExpiry}
                onExpiryDateChange={setExpiryDate}
                onIsExamChange={setIsExam}
                onScheduledAtChange={setScheduledAt}
                onAllowResetChange={setAllowReset}
                onNext={() => goToStep(1)}
              />
            ) : (
              <FormBuilderBuilderStep
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                splitSizes={splitSizes}
                paletteDragType={paletteDragType}
                questionEditor={questionEditor}
                questionPreview={(question, index) => (
                  <QuestionPreviewPanel
                    question={question}
                    questionIndex={index}
                    computeTotalWeight={computeTotalWeight}
                  />
                )}
                emptyEditor={
                  <FormBuilderEmptyEditor
                    onDragOver={handleContainerDragOver}
                    onDrop={onContainerDrop}
                  />
                }
                emptyPreview={
                  <QuestionPreviewPanel
                    question={undefined}
                    questionIndex={0}
                    computeTotalWeight={computeTotalWeight}
                  />
                }
                renderEditorSummary={(index, total) => (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Teacher Editor - Active Question {index + 1} of {total}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      You are editing this question right now.
                    </Typography>
                  </Box>
                )}
                renderStudentSummary={(index, total) => (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="success.dark">
                      Student Preview - Question {index + 1} of {total}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Live student-facing rendering for the active editor question.
                    </Typography>
                  </Box>
                )}
                onIndexChange={setCurrentQuestionIndex}
                onPrevious={() => goToStep(0)}
                onAddQuestion={addQuestion}
                onPaletteDragStart={setPaletteDragType}
                onPaletteDragEnd={() => setPaletteDragType(null)}
                onContainerDragOver={handleContainerDragOver}
                onContainerDrop={onContainerDrop}
                onSplitResizeFinished={handleSplitResizeFinished}
              />
            )}
          </Box>
        </ModalContentArea>
      </Dialog>

      <FormBuilderConfirmDialog
        open={confirmDialog.open}
        type={confirmDialog.type}
        onCancel={() => setConfirmDialog({ open: false, type: null })}
        onConfirmReset={() => {
          resetForm();
          setConfirmDialog({ open: false, type: null });
        }}
        onConfirmSubmit={() => {
          if (confirmDialog.type === 'saveDraft') handleSubmit(true);
          else if (confirmDialog.type === 'publish') handleSubmit(false);
        }}
        onConfirmClose={() => {
          setConfirmDialog({ open: false, type: null });
          onClose();
        }}
      />

      <ConfirmConvertQuestionModal
        open={convertQuestionModalOpen}
        question={
          convertQuestionPending
            ? findQuestionMeta(questions, convertQuestionPending.parentId)?.question ?? null
            : null
        }
        onConfirm={() => {
          if (!convertQuestionPending) return;
          handleConfirmConvert(
            convertQuestionPending.parentId,
            convertQuestionPending.type,
          );
          setConvertQuestionModalOpen(false);
          setConvertQuestionPending(null);
        }}
        onCancel={() => {
          setConvertQuestionModalOpen(false);
          setConvertQuestionPending(null);
        }}
      />
    </>
  );
};

export default FormBuilderModal;
