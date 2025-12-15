"use client";

import React from 'react';
import { NextPage } from 'next';
import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import ClassroomCreationForm from '../Forms/classroomCreationForm';

interface CreateClassroomModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateClassroomModal: React.FC<CreateClassroomModalProps> = ({
  open,
  handleClose,
}) => {
  const formId = React.useId();
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'lg'}>
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
      <ClassroomCreationForm
        formId={formId}
        onSuccess={handleClose}
        onCancel={handleClose}
      />
    </Dialog>
  );
};

export default CreateClassroomModal;
