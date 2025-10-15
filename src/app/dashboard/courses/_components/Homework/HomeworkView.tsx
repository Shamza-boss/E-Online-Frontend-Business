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

  const computeTotalWeight = (node: Question): number => {
    if (node.subquestions && node.subquestions.length > 0) {
      return node.subquestions.reduce(
        (sum, sub) => sum + computeTotalWeight(sub),
        0
      );
    }

    return Number.isFinite(node.weight) ? node.weight : 0;
  };

  const renderQuestion = (
    node: Question,
    numbering: string,
    depth: number = 1
  ): React.ReactNode => {
    const indent = depth > 1 ? (depth - 1) * 2 : 0;
    const textVariant = depth === 1 ? 'h6' : 'subtitle1';

    if (node.subquestions && node.subquestions.length > 0) {
      const sectionWeight = computeTotalWeight(node);
      return (
        <Box key={node.id} sx={{ my: 2, ml: indent }}>
          <Typography variant={textVariant} sx={{ fontWeight: 600 }}>
            {numbering}. {node.questionText || 'Untitled section'}
            {sectionWeight > 0 ? ` (Total Weight: ${sectionWeight})` : ''}
          </Typography>
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
          {node.subquestions.map((sub, idx) =>
            renderQuestion(sub, `${numbering}.${idx + 1}`, depth + 1)
          )}
        </Box>
      );
    }

    const options = node.options ?? [];

    return (
      <Box key={node.id} sx={{ my: 2, ml: indent }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant={textVariant}>
            {numbering}. {node.questionText || 'Untitled question'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (Weight: {Number.isFinite(node.weight) ? node.weight : 0})
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          {(() => {
            if (node.type === 'radio') {
              return (
                <RadioGroup
                  value={answers[node.id] || ''}
                  onChange={(e) => handleChange(node.id, e.target.value)}
                  row
                >
                  {options.length > 0 ? (
                    options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
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
                      key={idx}
                      control={
                        <Checkbox
                          disabled={readOnly}
                          checked={
                            Array.isArray(answers[node.id])
                              ? (answers[node.id] as string[]).includes(option)
                              : false
                          }
                          onChange={(e) => {
                            if (readOnly) return;
                            const previousAnswers = Array.isArray(
                              answers[node.id]
                            )
                              ? (answers[node.id] as string[])
                              : [];
                            const updatedAnswers = e.target.checked
                              ? [...previousAnswers, option]
                              : previousAnswers.filter(
                                  (item: string) => item !== option
                                );
                            handleChange(node.id, updatedAnswers);
                          }}
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

            return (
              <Typography variant="body2" color="text.secondary">
                Unsupported question type
              </Typography>
            );
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
