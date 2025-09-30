'use client';

import { useState } from 'react';
import { signIn as passkeySignIn } from 'next-auth/webauthn';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  TextField,
  Typography,
  Stack,
  Button,
  Divider,
  Link,
  FormControl,
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
    getValues,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });

  const onSignIn = async () => {
    const email = (getValues('email') || '').trim().toLowerCase();
    if (!email) {
      showAlert('error', 'Please enter your email');
      return;
    }

    setBusy(true);
    try {
      const existsRes = await fetch(`/api/auth/resolve/${email}`, {
        cache: 'no-store',
      });

      if (existsRes.status === 404) {
        showAlert(
          'error',
          'No account found. Please contact your institution administrator.'
        );
        setBusy(false);
        return;
      }
      if (!existsRes.ok) {
        showAlert('error', 'Unable to verify your account. Try again.');
        setBusy(false);
        return;
      }

      // 2) Check whether this email already has a passkey registered in Prisma
      const hp = await fetch(
        `/api/auth/has-passkey?email=${encodeURIComponent(email)}`,
        {
          cache: 'no-store',
        }
      ).then((r) => r.json());

      if (!hp.existsInPrisma || !hp.hasPasskey) {
        // First time login in this app → send to signup to create a passkey
        showAlert(
          'info',
          'First time with this account. Please complete registration.'
        );
        window.location.href = `/signup?email=${encodeURIComponent(email)}`;
        return;
      }

      // 3) Proceed to authenticate via WebAuthn (no extra page)
      await passkeySignIn(
        'passkey',
        { redirect: true, callbackUrl: '/dashboard' },
        { email }
      );
    } catch (e: any) {
      showAlert('error', e?.message ?? 'Passkey sign-in failed');
      setBusy(false);
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" height="100vh" p={2}>
      <Stack width="100%" maxWidth={480} gap={2}>
        <Typography variant="h4" textAlign="center">
          Sign In
        </Typography>

        <FormControl fullWidth>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                placeholder="you@school.edu"
                error={!!errors.email}
                helperText={errors.email?.message ?? ' '}
              />
            )}
          />
        </FormControl>

        <Button variant="contained" onClick={onSignIn} disabled={busy}>
          {busy ? 'Opening passkey…' : 'Sign in with Passkey'}
        </Button>

        <Divider />
        <Typography textAlign="center">
          Don’t have an account? <Link href="/signup">Sign Up</Link>
        </Typography>
      </Stack>
    </Stack>
  );
}
