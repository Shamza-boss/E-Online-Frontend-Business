'use client';

import { Button } from '@mui/material';
import { ToolbarActionsBox } from '../elements';

type FormBuilderToolbarProps = {
  isEditing: boolean;
  onReset: () => void;
  onSaveDraft: () => void;
  onReviewBeforePublish: () => void;
}

export default function FormBuilderToolbar({
  isEditing,
  onReset,
  onSaveDraft,
  onReviewBeforePublish,
}: FormBuilderToolbarProps) {
  return (
    <ToolbarActionsBox>
      <Button color="warning" variant="contained" onClick={onReset}>
        Reset {isEditing ? 'form' : 'draft'}
      </Button>
      <Button color="primary" variant="contained" onClick={onSaveDraft}>
        Save draft
      </Button>
      <Button color="success" variant="contained" onClick={onReviewBeforePublish}>
        Publish module
      </Button>
    </ToolbarActionsBox>
  );
}
