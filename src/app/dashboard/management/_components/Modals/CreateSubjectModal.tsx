"use client";

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
import CreateSubjectsForm from '../Forms/createSubjectsForm';
import { SubjectDto } from '@/app/_lib/interfaces/types';
import { ProcessingButton } from '../Forms/ProcessingButton';

interface CreateSubjectModalProps {
  open: boolean;
  handleClose: () => void;
  onCreated?: (subject: SubjectDto) => void;
}

const CreateSubjectModal: NextPage<CreateSubjectModalProps> = ({
  open,
  handleClose,
  onCreated,
}) => {
  const formId = 'create-subject-modal-form';
  const [pending, setPending] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetState = React.useCallback(() => {
    setPending(false);
    setSuccess(false);
  }, []);

  const closeModal = React.useCallback(() => {
    resetState();
    handleClose();
  }, [handleClose, resetState]);

  const handleSuccess = React.useCallback(
    (subject: SubjectDto) => {
      setSuccess(true);
      onCreated?.(subject);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        closeModal();
      }, 450);
    },
    [closeModal, onCreated]
  );

  React.useEffect(() => {
    if (!open) resetState();
  }, [open, resetState]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth={'sm'}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Create subject
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={closeModal}
        sx={() => ({
          position: 'absolute',
          right: 8,
          top: 8,
        })}
      >
        <Close />
      </IconButton>
      <DialogContent dividers sx={{ p: 0 }}>
        <CreateSubjectsForm
          formId={formId}
          onPendingChange={setPending}
          onSuccess={handleSuccess}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained" color='warning' onClick={closeModal} disabled={pending}>
          Cancel
        </Button>
        <ProcessingButton
          type="submit"
          form={formId}
          variant="contained"
          loading={pending}
          success={success}
          showIcon
        >
          Save subject
        </ProcessingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSubjectModal;
