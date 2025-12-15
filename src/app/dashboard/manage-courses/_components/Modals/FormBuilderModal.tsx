'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Slide,
  TextField,
  Paper,
  Box,
  Stack,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import {
  Homework,
  HomeworkPayload,
  Question,
} from '../../../../_lib/interfaces/types';
import Splitter from '@devbookhq/splitter';
import PaginatedQuestionLayout from '@/app/_lib/components/homework/PaginatedQuestionLayout';
import QuestionEditorPanel from '../FormBuilder/QuestionEditorPanel';
import QuestionPreviewPanel from '../FormBuilder/QuestionPreviewPanel';
import { GutterStyles } from '@/app/_lib/components/shared-theme/customizations/SplitterComponent';
import {
  buildValidatedHomework,
  createLeafQuestion,
  createVideoQuestion,
  findQuestionMeta,
  isChoiceType,
  updateQuestionTree,
} from '../FormBuilder/questionUtils';

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
  { value: 'radio', label: 'Single Choice' },
  { value: 'multi-select', label: 'Multiple Choice' },
] as const;

const FORM_STORAGE_KEY = 'form_builder_modal_state_v3';
const BUILDER_STEPS = ['Module details', 'Create questions'] as const;

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
  const [dueDate, setDueDate] = useState('');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [activeHomeworkId, setActiveHomeworkId] = useState<string | null>(null);
  const [prefillSource, setPrefillSource] = useState<string | null>(null);
  const [splitSizes, setSplitSizes] = useState<number[] | undefined>();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(FORM_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFormTitle(parsed.formTitle ?? '');
        setDescription(parsed.description ?? '');
        setDueDate(parsed.dueDate ?? '');
        setHasExpiry(Boolean(parsed.hasExpiry));
        setExpiryDate(parsed.expiryDate ?? '');
        const storedQuestions: Question[] = Array.isArray(parsed.questions)
          ? parsed.questions
          : [];
        setQuestions(storedQuestions);
        if (storedQuestions.length > 0) {
          const index = Math.min(
            parsed.currentQuestionIndex ?? 0,
            storedQuestions.length - 1
          );
          setCurrentQuestionIndex(index);
        }
      }
    } catch (error) {
      console.error('Failed to restore form builder draft', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    if (activeHomeworkId) return;

    const isEmpty =
      !formTitle &&
      !description &&
      !dueDate &&
      !hasExpiry &&
      questions.length === 0;

    if (isEmpty) {
      localStorage.removeItem(FORM_STORAGE_KEY);
      return;
    }

    const payload = {
      formTitle,
      description,
      dueDate,
      hasExpiry,
      expiryDate,
      questions,
      currentQuestionIndex,
    };

    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(payload));
  }, [
    hydrated,
    formTitle,
    description,
    dueDate,
    hasExpiry,
    expiryDate,
    questions,
    currentQuestionIndex,
    activeHomeworkId,
  ]);

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
        setValidationErrors([]);
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
    setDueDate('');
    setHasExpiry(false);
    setExpiryDate('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setValidationErrors([]);
    setActiveHomeworkId(null);
    setPrefillSource(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
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

      if (meta.depth > 0 && (newType === 'video' || newType === 'pdf')) {
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
            correctAnswer: newType === 'radio' ? '' : undefined,
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
          correctAnswer: newType === 'radio' ? '' : undefined,
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
      Number.isFinite(numeric) ? Math.max(numeric, 0) : 0
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

        if (q.type === 'radio' && previous === q.correctAnswer) {
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

  const addSubquestion = (parentId: string) => {
    setQuestions((prev) => {
      const meta = findQuestionMeta(prev, parentId);
      if (!meta) return prev;

      if (meta.depth === 0 && !['video', 'pdf'].includes(meta.question.type)) {
        return prev;
      }

      if (meta.depth >= 2) {
        return prev;
      }

      const newSub = createLeafQuestion();

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
                parent.type === 'radio'
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
    const newQuestion = createVideoQuestion();
    setQuestions((prev) => {
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
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    const submissionHomeworkId =
      activeHomeworkId ?? initialHomework?.id ?? initialHomework?.homeworkId;

    onSubmit(homework, {
      isDraft,
      homeworkId: submissionHomeworkId ?? undefined,
    });
    resetForm();
    onClose();
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
    />
  );

  const emptyEditor = (
    <QuestionEditorPanel
      question={undefined}
      questionIndex={0}
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
    />
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

  const handleSplitResizeFinished = useCallback(
    (_gutterIdx: number, sizes: number[]) => {
      setSplitSizes(sizes);
    },
    []
  );

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
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
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ flex: 1 }} variant="h6">
            {modalTitle}
          </Typography>
          <Button color="inherit" onClick={resetForm} sx={{ mr: 1 }}>
            Reset {isEditing ? 'form' : 'draft'}
          </Button>
          <Button
            color="inherit"
            onClick={() => handleSubmit(true)}
            sx={{ mr: 1 }}
          >
            Save draft
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => handleSubmit(false)}
          >
            Publish module
          </Button>
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
        <Stepper activeStep={activeStep} alternativeLabel>
          {BUILDER_STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {validationErrors.length > 0 && (
          <Alert severity="error">
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </Box>
          </Alert>
        )}

        <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {onDetailsStep ? (
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
                <TextField
                  label="Title"
                  fullWidth
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
                <TextField
                  label="Due Date"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Box>
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                <TextField
                  label="Expiry Date"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  helperText="When the module expires it will move back to draft."
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
              <Box sx={{ flex: 1, minHeight: 0 }}>
                {GutterStyles()}
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
                        topSpacing={0}
                      />
                    </Box>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      mt={2}
                      justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                    >
                      <Button variant="contained" onClick={addQuestion}>
                        Add Question
                      </Button>
                    </Stack>
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
                    <Paper sx={{ p: 2, flex: 1 }}>
                      <PaginatedQuestionLayout
                        questions={questions}
                        currentIndex={currentQuestionIndex}
                        onIndexChange={setCurrentQuestionIndex}
                        renderQuestion={(question, _numbering, index) =>
                          questionPreview(question, index)
                        }
                        emptyState={emptyPreview}
                        paginationLabel="Question"
                        summaryLabel={(index, total) => (
                          <Typography variant="subtitle1" fontWeight={600}>
                            Student preview — Question {index + 1} of {total}
                          </Typography>
                        )}
                        topSpacing={0}
                      />
                    </Paper>
                  </Box>
                </Splitter>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default FormBuilderModal;
