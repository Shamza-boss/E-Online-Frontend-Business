'use client';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import type { Question } from '@/app/_lib/interfaces/types';
import BufferedTextField from '../BufferedTextField';

export type QuestionTypeSelectorProps = {
  questionId: string;
  type: Question['type'];
  weight: number;
  showWeight: boolean;
  questionTypeOptions: ReadonlyArray<{
    value: Question['type'];
    label: string;
  }>;
  filterOptions?: (type: Question['type']) => boolean;
  onTypeChange: (questionId: string, newType: Question['type']) => void;
  onWeightChange: (questionId: string, value: string) => void;
}

export default function QuestionTypeSelector({
  questionId,
  type,
  weight,
  showWeight,
  questionTypeOptions,
  filterOptions,
  onTypeChange,
  onWeightChange,
}: QuestionTypeSelectorProps) {
  const options = filterOptions
    ? questionTypeOptions.filter((option) => filterOptions(option.value))
    : questionTypeOptions;

  return (
    <Stack direction="row" spacing={1}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select
          value={type}
          label="Type"
          onChange={(e) => onTypeChange(questionId, e.target.value as Question['type'])}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {showWeight && (
        <BufferedTextField
          label="Weight"
          type="number"
          fullWidth
          margin="normal"
          value={weight}
          onCommit={(next) => onWeightChange(questionId, next)}
          onKeyDown={(e) => {
            if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
          }}
          inputProps={{ min: 1 }}
        />
      )}
    </Stack>
  );
}
