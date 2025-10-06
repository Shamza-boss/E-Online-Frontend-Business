'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  Pagination,
} from '@mui/material';
import PaginationItem from '@mui/material/PaginationItem';
import {
  Homework,
  SubmittedHomework,
  Question,
} from '../../../../_lib/interfaces/types';
import { format } from 'date-fns';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';

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

  const questionCount = homework.questions.length;
  const currentQuestion = homework.questions[currentQuestionIndex];

  const handleChange = (questionId: string, value: any) => {
    if (!readOnly) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readOnly) {
      const submitted: SubmittedHomework = { homework, answers };
      onSubmit(submitted);
    }
  };

  const renderQuestion = (
    question: Question,
    numbering: string,
    depth: number = 1
  ) => {
    const indent = depth > 1 ? (depth - 1) * 2 : 0;
    const textVariant = 'h6';

    if (question.subquestions && question.subquestions.length > 0) {
      const totalWeight = question.subquestions.reduce(
        (sum, sub) => sum + sub.weight,
        0
      );
      return (
        <Box key={question.id} sx={{ my: 2, ml: indent }}>
          <Typography variant={textVariant}>
            {numbering}. {question.questionText} (Total Weight: {totalWeight})
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
          {question.subquestions.map((sub, idx) =>
            renderQuestion(sub, `${numbering}.${idx + 1}`, depth + 1)
          )}
        </Box>
      );
    }

    return (
      <Box key={question.id} sx={{ my: 2, ml: indent }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant={textVariant}>
            {numbering}. {question.questionText}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (Weight: {question.weight})
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          {(() => {
            switch (question.type) {
              case 'radio':
                return (
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    row
                  >
                    {question.options?.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={option}
                        control={<Radio disabled={readOnly} />}
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
                            disabled={readOnly}
                            checked={
                              Array.isArray(answers[question.id])
                                ? (answers[question.id] as string[]).includes(
                                    option
                                  )
                                : false
                            }
                            onChange={(e) => {
                              if (readOnly) return;
                              const previousAnswers = Array.isArray(
                                answers[question.id]
                              )
                                ? (answers[question.id] as string[])
                                : [];
                              const updatedAnswers = e.target.checked
                                ? [...previousAnswers, option]
                                : previousAnswers.filter(
                                    (item: string) => item !== option
                                  );
                              handleChange(question.id, updatedAnswers);
                            }}
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
      </Box>
    );
  };

  return (
    <React.Fragment>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: '1 1 auto' }} variant="h6">
            Due on{' '}
            {format(new Date(Date.parse(homework.dueDate)), 'MM/ dd / yyyy')}
          </Typography>
          {!readOnly && (
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Submit Answers
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Paper sx={{ p: 2, m: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {homework.description}
        </Typography>
        <form onSubmit={handleSubmit}>
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
        </form>
      </Paper>
    </React.Fragment>
  );
};

export default HomeworkView;
