'use client';
import {
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { SubmitForm } from './submitForm';
import { useActionState, useEffect } from 'react';
import { roleOptions } from '@/app/_lib/common/functions';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { registrationSchema } from '@/app/_lib/schemas/management';

export default function UserRegistrationForm() {
  const { showAlert } = useAlert();
  const [lastResult, action, pending] = useActionState(SubmitForm, false);
  const [form, { firstName, lastName, email, role }] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registrationSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    if (lastResult) {
      showAlert(
        'success',
        `${lastResult.firstName} ${lastResult.lastName} registered successfully🚀!`
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
        placeholder="First Name"
        key={firstName.key}
        name={firstName.name}
        defaultValue={firstName.initialValue}
        error={!firstName.valid}
        helperText={firstName.errors || ''}
        fullWidth
        margin="normal"
      />
      <TextField
        placeholder="Last Name"
        key={lastName.key}
        name={lastName.name}
        defaultValue={lastName.initialValue}
        error={!lastName.valid}
        helperText={lastName.errors || ''}
        fullWidth
        margin="normal"
      />
      <TextField
        placeholder="Email"
        key={email.key}
        name={email.name}
        defaultValue={email.initialValue}
        error={!email.valid}
        helperText={email.errors || ''}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth error={!role.valid} margin="normal">
        <InputLabel>Role</InputLabel>
        <Select
          key={role.key}
          name={role.name}
          defaultValue={`${role.initialValue || ''}`}
        >
          {roleOptions.map((data) => (
            <MenuItem key={data.value} value={data.value}>
              {data.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{role.errors || ''}</FormHelperText>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
        <Button
          type="submit"
          loading={pending}
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
