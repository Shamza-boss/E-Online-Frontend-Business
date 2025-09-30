'use client';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
} from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { mutate } from 'swr';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { institutionSchema } from '@/app/_lib/schemas/management';
import { SubmitInstitution } from './SubmitInstitution';

const steps = ['Institution Details', 'Admin Details'];

interface EnrollInstitutionFormProps {
  onSuccess?: () => void;
}

export default function EnrollInstitutionForm({
  onSuccess,
}: EnrollInstitutionFormProps) {
  const { showAlert } = useAlert();
  const [activeStep, setActiveStep] = useState(0);
  const [lastResult, action, pending] = useActionState(SubmitInstitution, null);
  const [form, { institutionName, adminFirstName, adminLastName, adminEmail }] =
    useForm({
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
        setActiveStep(0);
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box
      component="form"
      {...getFormProps(form)}
      action={action}
      sx={{ padding: 3 }}
    >
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={2} sx={{ p: 3 }}>
        {/* All form fields - always present in DOM */}
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
          sx={{ display: activeStep === 0 ? 'block' : 'none' }}
        />

        <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Administrator Information
          </Typography>
          <TextField
            label="Admin First Name"
            key={adminFirstName.key}
            name={adminFirstName.name}
            defaultValue={adminFirstName.initialValue}
            error={!adminFirstName.valid}
            helperText={adminFirstName.errors || "Enter the admin's first name"}
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
            helperText={adminLastName.errors || "Enter the admin's last name"}
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
            helperText={adminEmail.errors || "Enter the admin's email address"}
            fullWidth
            margin="normal"
            required
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 3 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              disabled={pending}
              sx={{ minWidth: 120 }}
            >
              {pending ? 'Creating...' : 'Create Institution'}
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained">
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
