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

interface CreateAcademicsModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateAcademicsModal: NextPage<CreateAcademicsModalProps> = ({
  open,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Create subject
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={() => ({
          position: 'absolute',
          right: 8,
          top: 8,
        })}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <CreateAcademicsForm />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAcademicsModal;
