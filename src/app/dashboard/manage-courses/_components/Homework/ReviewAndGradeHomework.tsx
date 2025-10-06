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
  Divider,
  Stack,
  Pagination,
} from '@mui/material';
import PaginationItem from '@mui/material/PaginationItem';
import { RichTextAnswer } from '../../../../_lib/components/homework/RichTextAnswer';
import { VideoPlayer } from '../../../../_lib/components/video/VideoPlayer';
import {
  SubmittedHomework,
  Question,
  GradedHomework,
} from '../../../../_lib/interfaces/types';
import dynamic from 'next/dynamic'; // ✅ At top of file
import { MathJaxContext } from 'better-react-mathjax';

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

// Helper to determine the border color based on the awarded grade compared to the maximum weight.
const getGradeBorder = (award: number, max: number): string => {
  if (award === 0) return 'red';
  if (award < max) return 'orange';
  if (award >= max) return 'green';
  return 'transparent';
};

const MathJax = dynamic(
  () => import('better-react-mathjax').then((mod) => mod.MathJax),
  { ssr: false }
);

interface ReviewAndGradeHomeworkProps {
  submittedHomework: SubmittedHomework;
  onSubmitGrading: (gradedHomework: GradedHomework) => void;
}

const ReviewAndGradeHomework: React.FC<ReviewAndGradeHomeworkProps> = ({
  submittedHomework,
  onSubmitGrading,
}) => {
  const { homework, answers } = submittedHomework;

  // For storing numeric grade and optional comment for each leaf question.
  // Keyed by question.id => { grade, comment }
  const [gradingData, setGradingData] = useState<{
    [id: string]: { grade: number; comment: string };
  }>({});

  // Optional overall comment.
  const [overallComment, setOverallComment] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questionCount = homework.questions.length;
  const currentQuestion = homework.questions[currentQuestionIndex];

  // Helper: update grading for a question’s ID.
  const updateGrading = (
    questionId: string,
    newData: Partial<{ grade: number; comment: string }>
  ) => {
    setGradingData((prev) => {
      const current = prev[questionId] || { grade: 0, comment: '' };
      let nextGrade =
        newData.grade !== undefined ? newData.grade : current.grade;

      // Optionally clamp the grade to the question’s max weight:
      const findWeight = (qs: Question[], id: string): number | null => {
        for (const q of qs) {
          if (q.id === id) return q.weight;
          if (q.subquestions?.length) {
            const sub = findWeight(q.subquestions, id);
            if (sub !== null) return sub;
          }
        }
        return null;
      };
      const maxWeight = findWeight(homework.questions, questionId) || Infinity;
      if (nextGrade > maxWeight) nextGrade = maxWeight;

      return {
        ...prev,
        [questionId]: {
          grade: nextGrade,
          comment:
            newData.comment !== undefined ? newData.comment : current.comment,
        },
      };
    });
  };

  // Recursively render questions in the same style as your review modal,
  // but add a grading box whenever we’re at a leaf (no subquestions).
  const renderQuestion = (
    question: Question,
    numbering: string,
    depth: number = 1
  ) => {
    // For indentation: e.g. 0 for top-level, small increments for subquestions.
    const indent = depth > 1 ? (depth - 1) * 2 : 0;
    // Use "h6" for top-level questions and "body2" for subquestions.
    const textVariant = depth === 1 ? 'h6' : 'body2';

    if (question.subquestions?.length) {
      // Sum subquestions' weights for display.
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

    // Leaf question: show question text, answer, and grading UI.
    return (
      <MathJaxContext version={3} config={mathJaxConfig}>
        <Box key={question.id} sx={{ my: 2, ml: indent }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant={textVariant}>
              {numbering}. {question.questionText}
            </Typography>
            {question.type === 'video' && question.video && (
              <Box sx={{ ml: 2 }}>
                <VideoPlayer
                  video={question.video}
                  title={question.questionText}
                />
              </Box>
            )}
            <Typography variant="caption" color="text.secondary">
              (Weight: {question.weight})
            </Typography>
          </Box>

          {/* Render the student's answer */}
          <Box sx={{ mb: 1 }}>
            {(() => {
              const answer = answers[question.id];
              switch (question.type) {
                case 'video':
                  // For video questions, the answer would be from subquestions
                  // so we don't render anything here as subquestions handle their own answers
                  return null;
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
                default:
                  return null;
              }
            })()}
          </Box>

          {/* Grading UI for this leaf question with a colored border */}
          <Box
            sx={{
              border: 2,
              borderColor: getGradeBorder(
                gradingData[question.id]?.grade || 0,
                question.weight
              ),
              borderRadius: 2,
              p: 2,
              mt: 1,
            }}
          >
            <TextField
              label={`Grade for ${numbering}`}
              type="number"
              fullWidth
              inputProps={{ min: 0, max: question.weight }}
              value={gradingData[question.id]?.grade || ''}
              onChange={(e) =>
                updateGrading(question.id, {
                  grade: Number(e.target.value),
                })
              }
              sx={{ mb: 1 }}
            />
            <TextField
              label={`Comment for ${numbering}`}
              multiline
              fullWidth
              value={gradingData[question.id]?.comment || ''}
              onChange={(e) =>
                updateGrading(question.id, {
                  comment: e.target.value,
                })
              }
            />
          </Box>
        </Box>
      </MathJaxContext>
    );
  };

  // Helper: compute total possible and awarded points.
  const computeOverallTotals = (
    questions: Question[]
  ): {
    totalEstimated: number;
    totalAwarded: number;
  } => {
    let totalEstimated = 0;
    let totalAwarded = 0;

    const traverse = (qs: Question[]) => {
      qs.forEach((q) => {
        if (q.subquestions?.length) {
          traverse(q.subquestions);
        } else {
          totalEstimated += q.weight;
          totalAwarded += gradingData[q.id]?.grade || 0;
        }
      });
    };

    traverse(questions);
    return { totalEstimated, totalAwarded };
  };

  const { totalEstimated, totalAwarded } = computeOverallTotals(
    homework.questions
  );
  const overallPercentage =
    totalEstimated > 0 ? Math.round((totalAwarded / totalEstimated) * 100) : 0;

  // Final submission: package grading data and submit.
  const handleSubmitGrading = () => {
    const gradedHomework: GradedHomework = {
      homework,
      answers,
      grading: gradingData,
      overallComment,
    };
    onSubmitGrading(gradedHomework);
  };

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6">
            {homework.title}
          </Typography>
          <Typography variant="h6" sx={{ mr: 2 }}>
            {totalAwarded} / {totalEstimated} ({overallPercentage}%)
          </Typography>
          <Button color="inherit" onClick={handleSubmitGrading}>
            Submit Grading
          </Button>
        </Toolbar>
      </AppBar>
      <Paper sx={{ p: 2, m: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {homework.description}
        </Typography>
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
            No questions to review.
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <TextField
          label="Overall Comment for Assessment"
          fullWidth
          multiline
          value={overallComment}
          onChange={(e) => setOverallComment(e.target.value)}
        />
      </Paper>
    </MathJaxContext>
  );
};

export default ReviewAndGradeHomework;
