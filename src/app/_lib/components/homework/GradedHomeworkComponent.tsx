'use client';

import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Box,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
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
import { VideoPlayer } from '../video/VideoPlayer';

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

  const renderQuestion = (
    question: Question,
    numbering: string,
    depth: number = 1
  ) => {
    const indent = depth > 1 ? (depth - 1) * 5 : 0;
    const textVariant = 'h6';

    if (question.subquestions && question.subquestions.length > 0) {
      const sectionTotals = computeQuestionTotals(question, grading);
      const sectionGrade = grading[question.id]?.grade || 0;

      return (
        <Box key={question.id} sx={{ ml: indent, my: 2 }}>
          <Typography variant={textVariant}>
            {numbering}. {question.questionText} (Est: {question.weight})
          </Typography>
          {question.type === 'video' && (
            <Box sx={{ mt: 2 }}>
              {question.video ? (
                <VideoPlayer video={question.video} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Video unavailable
                </Typography>
              )}
            </Box>
          )}
          {grading[question.id]?.comment && (
            <Box sx={{ mt: 1, ml: 16 }}>
              <Typography
                variant="body2"
                sx={{
                  color:
                    sectionGrade < question.weight
                      ? getGradeBorder(sectionGrade, question.weight)
                      : 'inherit',
                }}
              >
                Section Comment: {grading[question.id].comment}
              </Typography>
            </Box>
          )}
          {question.subquestions.map((sub, idx) =>
            renderQuestion(sub, `${numbering}.${idx + 1}`, depth + 1)
          )}
          <Box sx={{ mt: 1, ml: 6 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color:
                  sectionTotals.awarded < sectionTotals.estimated
                    ? getGradeBorder(
                        sectionTotals.awarded,
                        sectionTotals.estimated
                      )
                    : 'inherit',
              }}
            >
              Section Total: {sectionTotals.awarded} / {sectionTotals.estimated}
            </Typography>
          </Box>
        </Box>
      );
    }

    const awarded = grading[question.id]?.grade || 0;

    return (
      <Box key={question.id} sx={{ ml: indent, my: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant={textVariant}>
            {numbering}. {question.questionText}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (Weight: {question.weight})
          </Typography>
        </Box>
        <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 3 }}>
            {(() => {
              const answer = answers[question.id];
              switch (question.type) {
                case 'radio':
                  return (
                    <RadioGroup value={answer || ''} row>
                      {question.options?.map((option, idx) => (
                        <FormControlLabel
                          key={idx}
                          value={option}
                          control={<Radio disabled />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  );
                case 'multi-select':
                  return (
                    <Box>
                      {question.options?.map((option, idx) => (
                        <FormControlLabel
                          key={idx}
                          control={
                            <Checkbox
                              disabled
                              checked={
                                Array.isArray(answer)
                                  ? answer.includes(option)
                                  : false
                              }
                            />
                          }
                          label={option}
                        />
                      ))}
                    </Box>
                  );
                case 'video':
                  return question.video ? (
                    <VideoPlayer video={question.video} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Video unavailable
                    </Typography>
                  );
                default:
                  return (
                    <Typography variant="body2" color="text.secondary">
                      Unsupported question type
                    </Typography>
                  );
              }
            })()}
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 1,
              border: 2,
              borderColor: getGradeBorder(awarded, question.weight),
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {awarded} / {question.weight}
            </Typography>
            {grading[question.id]?.comment && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  textAlign: 'center',
                  color:
                    awarded < question.weight
                      ? getGradeBorder(awarded, question.weight)
                      : 'inherit',
                }}
              >
                {grading[question.id].comment}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

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
            {currentQuestion &&
              renderQuestion(
                currentQuestion,
                (currentQuestionIndex + 1).toString()
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
