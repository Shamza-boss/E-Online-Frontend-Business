'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack } from '@mui/material';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { useWarp } from '@/app/_lib/components/shared-theme/WarpTransition';
import {
  SIGN_IN_DEFAULTS,
  SIGN_IN_SCHEMA,
  SIGN_IN_SUBMIT_BUSY_LABEL,
  SIGN_IN_SUBMIT_LABEL,
} from './constants';
import {
  AuthBackButton,
  AuthCardShell,
  AuthFooterLinks,
  AuthLegalFooter,
  FloatingOrbs,
  SignInFormFields,
  SignInIcon,
} from './elements';
import type { SignInForm } from './types';
import { submitSignIn } from './utils';

export default function SignIn() {
  const { showAlert } = useAlert();
  const { warpTo } = useWarp();
  const [busy, setBusy] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: yupResolver(SIGN_IN_SCHEMA),
    defaultValues: SIGN_IN_DEFAULTS,
  });

  const onSubmit = async ({ email }: SignInForm) => {
    setBusy(true);
    try {
      await submitSignIn(email, showAlert);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Passkey sign-in failed';
      showAlert('error', errorMessage);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <FloatingOrbs />
      <AuthBackButton onBack={() => warpTo('/')} />
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', position: 'relative', zIndex: 1, p: 2 }}
      >
        <AuthCardShell icon={<SignInIcon />} gradientFrom="primary">
          <SignInFormFields
            control={control}
            errors={errors}
            busy={busy}
            submitLabel={SIGN_IN_SUBMIT_LABEL}
            busyLabel={SIGN_IN_SUBMIT_BUSY_LABEL}
            onSubmit={handleSubmit(onSubmit)}
          />
          <AuthFooterLinks
            prompt={"Don't have an account? "}
            linkHref="/signup"
            linkLabel="Sign Up"
            gradientFrom="primary"
          />
          <AuthLegalFooter />
        </AuthCardShell>
      </Stack>
    </Box>
  );
}
