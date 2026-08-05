'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack } from '@mui/material';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { useWarp } from '@/app/_lib/components/shared-theme/WarpTransition';
import {
  SIGN_UP_DEFAULTS,
  SIGN_UP_SCHEMA,
  SIGN_UP_SUBMIT_BUSY_LABEL,
  SIGN_UP_SUBMIT_LABEL,
} from './constants';
import {
  AuthBackButton,
  AuthCardShell,
  AuthFooterLinks,
  AuthLegalFooter,
  FloatingOrbs,
  SignUpFormFields,
} from './elements';
import type { SignUpForm } from './types';
import { getSignUpErrorMessage, submitSignUp } from './utils';

export default function SignUpPage() {
  const { showAlert } = useAlert();
  const { warpTo } = useWarp();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(SIGN_UP_SCHEMA),
    defaultValues: SIGN_UP_DEFAULTS,
  });

  useEffect(() => {
    const u = new URL(window.location.href);
    const email = u.searchParams.get('email');
    if (email) setValue('email', email);
  }, [setValue]);

  const onSubmit = async ({ email }: SignUpForm) => {
    setLoading(true);
    try {
      await submitSignUp(email, showAlert);
    } catch (err: unknown) {
      showAlert('error', getSignUpErrorMessage(err));
      console.error('Passkey enrollment error:', err);
    } finally {
      setLoading(false);
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
        <AuthCardShell>
          <SignUpFormFields
            control={control}
            errors={errors}
            loading={loading}
            submitLabel={SIGN_UP_SUBMIT_LABEL}
            busyLabel={SIGN_UP_SUBMIT_BUSY_LABEL}
            onSubmit={handleSubmit(onSubmit)}
          />
          <AuthFooterLinks />
          <AuthLegalFooter />
        </AuthCardShell>
      </Stack>
    </Box>
  );
}
