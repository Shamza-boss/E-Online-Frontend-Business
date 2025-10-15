import React, { useMemo } from 'react';
import { Chip } from '@mui/material';
import type { HomeworkAssignmentDto } from '../../interfaces/types';
import { getPercentageColor } from '../../utils/gradeCalculator';

interface PercentageCellProps {
  assignment: HomeworkAssignmentDto;
}

export const PercentageCell: React.FC<PercentageCellProps> = ({
  assignment,
}) => {
  const percentage = useMemo(() => {
    const supplied = assignment.studentPercentage;

    if (supplied !== null && supplied !== undefined) {
      return Number(supplied);
    }

    return null;
  }, [assignment]);
  if (percentage === null || !Number.isFinite(percentage)) return <>Pending</>;

  return (
    <Chip
      size="small"
      label={`${percentage.toFixed(1)}%`}
      color={getPercentageColor(percentage)}
      variant="filled"
    />
  );
};
