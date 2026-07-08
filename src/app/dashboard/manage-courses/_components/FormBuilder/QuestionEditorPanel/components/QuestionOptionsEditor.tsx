'use client';

import {
  Box,
  Button,
  Checkbox,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import type { Question } from '@/app/_lib/interfaces/types';
import { isChoiceType } from '../../questionUtils';
import { ANTI_ASSIST_ATTRS } from '../constants';
import BufferedTextField from '../BufferedTextField';

export interface QuestionOptionsEditorProps {
  target: Question;
  onFieldChange: (questionId: string, key: keyof Question, value: unknown) => void;
  onAddOption: (questionId: string) => void;
  onOptionChange: (questionId: string, index: number, value: string) => void;
}

export default function QuestionOptionsEditor({
  target,
  onFieldChange,
  onAddOption,
  onOptionChange,
}: QuestionOptionsEditorProps) {
  if (!isChoiceType(target.type) || (target.subquestions?.length ?? 0) > 0) {
    return null;
  }

  const options = target.options ?? [];
  const isRadio = target.type === 'single-select';

  const handleToggle = (option: string, checked: boolean) => {
    if (isRadio) {
      onFieldChange(target.id, 'correctAnswer', option);
      return;
    }

    const current = new Set(target.correctAnswers ?? []);
    if (checked) {
      current.add(option);
    } else {
      current.delete(option);
    }
    onFieldChange(target.id, 'correctAnswers', Array.from(current));
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2">
        Options &amp; correct answer{isRadio ? '' : 's'}
      </Typography>
      {options.map((option, index) => {
        const trimmed = option.trim();
        const isChecked = isRadio
          ? (target.correctAnswer ?? '') === option
          : Array.isArray(target.correctAnswers) && target.correctAnswers.includes(option);

        return (
          <Stack
            key={index}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mt: 1 }}
          >
            {isRadio ? (
              <Radio
                color="primary"
                checked={isChecked}
                disabled={!trimmed}
                onChange={(event) => handleToggle(option, event.target.checked)}
              />
            ) : (
              <Checkbox
                color="primary"
                checked={isChecked}
                disabled={!trimmed}
                onChange={(event) => handleToggle(option, event.target.checked)}
              />
            )}
            <BufferedTextField
              label={`Option ${index + 1}`}
              fullWidth
              margin="dense"
              value={option}
              inputProps={ANTI_ASSIST_ATTRS as any}
              onCommit={(next) => onOptionChange(target.id, index, next)}
            />
          </Stack>
        );
      })}
      <Button onClick={() => onAddOption(target.id)} sx={{ mt: 1 }}>
        Add Option
      </Button>
    </Box>
  );
}
