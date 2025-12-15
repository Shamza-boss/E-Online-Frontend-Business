'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Link,
  Stack,
  Button,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { Messages } from '@/app/_lib/interfaces/Auth/Messages';
import { signIn } from 'next-auth/webauthn';

type Form = {
  email: string;
  terms?: boolean;
};

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  terms: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions'
  ),
});

export default function SignUpPage() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', terms: false },
  });

  // Prefill email from /signup?email=...
  useEffect(() => {
    const u = new URL(window.location.href);
    const email = u.searchParams.get('email');
    if (email) setValue('email', email);
  }, [setValue]);

  const onSubmit = async ({ email }: Form) => {
    const normalized = (email ?? '').trim().toLowerCase();
    if (!normalized) {
      showAlert('error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/auth/resolve/${encodeURIComponent(normalized)}`,
        { cache: 'no-store' }
      );

      if (res.status === 404) {
        showAlert(
          'error',
          'We could not find an account for that email. Please contact your administrator.'
        );
        return;
      }
      if (!res.ok) {
        showAlert('error', 'Server error while checking your account. Try again.');
        return;
      }

      const baseUser = await res.json();
      const name =
        [baseUser.firstName, baseUser.lastName].filter(Boolean).join(' ') ||
        undefined;

      await signIn('passkey', {
        redirect: true,
        callbackUrl: '/dashboard',
        action: 'register',
        email: normalized,
        name,
      } as any);

      showAlert(
        'info',
        'Passkey dialog was closed. You can create a passkey later from Settings.'
      );
    } catch (err: any) {
      showAlert(
        'error',
        err?.message ||
        (Messages?.error?.generic ??
          'Something went wrong😫. Please contact support or your administrator.')
      );
      console.error('Passkey enrollment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" height="100vh" p={2}>
      <Box
        width="100%"
        maxWidth={450}
        p={4}
        borderRadius={4}
        boxShadow={2}
        bgcolor="background.paper"
      >
        <Typography variant="h4" textAlign="center" mb={2}>
          Create your passkey
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="on"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={2}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Work email"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  placeholder="you@school.edu"
                  error={!!errors.email}
                  helperText={errors.email?.message ?? ' '}
                  inputProps={{ 'aria-label': 'Work email address' }}
                />
              )}
            />
            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                        inputProps={{ 'aria-label': 'Accept terms and conditions' }}
                      />
                    }
                    label="I accept the terms and conditions"
                  />
                  {errors.terms && (
                    <Typography variant="caption" color="error" sx={{ ml: 1.5 }}>
                      {errors.terms.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Opening passkey…' : 'Create passkey'}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography textAlign="center" mt={1}>
          Already have a passkey? <Link href="/signin">Sign in</Link>
        </Typography>
      </Box>
    </Stack>
  );
}
