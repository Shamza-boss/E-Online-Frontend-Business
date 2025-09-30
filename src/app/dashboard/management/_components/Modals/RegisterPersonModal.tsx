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
import UserRegistrationForm from '../Forms/userRegistrationForm';

interface RegisterPersonModalProps {
  open: boolean;
  handleClose: () => void;
}

const RegisterPersonModal: NextPage<RegisterPersonModalProps> = ({
  open,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Register new person
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
        <UserRegistrationForm />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterPersonModal;
