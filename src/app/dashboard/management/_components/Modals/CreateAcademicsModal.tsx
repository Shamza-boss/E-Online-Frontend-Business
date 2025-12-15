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
import CreateAcademicsForm from '../Forms/createAcademicsForm';
import { AcademicLevelDto } from '@/app/_lib/interfaces/types';
import { ProcessingButton } from '../Forms/ProcessingButton';

interface CreateAcademicsModalProps {
  open: boolean;
  handleClose: () => void;
  onCreated?: (level: AcademicLevelDto) => void;
}

const CreateAcademicsModal: NextPage<CreateAcademicsModalProps> = ({
  open,
  handleClose,
  onCreated,
}) => {
  const formId = 'create-academic-modal-form';
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
    (level: AcademicLevelDto) => {
      setSuccess(true);
      onCreated?.(level);
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
        Create academic level
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
        <CreateAcademicsForm
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
          Save level
        </ProcessingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAcademicsModal;
