'use client';

import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { type ClassDto } from '@/app/_lib/interfaces/types';
import ClassroomCreationForm from '../ClassroomCreationForm';

type EditClassroomModalProps = {
  open: boolean;
  classroom: ClassDto | null;
  isAdmin: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditClassroomModal({
  open,
  classroom,
  isAdmin,
  onClose,
  onSuccess,
}: EditClassroomModalProps) {

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Edit Course Details
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
      <ClassroomCreationForm
          formId={classroom?.id ? `edit-classroom-form-${classroom.id}` : 'edit-classroom-form'}
          mode="edit"
          initialClassroom={classroom}
          isAdmin={isAdmin}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
    </Dialog>
  );
}
