'use client';

import { useState } from 'react';
import { signIn as passkeySignIn } from 'next-auth/webauthn';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';

type Form = { email: string };

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function SignIn() {
  const { showAlert } = useAlert();
  const [busy, setBusy] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }: Form) => {
    const normalizedEmail = (email ?? '').trim().toLowerCase();
    if (!normalizedEmail) {
      showAlert('error', 'Please enter your email');
      return;
    }

    setBusy(true);
    try {
      const existsRes = await fetch(`/api/auth/resolve/${normalizedEmail}`, {
        cache: 'no-store',
      });

      if (existsRes.status === 404) {
        showAlert(
          'error',
          'No account found. Please contact your institution administrator.'
        );
        return;
      }
      if (!existsRes.ok) {
        showAlert('error', 'Unable to verify your account. Try again.');
        return;
      }

      const hp = await fetch(
        `/api/auth/has-passkey?email=${encodeURIComponent(normalizedEmail)}`,
        { cache: 'no-store' }
      ).then((r) => r.json());

      if (!hp.existsInPrisma || !hp.hasPasskey) {
        showAlert(
          'info',
          'First time with this account. Please complete registration.'
        );
        window.location.href = `/signup?email=${encodeURIComponent(
          normalizedEmail
        )}`;
        return;
      }

      await passkeySignIn(
        'passkey',
        { redirect: true, callbackUrl: '/dashboard' },
        { email: normalizedEmail }
      );
    } catch (e: any) {
      showAlert('error', e?.message ?? 'Passkey sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" height="100vh" p={2}>
      <Stack width="100%" maxWidth={480} gap={2}>
        <Typography variant="h4" textAlign="center">
          Sign In
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="on"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={2}>
            <FormControl fullWidth>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    label="Email"
                    placeholder="you@school.edu"
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email?.message ?? ' '}
                    inputProps={{ 'aria-label': 'Email address' }}
                  />
                )}
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              disabled={busy}
              fullWidth
            >
              {busy ? 'Opening passkey…' : 'Sign in with Passkey'}
            </Button>
          </Stack>
        </Box>

        <Divider />
        <Typography textAlign="center">
          Don’t have an account? <Link href="/signup">Sign Up</Link>
        </Typography>
      </Stack>
    </Stack>
  );
}
