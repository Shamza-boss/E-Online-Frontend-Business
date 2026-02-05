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
import { ClassroomDetailsDto, UserDto, AcademicLevelDto, SubjectDto } from '@/app/_lib/interfaces/types';
import EditClassroomForm from '../Forms/editClassroomForm';

interface EditClassroomModalProps {
  open: boolean;
  classroom: ClassroomDetailsDto | null;
  isAdmin: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teachers: UserDto[];
  academicLevels: AcademicLevelDto[];
  subjects: SubjectDto[];
}

export default function EditClassroomModal({
  open,
  classroom,
  isAdmin,
  onClose,
  onSuccess,
  teachers,
  academicLevels,
  subjects,
}: EditClassroomModalProps) {

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
      <DialogContent dividers>
        <EditClassroomForm 
          classroom={classroom} 
          isAdmin={isAdmin} 
          handleClose={onClose} 
          onSuccess={onSuccess}
          teachers={teachers}
          academicLevels={academicLevels}
          subjects={subjects}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
