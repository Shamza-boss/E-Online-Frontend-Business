'use client';

import React, { useMemo } from 'react';
import {
  AppBar,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useSWR from 'swr';
import { format } from 'date-fns';
import {
  HomeworkAssignmentDto,
  UserDto,
} from '../../../../_lib/interfaces/types';
import { getStudentAssignments } from '../../../../_lib/actions/homework';
import { getStatusChipConfig } from '@/app/_lib/common/functions';

interface StudentAssignmentsModalProps {
  open: boolean;
  onClose: () => void;
  student: UserDto | null;
  classId: string;
}

const StudentAssignmentsModal: React.FC<StudentAssignmentsModalProps> = ({
  open,
  onClose,
  student,
  classId,
}) => {
  const studentId = student?.userId;

  const { data, isLoading } = useSWR<HomeworkAssignmentDto[]>(
    open && studentId ? ['student-assignments', studentId] : null,
    () => getStudentAssignments(studentId!)
  );

  const filteredAssignments = useMemo(() => {
    if (!data) return [] as HomeworkAssignmentDto[];
    return data.filter((assignment) => assignment.classroomId === classId);
  }, [data, classId]);

  const title = student
    ? `${student.firstName} ${student.lastName}`.trim()
    : 'Student';

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <AppBar position="relative" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            Assignments for {title}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ pt: 0 }}>
        {!studentId ? (
          <Typography variant="body2" color="text.secondary">
            Select a trainee to view their assignments.
          </Typography>
        ) : isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : filteredAssignments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No assignments assigned to this trainee yet.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Module</TableCell>
                <TableCell>Due date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssignments.map((assignment) => {
                const { label, color } = getStatusChipConfig(
                  assignment.isGraded,
                  assignment.isSubmitted,
                  assignment.dueDate
                );

                return (
                  <TableRow key={assignment.assignmentId} hover>
                    <TableCell>{assignment.homeworkTitle}</TableCell>
                    <TableCell>
                      {assignment.dueDate
                        ? format(new Date(assignment.dueDate), 'MMM d, yyyy')
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={label} color={color} />
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const score =
                          assignment.studentScore ??
                          assignment.totalScore ??
                          assignment.gradeSummary?.awarded ??
                          null;

                        if (score === null || score === undefined) return '—';

                        const numericScore = Number(score);
                        return Number.isFinite(numericScore)
                          ? numericScore.toFixed(1)
                          : '—';
                      })()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentAssignmentsModal;
