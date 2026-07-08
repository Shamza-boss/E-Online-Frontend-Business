'use client';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { IconButton, Tooltip } from '@mui/material';
import useAuthActions from '../../../_lib/hooks/useAuthActions';
import {
  LOGOUT_TOOLTIP,
  LOGOUT_DIALOG_TITLE,
  LOGOUT_DIALOG_DESCRIPTION,
  LOGOUT_CANCEL_LABEL,
  LOGOUT_CONFIRM_LABEL,
} from './constants';

export default function OptionsMenu() {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const { handleSignOut } = useAuthActions();

  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    handleSignOut();
  };

  return (
    <>
      <Tooltip title={LOGOUT_TOOLTIP}>
        <IconButton color="warning" onClick={() => setConfirmOpen(true)}>
          <LogoutRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="logout-confirmation-title"
        aria-describedby="logout-confirmation-description"
      >
        <DialogTitle id="logout-confirmation-title">{LOGOUT_DIALOG_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-confirmation-description">
            {LOGOUT_DIALOG_DESCRIPTION}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>{LOGOUT_CANCEL_LABEL}</Button>
          <Button color="error" variant="contained" onClick={handleConfirmLogout}>
            {LOGOUT_CONFIRM_LABEL}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
