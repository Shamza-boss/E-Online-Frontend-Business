'use client';
import React, { useEffect } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { academicsSchema } from '@/app/_lib/schemas/management';
import { SubmitAcademics } from './submitAcademics';

export default function CreateAcademicsForm() {
  const { showAlert } = useAlert();
  const [lastResult, action, pending] = useActionState(SubmitAcademics, false);
  const [form, { name, country, educationSystem }] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: academicsSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    if (lastResult) {
      showAlert(
        'success',
        `The ${lastResult.name} academic level was successfully created🚀!`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  return (
    <Box
      component="form"
      {...getFormProps(form)}
      action={action}
      sx={{ padding: 3 }}
    >
      <TextField
        label="Year 1, Level 2, Grade 12"
        key={name.key}
        name={name.name}
        defaultValue={name.initialValue}
        error={!name.valid}
        helperText={name.errors || ''}
        fullWidth
        margin="normal"
      />

      <TextField
        label="South africa / ZA"
        key={country.key}
        name={country.name}
        defaultValue={country.initialValue}
        error={!country.valid}
        helperText={country.errors || ''}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Caps, Tertiary, Organisation"
        key={educationSystem.key}
        name={educationSystem.name}
        defaultValue={educationSystem.initialValue}
        error={!educationSystem.valid}
        helperText={educationSystem.errors || ''}
        fullWidth
        margin="normal"
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          marginTop: 3,
        }}
      >
        <Button type="submit" variant="contained" loading={pending}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
