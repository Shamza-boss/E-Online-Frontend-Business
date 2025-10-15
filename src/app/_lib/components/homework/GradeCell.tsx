import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import type { HomeworkAssignmentDto, Homework } from '../../interfaces/types';

interface GradeCellProps {
  assignment: HomeworkAssignmentDto;
}

/**
 * Reusable component for displaying homework assignment grade in "Grade/Total Weight" format
 */
export const GradeCell: React.FC<GradeCellProps> = ({ assignment }) => {
  const derivedGrade = useMemo(() => {
    const awarded = assignment.studentScore ?? null;

    const total = assignment.studentTotalWeight ?? null;

    return {
      awarded,
      total,
    };
  }, [assignment]);

  if (derivedGrade.awarded === null || derivedGrade.total === null)
    return <>Pending</>;

  const awarded = Number(derivedGrade.awarded);
  const total = Number(derivedGrade.total);

  if (!Number.isFinite(awarded) || !Number.isFinite(total) || total === 0) {
    return (
      <Typography variant="body2" component="span">
        Pending
      </Typography>
    );
  }

  return (
    <Typography variant="body2" component="span">
      {awarded}/{total}
    </Typography>
  );
};
