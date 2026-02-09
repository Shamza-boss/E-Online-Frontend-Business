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
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { useWarp } from '@/app/_lib/components/shared-theme/WarpTransition';
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Form = { email: string };

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

// Animated floating orbs for background
function FloatingOrbs() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const orbs = [
    { size: 300, x: '10%', y: '20%', delay: 0, duration: 20, color: theme.palette.primary.main },
    { size: 200, x: '80%', y: '10%', delay: 2, duration: 25, color: theme.palette.secondary.main },
    { size: 250, x: '70%', y: '70%', delay: 4, duration: 22, color: theme.palette.primary.dark },
    { size: 180, x: '20%', y: '80%', delay: 1, duration: 28, color: theme.palette.secondary.dark },
    { size: 150, x: '50%', y: '50%', delay: 3, duration: 18, color: theme.palette.info.main },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        background: isDark
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 50%, #f5f7fa 100%)',
      }}
    >
      {orbs.map((orb, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(orb.color, isDark ? 0.3 : 0.2)} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            animation: `float-${i} ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            '@keyframes float-0': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
              '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            },
            '@keyframes float-1': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(-40px, 20px) scale(1.05)' },
              '66%': { transform: 'translate(20px, -40px) scale(0.95)' },
            },
            '@keyframes float-2': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(25px, 35px) scale(1.08)' },
              '66%': { transform: 'translate(-35px, -25px) scale(0.92)' },
            },
            '@keyframes float-3': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(-30px, -20px) scale(1.1)' },
              '66%': { transform: 'translate(40px, 30px) scale(0.9)' },
            },
            '@keyframes float-4': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(20px, 40px) scale(1.05)' },
              '66%': { transform: 'translate(-25px, -35px) scale(0.95)' },
            },
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
    </Box>
  );
}

export default function SignIn() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { showAlert } = useAlert();
  const { warpTo } = useWarp();
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

      const resolvedUser = await existsRes.json();
      const isInstitutionActive =
        resolvedUser?.isInstitutionActive ??
        resolvedUser?.IsInstitutionActive ??
        true;
      if (!isInstitutionActive) {
        const primaryAdminEmail =
          resolvedUser?.primaryAdminEmail ??
          resolvedUser?.PrimaryAdminEmail ??
          null;
        const isPrimaryAdmin =
          typeof primaryAdminEmail === 'string' &&
          primaryAdminEmail.trim().toLowerCase() === normalizedEmail;
        const message = isPrimaryAdmin
          ? 'Your institution is inactive. Please contact AbsoluteOnline for assistance.'
          : 'Your institution is inactive. Please contact your institution administrator.';
        showAlert('error', message);
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

      {/* Back to home button - fixed at top */}
      <Button
        onClick={() => warpTo('/')}
        startIcon={<ArrowBackIcon />}
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 10,
          color: isDark ? 'grey.300' : 'grey.700',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        Back to Home
      </Button>

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          p: 2,
        }}
      >
        {/* Main card with glassmorphism */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
            animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            '@keyframes slideUp': {
              from: {
                opacity: 0,
                transform: 'translateY(40px) scale(0.95)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
              },
            },
          }}
        >
          {/* Glowing border effect */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 4,
              p: '1px',
              background: isDark
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.5)}, ${alpha(theme.palette.secondary.main, 0.3)}, ${alpha(theme.palette.primary.main, 0.5)})`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.secondary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.3)})`,
              backgroundSize: '200% 200%',
              animation: 'gradientShift 8s ease infinite',
              '@keyframes gradientShift': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
              },
            }}
          >
            <Stack
              gap={3}
              sx={{
                p: 4,
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                background: isDark ? alpha('#000', 0.7) : alpha('#fff', 0.85),
                boxShadow: isDark
                  ? `0 25px 50px -12px ${alpha('#000', 0.5)}`
                  : `0 25px 50px -12px ${alpha('#000', 0.15)}`,
              }}
            >
              {/* Logo/Icon with pulse animation */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  animation: 'fadeIn 0.8s ease 0.2s both',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'scale(0.8)' },
                    to: { opacity: 1, transform: 'scale(1)' },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      '50%': {
                        boxShadow: `0 10px 60px ${alpha(theme.palette.primary.main, 0.6)}`,
                      },
                    },
                  }}
                >
                  <KeyIcon sx={{ fontSize: 36, color: '#fff' }} />
                </Box>
              </Box>

              <Box
                sx={{
                  textAlign: 'center',
                  animation: 'fadeIn 0.8s ease 0.3s both',
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    background: isDark
                      ? 'linear-gradient(135deg, #fff 0%, #a0a0a0 100%)'
                      : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Sign in with your passkey to continue
                </Typography>
              </Box>

              <Box
                component="form"
                noValidate
                autoComplete="on"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  animation: 'fadeIn 0.8s ease 0.4s both',
                }}
              >
                <Stack spacing={3}>
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backdropFilter: 'blur(10px)',
                              background: isDark
                                ? alpha('#fff', 0.05)
                                : alpha('#000', 0.02),
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: isDark
                                  ? alpha('#fff', 0.08)
                                  : alpha('#000', 0.04),
                              },
                              '&.Mui-focused': {
                                background: isDark
                                  ? alpha('#fff', 0.1)
                                  : alpha('#000', 0.03),
                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={busy}
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1rem',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 15px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&.Mui-disabled': {
                        background: theme.palette.action.disabledBackground,
                      },
                    }}
                  >
                    {busy ? 'Opening passkey...' : 'Sign in with Passkey'}
                  </Button>
                </Stack>
              </Box>

              <Box
                sx={{
                  animation: 'fadeIn 0.8s ease 0.5s both',
                }}
              >
                <Divider
                  sx={{
                    my: 1,
                    '&::before, &::after': {
                      borderColor: alpha(theme.palette.divider, 0.5),
                    },
                  }}
                />
                <Typography textAlign="center" color="text.secondary">
                  {"Don't have an account? "}
                  <Link
                    href="/signup"
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>

              {/* Legal links footer */}
              <Box
                sx={{
                  textAlign: 'center',
                  mt: 2,
                  animation: 'fadeIn 0.8s ease 0.6s both',
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}
                >
                  <Link
                    href="https://absoluteonline.co.za/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link
                    href="https://absoluteonline.co.za/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Terms of Service
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
