'use client';
import React, { useEffect } from 'react';
import {
  TextField,
  Box,
  Button,
  Typography,
  Paper,
  MenuItem,
  Divider,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { mutate } from 'swr';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { institutionSchema } from '@/app/_lib/schemas/management';
import { SubmitInstitution } from './SubmitInstitution';

interface EnrollInstitutionFormProps {
  onSuccess?: () => void;
}

export default function EnrollInstitutionForm({
  onSuccess,
}: EnrollInstitutionFormProps) {
  const { showAlert } = useAlert();
  const [lastResult, action, pending] = useActionState(SubmitInstitution, null);
  const [
    form,
    {
      institutionName,
      adminFirstName,
      adminLastName,
      adminEmail,
      subscriptionPlan,
      creatorEnabled,
    },
  ] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: institutionSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    if (
      lastResult &&
      typeof lastResult === 'object' &&
      'success' in lastResult
    ) {
      if (
        lastResult.success &&
        'institution' in lastResult &&
        lastResult.institution
      ) {
        showAlert(
          'success',
          `Institution "${lastResult.institution}" was successfully created! 🚀`
        );
        mutate('institutions');
        onSuccess?.();
      } else if (
        !lastResult.success &&
        'error' in lastResult &&
        lastResult.error
      ) {
        showAlert('error', lastResult.error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult, onSuccess]);

  return (
    <Box
      component="form"
      {...getFormProps(form)}
      action={action}
      sx={{ padding: 3 }}
    >
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Institution Information
            </Typography>
            <TextField
              label="Institution Name"
              key={institutionName.key}
              name={institutionName.name}
              defaultValue={institutionName.initialValue}
              error={!institutionName.valid}
              helperText={
                institutionName.errors || 'Enter the full name of the institution'
              }
              fullWidth
              margin="normal"
              required
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Administrator Information
            </Typography>
            <TextField
              label="Admin First Name"
              key={adminFirstName.key}
              name={adminFirstName.name}
              defaultValue={adminFirstName.initialValue}
              error={!adminFirstName.valid}
              helperText={
                adminFirstName.errors || "Enter the admin's first name"
              }
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Admin Last Name"
              key={adminLastName.key}
              name={adminLastName.name}
              defaultValue={adminLastName.initialValue}
              error={!adminLastName.valid}
              helperText={
                adminLastName.errors || "Enter the admin's last name"
              }
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Admin Email"
              type="email"
              key={adminEmail.key}
              name={adminEmail.name}
              defaultValue={adminEmail.initialValue}
              error={!adminEmail.valid}
              helperText={
                adminEmail.errors || "Enter the admin's email address"
              }
              fullWidth
              margin="normal"
              required
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Subscription Details
            </Typography>
            <TextField
              select
              label="Subscription Plan"
              key={subscriptionPlan.key}
              name={subscriptionPlan.name}
              defaultValue={subscriptionPlan.initialValue || 'Standard'}
              error={!subscriptionPlan.valid}
              helperText={
                subscriptionPlan.errors ||
                'Choose the plan applied to this institution'
              }
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Enterprise">Enterprise</MenuItem>
            </TextField>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    key={creatorEnabled.key}
                    name={creatorEnabled.name}
                    defaultChecked={
                      creatorEnabled.initialValue === 'on' ||
                      creatorEnabled.initialValue === 'true' ||
                      creatorEnabled.initialValue === '1'
                    }
                  />
                }
                label="Creator add-on enabled"
              />
              {!creatorEnabled.valid && (
                <Typography variant="body2" color="error">
                  {creatorEnabled.errors}
                </Typography>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Plan selection and creator access are required at creation. These
              values seed billing defaults and can be adjusted later.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={pending}
              sx={{ minWidth: 160 }}
            >
              {pending ? 'Creating...' : 'Create Institution'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
