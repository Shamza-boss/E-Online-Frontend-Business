import React, { useState } from 'react';
import { NextPage } from 'next';
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
import StudentManagementTable from '../Tables/studentManagementTable';

interface AssignStudentsToClassModalProps {
  open: boolean;
  handleClose: () => void;
}
interface EnrollmentState {
  canEnroll: boolean;
  selectedCount: number;
  enroll: () => void;
}
const AssignStudentsToClassModal: NextPage<AssignStudentsToClassModalProps> = ({
  open,
  handleClose,
}) => {
  const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>({
    canEnroll: false,
    selectedCount: 0,
    enroll: () => {},
  });
  const [confirmEnrollOpen, setConfirmEnrollOpen] = useState(false);

  const handleOpenEnrollConfirm = () => {
    if (!enrollmentState.canEnroll) return;
    setConfirmEnrollOpen(true);
  };

  const handleCloseEnrollConfirm = () => {
    setConfirmEnrollOpen(false);
  };

  const handleConfirmEnroll = async () => {
    await enrollmentState.enroll();
    setConfirmEnrollOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <AppBar position="relative" color="default" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <IconButton edge="start" aria-label="close" onClick={handleClose}>
            <Close />
          </IconButton>
          <DialogTitle>Confirm enrollment</DialogTitle>
          <Box sx={{ flex: 1 }}/>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <StudentManagementTable onEnrollmentStateChange={setEnrollmentState} />
      </Box>

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
