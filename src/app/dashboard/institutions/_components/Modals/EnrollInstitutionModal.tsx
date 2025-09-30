import React from 'react';
import { NextPage } from 'next';
import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton, DialogContent } from '@mui/material';
import EnrollInstitutionForm from '../Forms/EnrollInstitutionForm';

interface EnrollInstitutionProps {
  open: boolean;
  handleClose: () => void;
}

const EnrollInstitutionModal: NextPage<EnrollInstitutionProps> = ({
  open,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'lg'}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Enroll a new Institution
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
        <EnrollInstitutionForm onSuccess={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default EnrollInstitutionModal;
