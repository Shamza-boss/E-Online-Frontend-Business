'use client';

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
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { SIGN_IN_ORB_CONFIG, SIGN_IN_SUBTITLE, SIGN_IN_TITLE } from './constants';
import type { SignInForm } from './types';

export function FloatingOrbs() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const colorMap = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    primaryDark: theme.palette.primary.dark,
    secondaryDark: theme.palette.secondary.dark,
    info: theme.palette.info.main,
  };

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
      {SIGN_IN_ORB_CONFIG.map((orb, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(colorMap[orb.colorKey], isDark ? 0.3 : 0.2)} 0%, transparent 70%)`,
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

type SignInFormFieldsProps = {
  control: Control<SignInForm>;
  errors: FieldErrors<SignInForm>;
  busy: boolean;
  submitLabel: string;
  busyLabel: string;
  onSubmit: () => void;
}

export function SignInFormFields({
  control,
  errors,
  busy,
  submitLabel,
  busyLabel,
  onSubmit,
}: SignInFormFieldsProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component="form"
      noValidate
      autoComplete="on"
      onSubmit={onSubmit}
      sx={{ animation: 'fadeIn 0.8s ease 0.4s both' }}
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
                    background: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isDark ? alpha('#fff', 0.08) : alpha('#000', 0.04),
                    },
                    '&.Mui-focused': {
                      background: isDark ? alpha('#fff', 0.1) : alpha('#000', 0.03),
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
            '&:active': { transform: 'translateY(0)' },
            '&.Mui-disabled': {
              background: theme.palette.action.disabledBackground,
            },
          }}
        >
          {busy ? busyLabel : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}

type AuthCardShellProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  gradientFrom: 'primary' | 'secondary';
}

export function AuthCardShell({ children, icon, gradientFrom }: AuthCardShellProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const fromColor =
    gradientFrom === 'primary'
      ? theme.palette.primary.main
      : theme.palette.secondary.main;
  const toColor =
    gradientFrom === 'primary'
      ? theme.palette.secondary.main
      : theme.palette.primary.main;
  const shadowColor =
    gradientFrom === 'primary'
      ? theme.palette.primary.main
      : theme.palette.secondary.main;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 440,
        animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        '@keyframes slideUp': {
          from: { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
          to: { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: 4,
          p: '1px',
          background: isDark
            ? `linear-gradient(135deg, ${alpha(fromColor, 0.5)}, ${alpha(toColor, 0.3)}, ${alpha(fromColor, 0.5)})`
            : `linear-gradient(135deg, ${alpha(fromColor, 0.3)}, ${alpha(toColor, 0.2)}, ${alpha(fromColor, 0.3)})`,
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
                background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
                boxShadow: `0 10px 40px ${alpha(shadowColor, 0.4)}`,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    boxShadow: `0 10px 40px ${alpha(shadowColor, 0.4)}`,
                  },
                  '50%': {
                    boxShadow: `0 10px 60px ${alpha(shadowColor, 0.6)}`,
                  },
                },
              }}
            >
              {icon}
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', animation: 'fadeIn 0.8s ease 0.3s both' }}>
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
              {SIGN_IN_TITLE}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {SIGN_IN_SUBTITLE}
            </Typography>
          </Box>
          {children}
        </Stack>
      </Box>
    </Box>
  );
}

export function AuthBackButton({ onBack }: { onBack: () => void }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Button
      onClick={onBack}
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
  );
}

export function AuthFooterLinks({
  prompt,
  linkHref,
  linkLabel,
  gradientFrom,
}: {
  prompt: string;
  linkHref: string;
  linkLabel: string;
  gradientFrom: 'primary' | 'secondary';
}) {
  const theme = useTheme();

  const fromColor =
    gradientFrom === 'primary'
      ? theme.palette.primary.main
      : theme.palette.secondary.main;
  const toColor =
    gradientFrom === 'primary'
      ? theme.palette.secondary.main
      : theme.palette.primary.main;

  return (
    <Box sx={{ animation: 'fadeIn 0.8s ease 0.5s both' }}>
      <Divider
        sx={{
          my: 1,
          '&::before, &::after': {
            borderColor: alpha(theme.palette.divider, 0.5),
          },
        }}
      />
      <Typography textAlign="center" color="text.secondary">
        {prompt}
        <Link
          href={linkHref}
          sx={{
            fontWeight: 600,
            textDecoration: 'none',
            background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          {linkLabel}
        </Link>
      </Typography>
    </Box>
  );
}

export function AuthLegalFooter() {
  return (
    <Box sx={{ textAlign: 'center', mt: 2, animation: 'fadeIn 0.8s ease 0.6s both' }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <Link
          href="https://absoluteonline.co.za/privacy"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Privacy Policy
        </Link>
        <span>•</span>
        <Link
          href="https://absoluteonline.co.za/terms"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
}

export function SignInIcon() {
  return <KeyIcon sx={{ fontSize: 36, color: '#fff' }} />;
}
