'use client';

import React, { useMemo, useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { type GradedHomework, type Question } from '../../interfaces/types';
import {
  computeQuestionTotals,
  calculateHomeworkTotals,
} from '../../utils/gradeCalculator';
import { MathJaxContext } from 'better-react-mathjax';
import QuestionTreeRenderer from '../question/QuestionTreeRenderer';
import { sortQuestionTreeByDisplayOrder } from '../../utils/questionOrder';
import PDFViewer from '../PDFViewer/PDFViewer';
import { StepPill } from '@/app/dashboard/courses/_components/Homework/HomeworkView';

const mathJaxConfig = {
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  loader: { load: ['input/tex', 'output/chtml'] },
};

/* ── Helpers ── */

const getGradeBorder = (award: number, weight: number): string => {
  if (award === 0) return 'red';
  if (award < weight) return 'orange';
  if (award >= weight) return 'green';
  return 'transparent';
};

/* ── Styled components (identical to HomeworkView) ── */

const ViewShell = styled(Box)(() => ({
  height: '100%',
  width: '100%',
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const PageSurface = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
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

const FooterBar = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
  backgroundColor: alpha(
    theme.palette.background.paper,
    theme.palette.mode === 'dark' ? 0.96 : 0.98
  ),
  flexShrink: 0,
  width: '100%',
  padding: theme.spacing(1, 2),
  marginTop: theme.spacing(1.5),
}));

const DotStepper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  overflowX: 'auto',
  overflowY: 'hidden',
  whiteSpace: 'nowrap',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
  justifyContent: 'center',
}));

/* ── Component ── */

type GradedHomeworkProps = {
  gradedHomework: GradedHomework;
  onBack?: () => void;
}

const GradedHomeworkComponent: React.FC<GradedHomeworkProps> = ({
  gradedHomework,
  onBack,
}) => {
  const { homework, answers, grading, overallComment } = gradedHomework;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pdfPreview, setPdfPreview] = useState<{
    url: string;
    title?: string;
  } | null>(null);

  const sortedQuestions = useMemo(
    () => sortQuestionTreeByDisplayOrder(homework.questions),
    [homework.questions]
  );

  const questionCount = sortedQuestions.length;
  const currentQuestion = sortedQuestions[currentQuestionIndex];

  const overallTotals = useMemo(
    () => calculateHomeworkTotals(sortedQuestions, grading),
    [sortedQuestions, grading]
  );

  const percentage =
    overallTotals.estimated > 0
      ? Math.round((overallTotals.awarded / overallTotals.estimated) * 100)
      : 0;

  const computeTotalWeight = (question: Question): number => {
    if (question.subquestions && question.subquestions.length > 0) {
      return question.subquestions.reduce(
        (sum, sub) => sum + computeTotalWeight(sub),
        0
      );
    }
    return Number.isFinite(question.weight) ? Number(question.weight) : 0;
  };

  const computeSectionTotals = (
    questionNode: Question,
    _gradingMap: Record<string, { grade?: number; comment?: string } | undefined>
  ) => computeQuestionTotals(questionNode, grading);

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <ViewShell>
        {/* ── Scrollable question area ── */}
        <PageSurface elevation={0}>
          {/* Back button (matches HomeworkView) */}
          {onBack && (
            <Button
              size="small"
              onClick={onBack}
              startIcon={<ArrowBackRoundedIcon fontSize="small" />}
              variant="contained"
              color="warning"
              sx={{ alignSelf: 'flex-start', fontWeight: 700, px: 4, mb: 2 }}
            >
              Back to assessments
            </Button>
          )}

          {/* Question content */}
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', pr: 0.5 }}>
            {questionCount > 0 && currentQuestion ? (
              <QuestionTreeRenderer
                mode="graded"
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                computeTotalWeight={computeTotalWeight}
                answers={answers}
                grading={grading}
                computeSectionTotals={computeSectionTotals}
                getGradeBorder={getGradeBorder}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No questions to display.
              </Typography>
            )}
          </Box>
        </PageSurface>

        {/* ── Footer bar ── */}
        <FooterBar elevation={0}>
          <Stack spacing={0.75}>
            {/* Grade + nav row */}
            <Stack direction="row" spacing={1} alignItems="center">
              {/* Prominent score badge */}
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  border: `1.5px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                  flexShrink: 0,
                })}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.95rem' }}>
                  {overallTotals.awarded}/{overallTotals.estimated}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.95rem' }}>
                  ({percentage}%)
                </Typography>
              </Box>

              {/* Question navigator */}
              <IconButton
                size="small"
                disabled={currentQuestionIndex <= 0}
                onClick={() =>
                  setCurrentQuestionIndex((i) => Math.max(0, i - 1))
                }
                sx={{ border: (t) => `1px solid ${alpha(t.palette.divider, 0.6)}`, borderRadius: 1, p: 0.5 }}
              >
                <NavigateBeforeRoundedIcon fontSize="small" />
              </IconButton>

              <DotStepper>
                {sortedQuestions.map((q, i) => (
                  <StepPill
                    key={q.id}
                    completed={false}
                    active={i === currentQuestionIndex}
                    onClick={() => setCurrentQuestionIndex(i)}
                  >
                    {i + 1}
                  </StepPill>
                ))}
              </DotStepper>

              <IconButton
                size="small"
                disabled={currentQuestionIndex >= questionCount - 1}
                onClick={() =>
                  setCurrentQuestionIndex((i) =>
                    Math.min(questionCount - 1, i + 1)
                  )
                }
                sx={{ border: (t) => `1px solid ${alpha(t.palette.divider, 0.6)}`, borderRadius: 1, p: 0.5 }}
              >
                <NavigateNextRoundedIcon fontSize="small" />
              </IconButton>

              <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
                {currentQuestionIndex + 1}/{questionCount}
              </Typography>
            </Stack>

            {/* Comment — compact single line */}
            <Typography variant="caption" color="text.secondary">
              Comment: {overallComment || 'Auto-graded upon submission'}
            </Typography>
          </Stack>
        </FooterBar>
      </ViewShell>

      {/* ── PDF preview dialog ── */}
      <Dialog
        open={Boolean(pdfPreview)}
        onClose={() => setPdfPreview(null)}
        fullScreen
      >
        <DialogTitle sx={{ pr: 6 }}>
          {pdfPreview?.title || 'PDF Document'}
          <IconButton
            onClick={() => setPdfPreview(null)}
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
            overflow: 'hidden',
          }}
        >
          {pdfPreview?.url && (
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <PDFViewer fileUrl={pdfPreview.url} initialPage={1} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </MathJaxContext>
  );
};

export default GradedHomeworkComponent;
