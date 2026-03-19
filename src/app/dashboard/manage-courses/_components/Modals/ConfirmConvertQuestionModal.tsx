'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Question } from '../../../../_lib/interfaces/types';
import QuestionTextDisplay from '@/app/_lib/components/TipTapEditor/QuestionTextDisplay';

interface ConfirmConvertQuestionModalProps {
  open: boolean;
  question: Question | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmConvertQuestionModal: React.FC<ConfirmConvertQuestionModalProps> = ({
  open,
  question,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!question) return null;

  const typeLabel = question.type === 'single-select' ? 'Single Choice' : 'Multiple Choice';

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Convert to Set of Questions?</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="info">
            Converting this question will restructure how it works.
          </Alert>
          
          <Typography variant="body2" color="text.secondary">
            Converting this {typeLabel} question to a set of sub-questions will:
          </Typography>

          <Box component="ul" sx={{ pl: 2, my: 1 }}>
            <li>
              <Typography variant="body2">
                Move your current options down to a sub-section (e.g., 1.1)
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Keep the question text at level 1 (the parent question)
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Allow you to add multiple sub-questions under this parent
              </Typography>
            </li>
          </Box>

          <Typography variant="caption" color="text.secondary">
            <strong>Note:</strong> This change cannot be easily reverted. Please ensure you want to proceed
            before confirming.
          </Typography>

          {question.questionText && (
            <Box sx={{ mt: 1, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Current question text:
              </Typography>
              <QuestionTextDisplay content={question.questionText}/>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          Convert to Sub-questions
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmConvertQuestionModal;
