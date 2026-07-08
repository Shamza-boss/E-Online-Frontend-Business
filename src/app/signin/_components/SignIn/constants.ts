import * as Yup from 'yup';

export const SIGN_IN_SCHEMA = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export const SIGN_IN_DEFAULTS: { email: string } = { email: '' };

export const SIGN_IN_TITLE = 'Welcome Back';
export const SIGN_IN_SUBTITLE = 'Sign in with your passkey to continue';
export const SIGN_IN_SUBMIT_LABEL = 'Sign in with Passkey';
export const SIGN_IN_SUBMIT_BUSY_LABEL = 'Opening passkey...';
export const SIGN_IN_CALLBACK_URL = '/dashboard';

export const SIGN_IN_ORB_CONFIG = [
  { size: 300, x: '10%', y: '20%', delay: 0, duration: 20, colorKey: 'primary' as const },
  { size: 200, x: '80%', y: '10%', delay: 2, duration: 25, colorKey: 'secondary' as const },
  { size: 250, x: '70%', y: '70%', delay: 4, duration: 22, colorKey: 'primaryDark' as const },
  { size: 180, x: '20%', y: '80%', delay: 1, duration: 28, colorKey: 'secondaryDark' as const },
  { size: 150, x: '50%', y: '50%', delay: 3, duration: 18, colorKey: 'info' as const },
];
