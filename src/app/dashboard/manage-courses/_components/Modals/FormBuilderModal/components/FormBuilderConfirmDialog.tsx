'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export type FormBuilderConfirmType = 'reset' | 'saveDraft' | 'publish' | 'close' | null;

type FormBuilderConfirmDialogProps = {
  open: boolean;
  type: FormBuilderConfirmType;
  onCancel: () => void;
  onConfirmReset: () => void;
  onConfirmSubmit: () => void;
  onConfirmClose: () => void;
}

export default function FormBuilderConfirmDialog({
  open,
  type,
  onCancel,
  onConfirmReset,
  onConfirmSubmit,
  onConfirmClose,
}: FormBuilderConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {type === 'reset' && 'Reset Form?'}
        {type === 'saveDraft' && 'Save Draft?'}
        {type === 'publish' && 'Publish Module?'}
        {type === 'close' && 'Unsaved Changes'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {type === 'reset' &&
            'This will clear all your work and remove the local draft. This action cannot be undone.'}
          {type === 'saveDraft' &&
            'This will save your module as a draft to the database. The module will remain hidden from students until you publish it. Your local browser draft will be cleared after saving.'}
          {type === 'publish' &&
            'This will publish the module immediately, making it visible to all students in the class. Students will be able to view and submit this module. Your local browser draft will be cleared after publishing.'}
          {type === 'close' &&
            'You have unsaved changes that only exist in your current browser session. These changes are NOT saved to the database and will be lost if you clear browser data or use a different device. Click "Save draft" to persist your work to the database before closing.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        {type === 'reset' && (
          <Button onClick={onConfirmReset} color="error" variant="contained">
            Reset
          </Button>
        )}
        {type === 'saveDraft' && (
          <Button onClick={onConfirmSubmit} color="primary" variant="contained">
            Save Draft
          </Button>
        )}
        {type === 'publish' && (
          <Button onClick={onConfirmSubmit} color="success" variant="contained">
            Publish Module
          </Button>
        )}
        {type === 'close' && (
          <Button onClick={onConfirmClose} color="primary" variant="contained">
            Close Anyway
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
