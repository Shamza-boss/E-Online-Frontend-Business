import * as Yup from 'yup';

export const SIGN_UP_SCHEMA = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  terms: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions',
  ),
});

export const SIGN_UP_DEFAULTS: { email: string; terms: boolean } = {
  email: '',
  terms: false,
};

export const SIGN_UP_TITLE = 'Create Your Passkey';
export const SIGN_UP_SUBTITLE = 'Set up secure, passwordless authentication';
export const SIGN_UP_SUBMIT_LABEL = 'Create Passkey';
export const SIGN_UP_SUBMIT_BUSY_LABEL = 'Opening passkey...';
export const SIGN_UP_CALLBACK_URL = '/dashboard';

export const SIGN_UP_ORB_CONFIG = [
  { size: 280, x: '15%', y: '25%', delay: 1, duration: 22, colorKey: 'secondary' as const },
  { size: 220, x: '75%', y: '15%', delay: 0, duration: 20, colorKey: 'primary' as const },
  { size: 200, x: '65%', y: '65%', delay: 3, duration: 25, colorKey: 'secondaryDark' as const },
  { size: 160, x: '25%', y: '75%', delay: 2, duration: 28, colorKey: 'primaryDark' as const },
  { size: 140, x: '45%', y: '45%', delay: 4, duration: 18, colorKey: 'success' as const },
];
