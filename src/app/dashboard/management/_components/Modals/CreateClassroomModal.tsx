import React from 'react';
import { NextPage } from 'next';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { UserDto } from '@/app/_lib/interfaces/types';
import ClassroomCreationForm from '../Forms/classroomCreationForm';

interface CreateClassroomModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateClassroomModal: NextPage<CreateClassroomModalProps> = ({
  open,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Create course
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
        })}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <ClassroomCreationForm />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateClassroomModal;
