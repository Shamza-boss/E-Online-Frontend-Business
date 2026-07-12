'use client';

import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Button,
  DialogActions,
} from '@mui/material';
import { type UserDto } from '@/app/_lib/interfaces/types';
import EditUserForm from '../Forms/editUserForm';

type EditUserModalProps = {
  open: boolean;
  user: UserDto | null;
  isAdmin: boolean;
  onClose: () => void;
  onSuccess: () => void;
}



export default function EditUserModal({
  open,
  user,
  isAdmin,
  onClose,
  onSuccess,
}: EditUserModalProps) {

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Edit User Details
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <EditUserForm user={user} isAdmin={isAdmin} handleClose={onClose} onSuccess={onSuccess} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
