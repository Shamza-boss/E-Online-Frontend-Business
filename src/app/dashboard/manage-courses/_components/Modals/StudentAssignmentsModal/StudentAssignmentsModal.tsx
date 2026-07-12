'use client';

import React, { useMemo } from 'react';
import {
    AppBar,
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
import type { HomeworkAssignmentDto } from '@/app/_lib/interfaces/types';
import { getStudentAssignments } from '@/app/_lib/actions/homework';
import { getStatusChipConfig } from '@/app/_lib/common/functions';
import type { StudentAssignmentsModalProps } from './types';
import { LoadingContainer } from './elements';
import { filterAssignmentsByClass, formatStudentTitle, formatScore } from './utils';

const StudentAssignmentsModal: React.FC<StudentAssignmentsModalProps> = ({
    open,
    onClose,
    student,
    classId,
}) => {
    const studentId = student?.userId;

    const { data, isLoading } = useSWR<HomeworkAssignmentDto[]>(
        open && studentId ? ['student-assignments', studentId] : null,
        () => getStudentAssignments(studentId!),
    );

    const filteredAssignments = useMemo(
        () => filterAssignmentsByClass(data, classId),
        [data, classId],
    );

    const title = formatStudentTitle(student);

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
                    <LoadingContainer>
                        <CircularProgress size={32} />
                    </LoadingContainer>
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
                                    assignment.dueDate,
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
                                            {formatScore(assignment)}
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
