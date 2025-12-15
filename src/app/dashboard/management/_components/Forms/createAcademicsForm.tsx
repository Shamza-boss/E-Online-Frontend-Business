'use client';
import React from 'react';
import { TextField, Box, Stack } from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { academicsSchema } from '@/app/_lib/schemas/management';
import { SubmitAcademics } from './submitAcademics';
import { AcademicLevelDto } from '@/app/_lib/interfaces/types';

interface CreateAcademicsFormProps {
  formId?: string;
  onPendingChange?: (pending: boolean) => void;
  onSuccess?: (level: AcademicLevelDto) => void;
}

export default function CreateAcademicsForm({
  formId = 'create-academic-form',
  onPendingChange,
  onSuccess,
}: CreateAcademicsFormProps) {
  const { showAlert } = useAlert();
  const [lastResult, action, pending] = useActionState(SubmitAcademics, false);
  const [form, { name, country, educationSystem }] = useForm({
    id: formId,
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: academicsSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });
  const formProps = getFormProps(form);

  React.useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  React.useEffect(() => {
    if (lastResult && (lastResult as AcademicLevelDto)?.name) {
      const created = lastResult as AcademicLevelDto;
      showAlert('success', `The ${created.name} academic level was successfully created 🚀!`);
      onSuccess?.(created);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  return (
    <Box
      component="form"
      {...formProps}
      action={action}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Stack spacing={2.5} sx={{ p: { xs: 1, md: 2 } }}>
        <TextField
          label="Level name"
          placeholder="Year 1, Level 2, Grade 12"
          key={name.key}
          name={name.name}
          defaultValue={name.initialValue}
          error={!name.valid}
          helperText={name.errors?.join(', ') || 'Visible to students and staff everywhere this level is referenced.'}
          fullWidth
          required
        />

        <TextField
          label="Country / Region"
          placeholder="South Africa / ZA"
          key={country.key}
          name={country.name}
          defaultValue={country.initialValue}
          error={!country.valid}
          helperText={country.errors?.join(', ') || 'Used to localize grade expectations.'}
          fullWidth
          required
        />

        <TextField
          label="Education system"
          placeholder="CAPS, Cambridge, IEB"
          key={educationSystem.key}
          name={educationSystem.name}
          defaultValue={educationSystem.initialValue}
          error={!educationSystem.valid}
          helperText={
            educationSystem.errors?.join(', ') ||
            'Optional descriptor that appears in analytics and exports.'
          }
          fullWidth
        />
      </Stack>
    </Box>
  );
}
