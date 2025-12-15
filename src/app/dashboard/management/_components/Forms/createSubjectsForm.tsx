'use client';
import React from 'react';
import { TextField, Box, Stack } from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { subjectsSchema } from '@/app/_lib/schemas/management';
import { SubmitSubject } from './submitSubjects';
import { SubjectDto } from '@/app/_lib/interfaces/types';

interface CreateSubjectsFormProps {
  formId?: string;
  onPendingChange?: (pending: boolean) => void;
  onSuccess?: (subject: SubjectDto) => void;
}

export default function CreateSubjectsForm({
  formId = 'create-subject-form',
  onPendingChange,
  onSuccess,
}: CreateSubjectsFormProps) {
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
  const { id: _ignoredFormId, ...formProps } = getFormProps(form);

  React.useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  React.useEffect(() => {
    if (lastResult && (lastResult as SubjectDto)?.name) {
      const created = lastResult as SubjectDto;
      showAlert('success', `The ${created.name} subject was successfully created 🚀!`);
      onSuccess?.(created);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  return (
    <Box
      component="form"
      id={formId}
      {...formProps}
      action={action}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Stack spacing={2.5} sx={{ p: { xs: 1, md: 2 } }}>
        <TextField
          label="Subject name"
          placeholder="Business Management, Call basics, John's class"
          key={name.key}
          name={name.name}
          defaultValue={name.initialValue}
          error={!name.valid}
          helperText={name.errors?.join(', ') || 'Visible anywhere this subject is referenced.'}
          fullWidth
          required
        />

        <TextField
          label="Group"
          placeholder="Languages, Commerce, Technology"
          key={group.key}
          name={group.name}
          defaultValue={group.initialValue}
          error={!group.valid}
          helperText={group.errors?.join(', ') || 'Optional grouping to cluster reports.'}
          fullWidth
        />

        <TextField
          label="Subject code"
          placeholder="e.g. MATH401"
          key={subjectCode.key}
          name={subjectCode.name}
          defaultValue={subjectCode.initialValue}
          error={!subjectCode.valid}
          helperText={subjectCode.errors?.join(', ') || 'Short code shown to students and in exports.'}
          fullWidth
          required
        />

        <TextField
          label="Category"
          placeholder="If grouping applies, e.g. IT department"
          key={category.key}
          name={category.name}
          defaultValue={category.initialValue}
          error={!category.valid}
          helperText={category.errors?.join(', ') || 'Optional tag displayed on analytics cards.'}
          fullWidth
        />
      </Stack>
    </Box>
  );
}
