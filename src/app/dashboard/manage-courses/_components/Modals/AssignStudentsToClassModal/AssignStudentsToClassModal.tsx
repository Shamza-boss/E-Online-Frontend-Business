import React, { useState, useCallback } from 'react';
import { Close } from '@mui/icons-material';
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Button,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import StudentManagementTable from '../../Tables/StudentManagementTable';
import type { AssignStudentsToClassModalProps, EnrollmentState } from './types';
import { ToolbarActions, ModalContent } from './elements';

const AssignStudentsToClassModal: React.FC<AssignStudentsToClassModalProps> = ({
    open,
    handleClose,
}) => {
    const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>({
        canEnroll: false,
        selectedCount: 0,
        enroll: () => {},
    });
    const [confirmEnrollOpen, setConfirmEnrollOpen] = useState(false);

    const handleOpenEnrollConfirm = useCallback(() => {
        if (!enrollmentState.canEnroll) return;
        setConfirmEnrollOpen(true);
    }, [enrollmentState.canEnroll]);

    const handleCloseEnrollConfirm = useCallback(() => {
        setConfirmEnrollOpen(false);
    }, []);

    const handleConfirmEnroll = useCallback(async () => {
        await enrollmentState.enroll();
        setConfirmEnrollOpen(false);
    }, [enrollmentState]);

    return (
        <Dialog open={open} onClose={handleClose} fullScreen>
            <AppBar position="relative" color="default" elevation={0}>
                <Toolbar sx={{ gap: 2 }}>
                    <IconButton edge="start" aria-label="close" onClick={handleClose}>
                        <Close />
                    </IconButton>
                    <DialogTitle>Confirm enrollment</DialogTitle>
                    <Box sx={{ flex: 1 }} />
                    <ToolbarActions>
                        <Button variant="outlined" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleOpenEnrollConfirm}
                            disabled={!enrollmentState.canEnroll}
                        >
                            Enroll trainees
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </AppBar>
            <ModalContent>
                <StudentManagementTable onEnrollmentStateChange={setEnrollmentState} />
            </ModalContent>

            <Dialog open={confirmEnrollOpen} onClose={handleCloseEnrollConfirm}>
                <DialogContent>
                    <DialogContentText>
                        {enrollmentState.selectedCount > 0
                            ? `You are about to enroll ${enrollmentState.selectedCount} trainee${
                                  enrollmentState.selectedCount === 1 ? '' : 's'
                              } into the selected class.`
                            : 'Select at least one trainee to continue.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEnrollConfirm} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmEnroll}
                        color="success"
                        variant="contained"
                        disabled={!enrollmentState.canEnroll}
                    >
                        Enroll trainees
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default AssignStudentsToClassModal;
