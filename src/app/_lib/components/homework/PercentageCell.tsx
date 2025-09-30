import React, { useState, useEffect } from 'react';
import { Chip } from '@mui/material';
import { HomeworkAssignmentDto } from '../../interfaces/types';
import {
  calculatePercentageFromAssignment,
  getPercentageColor,
} from '../../utils/gradeCalculator';

interface PercentageCellProps {
  assignment: HomeworkAssignmentDto;
}

/**
 * Reusable component for displaying homework assignment percentage in a table cell
 */
export const PercentageCell: React.FC<PercentageCellProps> = ({
  assignment,
}) => {
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    if (assignment.isGraded) {
      calculatePercentageFromAssignment(assignment).then(setPercentage);
    }
  }, [assignment]);

  if (!assignment.isGraded) return <>N/A</>;
  if (percentage === null) return <>Loading...</>;

  return (
    <Chip
      size="small"
      label={`${percentage.toFixed(1)}%`}
      color={getPercentageColor(percentage)}
      variant="filled"
    />
  );
};
