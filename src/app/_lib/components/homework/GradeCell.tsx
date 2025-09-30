import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { HomeworkAssignmentDto } from '../../interfaces/types';
import { calculateGradeDisplay } from '../../utils/gradeCalculator';

interface GradeCellProps {
  assignment: HomeworkAssignmentDto;
}

/**
 * Reusable component for displaying homework assignment grade in "Grade/Total Weight" format
 */
export const GradeCell: React.FC<GradeCellProps> = ({ assignment }) => {
  const [gradeData, setGradeData] = useState<{
    awarded: number;
    totalWeight: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (assignment.isGraded) {
      setIsLoading(true);
      calculateGradeDisplay(assignment)
        .then(setGradeData)
        .finally(() => setIsLoading(false));
    }
  }, [assignment]);

  if (!assignment.isGraded) return <>N/A</>;
  if (isLoading) return <>Loading...</>;
  if (!gradeData) return <>Error</>;

  return (
    <Typography variant="body2" component="span">
      {gradeData.awarded.toFixed(2)}/{gradeData.totalWeight.toFixed(2)}
    </Typography>
  );
};
