'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Slide,
  TextField,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { SubmittedHomework, Question } from '../../../../_lib/interfaces/types';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { MathJaxContext } from 'better-react-mathjax';
import { RichTextAnswer } from '@/app/_lib/components/homework/RichTextAnswer';

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
// ✅ Dynamically import MathJax for client-only rendering
const MathJax = dynamic(
  () => import('better-react-mathjax').then((mod) => mod.MathJax),
  { ssr: false }
);

interface HomeworkReviewProps {
  submittedHomework: SubmittedHomework;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HomeworkReview: React.FC<HomeworkReviewProps> = ({
  submittedHomework,
}) => {
  const { homework, answers } = submittedHomework;

  const renderQuestion = (
    question: Question,
    numbering: string,
    depth: number = 1
  ) => {
    const indent = depth > 1 ? (depth - 1) * 2 : 0;
    const textVariant = depth === 1 ? 'h6' : 'body2';

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
                            checked={answer ? answer.includes(option) : false}
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
                    value={answer || ''}
                    onChange={() => {}}
                    readOnly={true}
                  />
                );

              case 'math-block':
                return (
                  <RichTextAnswer
                    value={answer || ''}
                    onChange={() => {}}
                    readOnly={true}
                  />
                );

              case 'text':
              default:
                return <TextField fullWidth disabled value={answer || ''} />;
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
        </Toolbar>
      </AppBar>
      <Paper sx={{ p: 2, m: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {homework.description}
        </Typography>
        {homework.questions.map((question, idx) =>
          renderQuestion(question, (idx + 1).toString())
        )}
      </Paper>
    </MathJaxContext>
  );
};

export default HomeworkReview;
