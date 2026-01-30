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
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { useWarp } from '@/app/_lib/components/shared-theme/WarpTransition';
import { Messages } from '@/app/_lib/interfaces/Auth/Messages';
import { signIn } from 'next-auth/webauthn';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

// Animated floating orbs for background
function FloatingOrbs() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const orbs = [
    { size: 280, x: '15%', y: '25%', delay: 1, duration: 22, color: theme.palette.secondary.main },
    { size: 220, x: '75%', y: '15%', delay: 0, duration: 20, color: theme.palette.primary.main },
    { size: 200, x: '65%', y: '65%', delay: 3, duration: 25, color: theme.palette.secondary.dark },
    { size: 160, x: '25%', y: '75%', delay: 2, duration: 28, color: theme.palette.primary.dark },
    { size: 140, x: '45%', y: '45%', delay: 4, duration: 18, color: theme.palette.success.main },
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
            animation: `floatOrb-${i} ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            '@keyframes floatOrb-0': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(-25px, 30px) scale(1.08)' },
              '66%': { transform: 'translate(35px, -20px) scale(0.92)' },
            },
            '@keyframes floatOrb-1': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(30px, -35px) scale(1.1)' },
              '66%': { transform: 'translate(-20px, 25px) scale(0.9)' },
            },
            '@keyframes floatOrb-2': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(-35px, -25px) scale(1.05)' },
              '66%': { transform: 'translate(25px, 35px) scale(0.95)' },
            },
            '@keyframes floatOrb-3': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(40px, 20px) scale(1.1)' },
              '66%': { transform: 'translate(-30px, -30px) scale(0.9)' },
            },
            '@keyframes floatOrb-4': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(-20px, -35px) scale(1.05)' },
              '66%': { transform: 'translate(30px, 25px) scale(0.95)' },
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

export default function SignUpPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { showAlert } = useAlert();
  const { warpTo } = useWarp();
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
      } as unknown as Parameters<typeof signIn>[1]);

      showAlert(
        'info',
        'Passkey dialog was closed. You can create a passkey later from Settings.'
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : Messages?.error?.generic ??
            'Something went wrong. Please contact support or your administrator.';
      showAlert('error', errorMessage);
      console.error('Passkey enrollment error:', err);
    } finally {
      setLoading(false);
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
                ? `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.5)}, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.secondary.main, 0.5)})`
                : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.3)}, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.3)})`,
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
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    boxShadow: `0 10px 40px ${alpha(theme.palette.secondary.main, 0.4)}`,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        boxShadow: `0 10px 40px ${alpha(theme.palette.secondary.main, 0.4)}`,
                      },
                      '50%': {
                        boxShadow: `0 10px 60px ${alpha(theme.palette.secondary.main, 0.6)}`,
                      },
                    },
                  }}
                >
                  <FingerprintIcon sx={{ fontSize: 36, color: '#fff' }} />
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
                  Create Your Passkey
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Set up secure, passwordless authentication
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
                <Stack spacing={2.5}>
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
                              boxShadow: `0 0 0 3px ${alpha(theme.palette.secondary.main, 0.15)}`,
                            },
                          },
                        }}
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
                              onChange={(event) =>
                                field.onChange(event.target.checked)
                              }
                              inputProps={{
                                'aria-label': 'Accept terms and conditions',
                              }}
                              sx={{
                                color: alpha(theme.palette.text.secondary, 0.5),
                                '&.Mui-checked': {
                                  color: theme.palette.secondary.main,
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" color="text.secondary">
                              I accept the terms and conditions
                            </Typography>
                          }
                        />
                        {errors.terms && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ ml: 1.5 }}
                          >
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
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1rem',
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      boxShadow: `0 10px 30px ${alpha(theme.palette.secondary.main, 0.3)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 15px 40px ${alpha(theme.palette.secondary.main, 0.4)}`,
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&.Mui-disabled': {
                        background: theme.palette.action.disabledBackground,
                      },
                    }}
                  >
                    {loading ? 'Opening passkey...' : 'Create Passkey'}
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
                  {'Already have a passkey? '}
                  <Link
                    href="/signin"
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  >
                    Sign In
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
