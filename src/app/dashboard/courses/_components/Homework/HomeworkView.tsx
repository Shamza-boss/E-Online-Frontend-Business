'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import {
  Homework,
  SubmittedHomework,
  Question,
} from '../../../../_lib/interfaces/types';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { MathJaxContext } from 'better-react-mathjax';
import { RichTextAnswer } from '@/app/_lib/components/homework/RichTextAnswer';

const MathJax = dynamic(
  () => import('better-react-mathjax').then((mod) => mod.MathJax),
  { ssr: false }
);

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
            {numbering}.{' '}
            {question.type !== 'math-block' && question.questionText}
          </Typography>
          {question.type === 'math-block' && (
            <Box sx={{ ml: 2 }}>
              <MathJax dynamic>{question.questionText}</MathJax>
            </Box>
          )}
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
                              answers[question.id]
                                ? answers[question.id].includes(option)
                                : false
                            }
                            onChange={(e) => {
                              let newAnswer = answers[question.id]
                                ? [...answers[question.id]]
                                : [];
                              if (e.target.checked) {
                                newAnswer.push(option);
                              } else {
                                newAnswer = newAnswer.filter(
                                  (item: string) => item !== option
                                );
                              }
                              handleChange(question.id, newAnswer);
                            }}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </Box>
                );
              case 'rich-text':
                return (
                  <RichTextAnswer
                    value={answers[question.id] || ''}
                    onChange={(content) => handleChange(question.id, content)}
                    readOnly={readOnly}
                  />
                );
              case 'math-block':
                return (
                  <RichTextAnswer
                    value={answers[question.id] || ''}
                    onChange={(content) => handleChange(question.id, content)}
                    readOnly={readOnly}
                  />
                );
              case 'text':
              default:
                return (
                  <TextField
                    fullWidth
                    disabled={readOnly}
                    value={answers[question.id] || ''}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  />
                );
            }
          })()}
        </Box>
      </Box>
    );
  };

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
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
          {homework.questions.map((question, idx) =>
            renderQuestion(question, (idx + 1).toString())
          )}
        </form>
      </Paper>
    </MathJaxContext>
  );
};

export default HomeworkView;
