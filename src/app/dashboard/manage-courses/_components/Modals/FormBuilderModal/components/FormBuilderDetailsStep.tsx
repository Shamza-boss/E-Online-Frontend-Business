'use client';

import dayjs from 'dayjs';
import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { BufferedTextField } from '../../../FormBuilder/QuestionEditorPanel';
import { HOMEWORK_DRAFT_IDLE_MS } from '../constants';
import { getTodayDate } from '../utils';
import { StepPaper, DetailsGrid } from '../elements';

export type FormBuilderDetailsStepProps = {
  formTitle: string;
  description: string;
  dueDate: string;
  hasExpiry: boolean;
  expiryDate: string;
  isExam: boolean;
  scheduledAt: string;
  allowReset: boolean;
  canAdvanceToBuilder: boolean;
  onFormTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onHasExpiryChange: (enabled: boolean) => void;
  onExpiryDateChange: (value: string) => void;
  onIsExamChange: (enabled: boolean) => void;
  onScheduledAtChange: (value: string) => void;
  onAllowResetChange: (enabled: boolean) => void;
  onNext: () => void;
}

export default function FormBuilderDetailsStep({
  formTitle,
  description,
  dueDate,
  hasExpiry,
  expiryDate,
  isExam,
  scheduledAt,
  allowReset,
  canAdvanceToBuilder,
  onFormTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onHasExpiryChange,
  onExpiryDateChange,
  onIsExamChange,
  onScheduledAtChange,
  onAllowResetChange,
  onNext,
}: FormBuilderDetailsStepProps) {
  return (
    <StepPaper>
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Module overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Provide the basic information for your module before building questions.
        </Typography>
      </Box>
      <DetailsGrid>
        <BufferedTextField
          label="Title"
          fullWidth
          value={formTitle}
          onCommit={onFormTitleChange}
          debounceMs={HOMEWORK_DRAFT_IDLE_MS}
        />
        <DatePicker
          label="Due Date"
          value={dueDate ? dayjs(dueDate) : null}
          onChange={(newValue) =>
            onDueDateChange(newValue ? newValue.format('YYYY-MM-DD') : '')
          }
          minDate={dayjs(getTodayDate())}
          slotProps={{
            textField: {
              fullWidth: true,
              helperText: 'Cannot select dates in the past',
            },
          }}
        />
      </DetailsGrid>
      <BufferedTextField
        label="Description"
        fullWidth
        multiline
        minRows={3}
        value={description}
        onCommit={onDescriptionChange}
        debounceMs={HOMEWORK_DRAFT_IDLE_MS}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={hasExpiry}
              onChange={(event) => {
                const enabled = event.target.checked;
                onHasExpiryChange(enabled);
                if (!enabled) {
                  onExpiryDateChange('');
                }
              }}
            />
          }
          label="Module expires"
        />
        {!hasExpiry && (
          <Typography variant="body2" color="text.secondary">
            Optional: automatically revert the module to draft on a specific date.
          </Typography>
        )}
      </Stack>
      {hasExpiry && (
        <DatePicker
          label="Expiry Date"
          value={expiryDate ? dayjs(expiryDate) : null}
          onChange={(newValue) =>
            onExpiryDateChange(newValue ? newValue.format('YYYY-MM-DD') : '')
          }
          minDate={dayjs(dueDate || getTodayDate())}
          slotProps={{
            textField: {
              fullWidth: true,
              helperText:
                'When the module expires it will move back to draft. Must be after the due date.',
            },
          }}
        />
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={isExam}
              onChange={(event) => {
                const enabled = event.target.checked;
                onIsExamChange(enabled);
                if (!enabled) {
                  onScheduledAtChange('');
                }
              }}
            />
          }
          label="Exam mode"
        />
        {!isExam && (
          <Typography variant="body2" color="text.secondary">
            Enable to restrict student access to notes and resources during this assessment.
          </Typography>
        )}
      </Stack>
      {isExam && (
        <DateTimePicker
          label="Scheduled exam date & time"
          value={scheduledAt ? dayjs(scheduledAt) : null}
          onChange={(newValue) =>
            onScheduledAtChange(newValue ? newValue.toISOString() : '')
          }
          minDateTime={dayjs()}
          slotProps={{
            textField: {
              fullWidth: true,
              helperText:
                'Students cannot access this exam before this date and time. Leave empty for immediate access.',
            },
          }}
        />
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={allowReset}
              onChange={(event) => onAllowResetChange(event.target.checked)}
            />
          }
          label="Allow reset / re-attempt"
        />
        {!allowReset && (
          <Typography variant="body2" color="text.secondary">
            When enabled, students can reset a submitted assignment and try again.
          </Typography>
        )}
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="flex-end"
        spacing={2}
        mt={{ xs: 1, sm: 3 }}
      >
        {!canAdvanceToBuilder && (
          <Typography variant="body2" color="text.secondary">
            Add a title and due date to continue.
          </Typography>
        )}
        <Button variant="contained" onClick={onNext} disabled={!canAdvanceToBuilder}>
          Next: Questions
        </Button>
      </Stack>
    </StepPaper>
  );
}
