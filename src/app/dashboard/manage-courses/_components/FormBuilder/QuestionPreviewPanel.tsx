import React from 'react';
import { Typography } from '@mui/material';
import { Question } from '../../../../_lib/interfaces/types';
import QuestionTreeRenderer from '@/app/_lib/components/question/QuestionTreeRenderer';

interface QuestionPreviewPanelProps {
  question?: Question;
  questionIndex: number;
  computeTotalWeight: (question: Question) => number;
}

const QuestionPreviewPanel: React.FC<QuestionPreviewPanelProps> = ({
  question,
  questionIndex,
  computeTotalWeight,
}) => {
  if (!question) {
    return (
      <Typography variant="body2" color="text.secondary">
        Add a question to see how it will appear to students.
      </Typography>
    );
  }
  return (
    <QuestionTreeRenderer
      mode="builder-preview"
      question={question}
      questionIndex={questionIndex}
      computeTotalWeight={computeTotalWeight}
    />
  );
};

export default QuestionPreviewPanel;
