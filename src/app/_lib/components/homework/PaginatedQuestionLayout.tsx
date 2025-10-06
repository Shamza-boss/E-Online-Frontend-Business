import React from 'react';
import {
  Box,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
} from '@mui/material';
import { Question } from '../../interfaces/types';

interface PaginatedQuestionLayoutProps {
  questions: Question[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  renderQuestion: (
    question: Question,
    numbering: string,
    index: number
  ) => React.ReactNode;
  paginationLabel?: string;
  summaryLabel?: (currentIndex: number, total: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  topSpacing?: number;
}

const PaginatedQuestionLayout: React.FC<PaginatedQuestionLayoutProps> = ({
  questions,
  currentIndex,
  onIndexChange,
  renderQuestion,
  paginationLabel = 'Question',
  summaryLabel,
  emptyState,
  topSpacing = 2,
}) => {
  const total = questions.length;

  if (total === 0) {
    return (
      <Box sx={{ mt: topSpacing }}>
        {emptyState || (
          <Typography variant="body2" color="text.secondary">
            No questions to display.
          </Typography>
        )}
      </Box>
    );
  }

  const safeIndex = Math.min(Math.max(currentIndex, 0), total - 1);
  const numbering = (safeIndex + 1).toString();

  const summaryContent = summaryLabel ? (
    summaryLabel(safeIndex, total)
  ) : (
    <Typography variant="subtitle1">
      Viewing {paginationLabel} {safeIndex + 1} of {total}
    </Typography>
  );

  return (
    <Box sx={{ mt: topSpacing }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        {summaryContent}
        <Pagination
          count={total}
          page={safeIndex + 1}
          onChange={(_, page) => onIndexChange(page - 1)}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              page={`${paginationLabel} ${item.page}`}
            />
          )}
        />
      </Stack>
      {renderQuestion(questions[safeIndex], numbering, safeIndex)}
    </Box>
  );
};

export default PaginatedQuestionLayout;
