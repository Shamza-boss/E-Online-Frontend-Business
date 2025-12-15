'use client';

import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Box,
  Divider,
  Stack,
  Pagination,
} from '@mui/material';
import PaginationItem from '@mui/material/PaginationItem';
import { GradedHomework, Question } from '../../interfaces/types';
import { format } from 'date-fns';
import {
  computeQuestionTotals,
  calculateHomeworkTotals,
} from '../../utils/gradeCalculator';
import { MathJaxContext } from 'better-react-mathjax';
import QuestionTreeRenderer from '../question/QuestionTreeRenderer';

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

const getGradeBorder = (award: number, weight: number): string => {
  if (award === 0) return 'red';
  if (award < weight) return 'orange';
  if (award >= weight) return 'green';
  return 'transparent';
};

interface GradedHomeworkProps {
  gradedHomework: GradedHomework;
}

const GradedHomeworkComponent: React.FC<GradedHomeworkProps> = ({
  gradedHomework,
}) => {
  const { homework, answers, grading, overallComment } = gradedHomework;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questionCount = homework.questions.length;
  const currentQuestion = homework.questions[currentQuestionIndex];

  const overallTotals = useMemo(
    () => calculateHomeworkTotals(homework.questions, grading),
    [homework.questions, grading]
  );

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
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6">
            Was due on{' '}
            {format(new Date(Date.parse(homework.dueDate)), 'MM/ dd / yyyy')} –
            Graded Submission
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper sx={{ p: 2, m: 2 }}>
        {questionCount > 0 ? (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle1">
                Viewing Question {currentQuestionIndex + 1} of {questionCount}
              </Typography>
              <Pagination
                count={questionCount}
                page={currentQuestionIndex + 1}
                onChange={(_, page) => setCurrentQuestionIndex(page - 1)}
                renderItem={(item) => (
                  <PaginationItem {...item} page={`Question ${item.page}`} />
                )}
              />
            </Stack>
            {currentQuestion && (
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
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No questions to display.
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Overall Total: {overallTotals.awarded} / {overallTotals.estimated} (
            {overallTotals.estimated > 0
              ? Math.round(
                  (overallTotals.awarded / overallTotals.estimated) * 100
                )
              : 0}
            %)
          </Typography>
        </Box>
        {overallComment && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="h6">Overall Comment</Typography>
            <Typography variant="body2">{overallComment}</Typography>
          </Box>
        )}
      </Paper>
    </MathJaxContext>
  );
};

export default GradedHomeworkComponent;
