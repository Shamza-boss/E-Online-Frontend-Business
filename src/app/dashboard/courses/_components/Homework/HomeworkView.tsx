'use client';

import React, { useMemo, useState } from 'react';
import {
  Typography,
  Button,
  Paper,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  ButtonBase,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Homework,
  SubmittedHomework,
  Question,
} from '../../../../_lib/interfaces/types';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import QuestionTextDisplay from '@/app/_lib/components/TipTapEditor/QuestionTextDisplay';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';
import { sortQuestionTreeByDisplayOrder } from '@/app/_lib/utils/questionOrder';
import { extractPlainText } from '@/app/_lib/utils/textUtils';

const PageSurface = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
  flex: 1,
  width: '100%',
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const NodeCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'depth',
})<{ depth: number }>(({ theme, depth }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  marginInlineStart: depth > 1 ? theme.spacing((depth - 1) * 2) : 0,
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.95)}`,
  borderLeft: `4px solid ${alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.6 : 0.3)}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const StickyFooter = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
  backgroundColor: alpha(
    theme.palette.background.paper,
    theme.palette.mode === 'dark' ? 0.96 : 0.98
  ),
  flexShrink: 0,
  width: '100%',
  padding: theme.spacing(1.25),
}));

const ViewShell = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
}));

const BodyShell = styled(Box)(({ theme }) => ({
  flex: 1,
  width: '100%',
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  overflow: 'hidden',
}));

const DotStepper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  overflowX: 'auto',
  overflowY: 'hidden',
  whiteSpace: 'nowrap',
  paddingBottom: theme.spacing(0.25),
  alignItems: 'center',
}));

const StepPill = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'completed' && prop !== 'active',
})<{ completed: boolean; active: boolean }>(({ theme, completed, active }) => {
  const completeOpacity = theme.palette.mode === 'dark' ? 0.24 : 0.12;
  const activeOpacity = theme.palette.mode === 'dark' ? 0.28 : 0.15;

  let borderColor = alpha(theme.palette.divider, 0.95);
  let backgroundColor = theme.palette.background.paper;
  let textColor = theme.palette.text.secondary;

  if (completed) {
    borderColor = alpha(theme.palette.success.main, 0.55);
    backgroundColor = alpha(theme.palette.success.main, completeOpacity);
    textColor = theme.palette.success.main;
  }

  if (active) {
    borderColor = alpha(theme.palette.primary.main, 0.6);
    backgroundColor = alpha(theme.palette.primary.main, activeOpacity);
    textColor = theme.palette.primary.main;
  }

  return {
    height: 30,
    minWidth: 42,
    borderRadius: 999,
    paddingInline: theme.spacing(1),
    border: `1px solid ${borderColor}`,
    backgroundColor,
    color: textColor,
    fontWeight: 600,
    fontSize: 12,
  };
});

const formatFileSize = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
};

interface HomeworkViewProps {
  homework: Homework;
  onSubmit: (submittedHomework: SubmittedHomework) => void;
  readOnly?: boolean;
}

const HomeworkView: React.FC<HomeworkViewProps> = ({
  homework,
  onSubmit,
  readOnly = false,
}) => {
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pdfPreview, setPdfPreview] = useState<{
    title: string;
    url: string;
    key?: string | null;
  } | null>(null);

  const sortedQuestions = useMemo(
    () => sortQuestionTreeByDisplayOrder(homework.questions),
    [homework.questions]
  );

  const handleChange = (questionId: string, value: any) => {
    if (!readOnly) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleMultiSelectToggle = (
    questionId: string,
    option: string,
    checked: boolean
  ) => {
    if (readOnly) return;

    const previousAnswers = Array.isArray(answers[questionId])
      ? (answers[questionId] as string[])
      : [];
    const updatedAnswers = checked
      ? [...previousAnswers, option]
      : previousAnswers.filter((item) => item !== option);

    handleChange(questionId, updatedAnswers);
  };

  const createMultiSelectHandler = (questionId: string, option: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      handleMultiSelectToggle(questionId, option, event.target.checked);
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readOnly) {
      const submitted: SubmittedHomework = { homework, answers };
      onSubmit(submitted);
    }
  };

  const computeTotalWeight = (node: Question): number => {
    if (node.subquestions && node.subquestions.length > 0) {
      return node.subquestions.reduce(
        (sum, sub) => sum + computeTotalWeight(sub),
        0
      );
    }

    return Number.isFinite(node.weight) ? node.weight : 0;
  };

  const openPdfPreview = (fallbackTitle: string, pdf?: Question['pdf']) => {
    if (!pdf?.url) return;
    setPdfPreview({
      title: pdf.title || fallbackTitle || 'PDF Document',
      url: pdf.url,
      key: pdf.key,
    });
  };

  const closePdfPreview = () => setPdfPreview(null);

  const isAnsweredValue = (value: unknown): boolean => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== undefined && value !== null;
  };

  const isNodeCompleted = (node: Question): boolean => {
    if (node.subquestions && node.subquestions.length > 0) {
      return node.subquestions.every(isNodeCompleted);
    }
    return isAnsweredValue(answers[node.id]);
  };

  const totalQuestions = sortedQuestions.length;
  const safeIndex =
    totalQuestions > 0
      ? Math.min(Math.max(currentQuestionIndex, 0), totalQuestions - 1)
      : 0;

  const renderPdfAttachment = (
    title: string,
    pdf?: Question['pdf'],
    options: { compact?: boolean } = {}
  ) => {
    const mt = options.compact ? 1 : 2;

    if (!pdf?.url) {
      return (
        <Paper variant="outlined" sx={{ mt, p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Document unavailable
          </Typography>
        </Paper>
      );
    }

    const sizeLabel = formatFileSize(pdf.sizeBytes);

    return (
      <Paper variant="outlined" sx={{ mt, p: 2 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PictureAsPdfIcon color="error" />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {pdf.title || title || 'PDF Document'}
              </Typography>
              {pdf.key && (
                <Typography variant="caption" color="text.secondary">
                  {pdf.key}
                </Typography>
              )}
            </Box>
            <Box flexGrow={1} />
            <Button
              variant="contained"
              size="small"
              startIcon={<PictureAsPdfIcon />}
              onClick={() => openPdfPreview(title, pdf)}
            >
              Open PDF
            </Button>
          </Stack>
          {sizeLabel && (
            <Typography variant="caption" color="text.secondary">
              Size: {sizeLabel}
            </Typography>
          )}
        </Stack>
      </Paper>
    );
  };

  const renderQuestionNode = (
    node: Question,
    numbering: string,
    depth: number = 1
  ): React.ReactNode => {
    const textVariant = depth === 1 ? 'h6' : 'subtitle1';

    if (node.subquestions && node.subquestions.length > 0) {
      const sectionWeight = computeTotalWeight(node);
      return (
        <NodeCard key={node.id} depth={depth}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'baseline',
            }}
          >
            <Typography variant={textVariant} sx={{ fontWeight: 600 }}>
              {numbering}.
            </Typography>
            <QuestionTextDisplay
              content={node.questionText}
              fallback="Untitled section"
              variant={textVariant}
              component="span"
              fontWeight={600}
              sx={{ flex: 1, minWidth: 0 }}
            />
            {sectionWeight > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                component="span"
              >
                (Total Weight: {sectionWeight})
              </Typography>
            )}
          </Box>
          {node.type === 'video' && (
            <Box sx={{ mt: 2 }}>
              {node.video ? (
                <VideoPlayer video={node.video} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Video unavailable
                </Typography>
              )}
            </Box>
          )}
          {node.type === 'pdf' &&
            renderPdfAttachment(
              extractPlainText(node.questionText) || 'PDF section',
              node.pdf
            )}
          {node.subquestions.map((sub, idx) =>
            renderQuestionNode(sub, `${numbering}.${idx + 1}`, depth + 1)
          )}
        </NodeCard>
      );
    }

    const options = node.options ?? [];

    return (
      <NodeCard key={node.id} depth={depth}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'baseline',
            }}
          >
            <Typography variant={textVariant}>{numbering}.</Typography>
            <QuestionTextDisplay
              content={node.questionText}
              fallback="Untitled question"
              variant={textVariant}
              component="span"
              sx={{ flex: 1, minWidth: 0 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            (Weight: {Number.isFinite(node.weight) ? node.weight : 0})
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          {(() => {
            if (node.type === 'single-select') {
              return (
                <RadioGroup
                  value={answers[node.id] || ''}
                  onChange={(e) => handleChange(node.id, e.target.value)}
                  row
                >
                  {options.length > 0 ? (
                    options.map((option, idx) => (
                      <FormControlLabel
                        key={`${node.id}-single-${option}-${idx}`}
                        value={option}
                        control={<Radio disabled={readOnly} />}
                        label={option || `Option ${idx + 1}`}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Options will appear here
                    </Typography>
                  )}
                </RadioGroup>
              );
            }

            if (node.type === 'multi-select') {
              return options.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {options.map((option, idx) => (
                    <FormControlLabel
                      key={`${node.id}-multi-${option}-${idx}`}
                      control={
                        <Checkbox
                          disabled={readOnly}
                          checked={
                            Array.isArray(answers[node.id])
                              ? (answers[node.id] as string[]).includes(option)
                              : false
                          }
                          onChange={createMultiSelectHandler(node.id, option)}
                        />
                      }
                      label={option || `Option ${idx + 1}`}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Options will appear here
                </Typography>
              );
            }

            if (node.type === 'video') {
              return node.video ? (
                <VideoPlayer video={node.video} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Video unavailable
                </Typography>
              );
            }

            if (node.type === 'pdf') {
              return renderPdfAttachment(
                extractPlainText(node.questionText) || 'PDF question',
                node.pdf,
                { compact: true }
              );
            }

            return (
              <Typography variant="body2" color="text.secondary">
                Unsupported question type
              </Typography>
            );
          })()}
        </Box>
      </NodeCard>
    );
  };

  return (
    <React.Fragment>
      <ViewShell>
        <BodyShell>
        <PageSurface>
          <Typography variant="subtitle1" gutterBottom>
            {homework.description}
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              width: '100%',
              minHeight: 0,
            }}
          >
            {totalQuestions > 0 ? (
              <React.Fragment>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                  Viewing Question {safeIndex + 1} of {totalQuestions}
                </Typography>
                <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, overflowY: 'auto', pr: 0.5 }}>
                  {renderQuestionNode(
                    sortedQuestions[safeIndex],
                    String(safeIndex + 1)
                  )}
                </Box>
              </React.Fragment>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No questions to display.
              </Typography>
            )}
          </form>
        </PageSurface>
        <StickyFooter>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <DotStepper>
                {sortedQuestions.map((question, index) => (
                  <StepPill
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    completed={isNodeCompleted(question)}
                    active={index === safeIndex}
                  >
                    {`Q${index + 1}`}
                  </StepPill>
                ))}
              </DotStepper>
            </Box>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="primary"
                disabled={safeIndex <= 0 || totalQuestions === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={safeIndex >= totalQuestions - 1 || totalQuestions === 0}
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(totalQuestions - 1, prev + 1)
                  )
                }
              >
                Next
              </Button>
              {!readOnly && (
                <Button
                  autoFocus
                  color="success"
                  variant="contained"
                  onClick={(e) => handleSubmit(e as any)}
                  sx={{ minWidth: 150, fontWeight: 700 }}
                >
                  Submit Answers
                </Button>
              )}
            </Stack>
          </Stack>
        </StickyFooter>
      </BodyShell>
      </ViewShell>
      <Dialog
        open={Boolean(pdfPreview)}
        onClose={closePdfPreview}
        fullWidth
        maxWidth="lg"
        slotProps={{ paper: { sx: { height: { xs: '90vh', md: '80vh' } } } }}
      >
        <DialogTitle sx={{ pr: 6 }}>
          {pdfPreview?.title || 'PDF Document'}
          <IconButton
            onClick={closePdfPreview}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {pdfPreview?.url && (
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <PDFViewer fileUrl={pdfPreview.url} initialPage={1} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default HomeworkView;
