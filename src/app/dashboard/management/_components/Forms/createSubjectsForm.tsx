'use client';
import React, { useEffect } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { subjectsSchema } from '@/app/_lib/schemas/management';
import { SubmitSubject } from './submitSubjects';

export default function CreateSubjectsForm() {
  const { showAlert } = useAlert();

  const [lastResult, action, pending] = useActionState(SubmitSubject, false);
  const [form, { name, group, subjectCode, category }] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: subjectsSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    if (lastResult) {
      showAlert(
        'success',
        `The ${lastResult.name} subject was successfully created🚀!`
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
        label="Business Management, Call basics, John's class"
        key={name.key}
        name={name.name}
        defaultValue={name.initialValue}
        error={!name.valid}
        helperText={name.errors || ''}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Languages, commerce, Technology, basics"
        key={group.key}
        name={group.name}
        defaultValue={group.initialValue}
        error={!group.valid}
        helperText={group.errors || ''}
        fullWidth
        margin="normal"
      />

      <TextField
        label="subject code"
        key={subjectCode.key}
        name={subjectCode.name}
        defaultValue={subjectCode.initialValue}
        error={!subjectCode.valid}
        helperText={subjectCode.errors || ''}
        fullWidth
        margin="normal"
      />

      <TextField
        label="If grouping applies, E.g. It department"
        key={category.key}
        name={category.name}
        defaultValue={category.initialValue}
        error={!category.valid}
        helperText={category.errors || ''}
        fullWidth
        margin="normal"
      />

      {/* Action Buttons */}
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
