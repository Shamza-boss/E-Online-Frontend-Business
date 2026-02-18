'use client';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import useAuthActions from '../../_lib/hooks/useAuthActions';
import { IconButton, Tooltip } from '@mui/material';

export default function OptionsMenu() {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const { handleSignOut } = useAuthActions();
  const handleLogOutClick = () => {
    setConfirmOpen(true);
  };

  const handleCancelLogout = () => {
    setConfirmOpen(false);
  };

  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    handleSignOut();
  };

  return (
    <React.Fragment>
      <Tooltip title="Click to logout">
        <IconButton color="warning" onClick={handleLogOutClick}>
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
      </Tooltip> 
      <Dialog
        open={confirmOpen}
        onClose={handleCancelLogout}
        aria-labelledby="logout-confirmation-title"
        aria-describedby="logout-confirmation-description"
      >
        <DialogTitle id="logout-confirmation-title">Confirm logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-confirmation-description">
            You are about to log out. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmLogout}>
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
