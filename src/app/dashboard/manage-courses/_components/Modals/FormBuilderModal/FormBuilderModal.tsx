'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
import type { Question } from '@/app/_lib/interfaces/types';
import QuestionEditorPanel from '../../FormBuilder/QuestionEditorPanel';
import QuestionPreviewPanel from '../../FormBuilder/QuestionPreviewPanel';
import {
  buildValidatedHomework,
  findQuestionMeta,
  NEW_QUESTION_DND_MIME,
} from '../../FormBuilder/questionUtils';
import ConfirmConvertQuestionModal from '../ConfirmConvertQuestionModal';
import type { FormBuilderModalProps } from './types';
import DatePickerProvider from '@/app/_lib/components/providers/DatePickerProvider';
import {
  QUESTION_TYPES,
  BUILDER_STEPS,
} from './constants';
import { computeTotalWeight } from './utils';
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
import { useFormBuilderDraft } from './useFormBuilderDraft';

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
  const {
    formTitle,
    setFormTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    hasExpiry,
    setHasExpiry,
    expiryDate,
    setExpiryDate,
    isExam,
    setIsExam,
    scheduledAt,
    setScheduledAt,
    allowReset,
    setAllowReset,
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    activeHomeworkId,
    resetForm,
  } = useFormBuilderDraft({ open, initialHomework });

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
  const { showAlert } = useAlert();

  useEffect(() => {
    if (open) setActiveStep(0);
  }, [open, activeHomeworkId]);

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
    <DatePickerProvider>
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
    </DatePickerProvider>
  );
};

export default FormBuilderModal;
