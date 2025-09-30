import React from 'react';
import ErrorLayout from '@/app/dashboard/_components/ErrorLayout';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import GppBadIcon from '@mui/icons-material/GppBad';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication Error',
};

type SearchParams = Record<string, string | string[] | undefined>;
interface ErrorPageProps {
  searchParams?: Promise<SearchParams>;
}

function toStringParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

const MESSAGES: Record<
  string,
  {
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    tone?: 'error' | 'warning' | 'info' | 'success';
    icon: React.ReactNode;
  }
> = {
  AccountAlreadyLinked: {
    title: 'This account is already linked',
    description:
      'It looks like this third‑party account is already linked to a different user. Please sign in using the originally linked method, or unlink it from your account settings first.',
    actionLabel: 'Go to Sign in',
    actionHref: '/signin',
    tone: 'warning',
    icon: <LinkOffIcon fontSize="large" />,
  },
  AccountNotLinked: {
    title: 'Please sign in with the original provider',
    description:
      'Your email exists but with a different sign‑in method. Use the provider you originally used, or link providers after signing in.',
    actionLabel: 'Back to Sign in',
    actionHref: '/signin',
    tone: 'warning',
    icon: <LinkOffIcon fontSize="large" />,
  },
  OAuthAccountNotLinked: {
    title: 'Provider not linked yet',
    description:
      'You tried to sign in with an unlinked OAuth provider. Sign in with the provider you used before, then link it from settings.',
    actionLabel: 'Back to Sign in',
    actionHref: '/signin',
    tone: 'warning',
    icon: <LinkOffIcon fontSize="large" />,
  },
  CredentialsSignin: {
    title: 'Sign in failed',
    description:
      'The credentials were invalid. Double‑check your email and passkey, then try again.',
    actionLabel: 'Try again',
    actionHref: '/signin',
    tone: 'error',
    icon: <GppBadIcon fontSize="large" />,
  },
  AccessDenied: {
    title: 'Access denied',
    description:
      'Your account doesn’t have permission to access this resource. If you think this is a mistake, contact support or your institution admin.',
    actionLabel: 'Return to Dashboard',
    actionHref: '/dashboard',
    tone: 'error',
    icon: <LockPersonIcon fontSize="large" />,
  },
  Verification: {
    title: 'Verification failed or expired',
    description:
      'Your verification link may have expired or already been used. Request a new link and try again.',
    actionLabel: 'Back to Sign in',
    actionHref: '/signin',
    tone: 'warning',
    icon: <ReportGmailerrorredIcon fontSize="large" />,
  },
  SessionRequired: {
    title: 'Please sign in to continue',
    description:
      'You need to be signed in to access that page. Sign in and try again.',
    actionLabel: 'Sign in',
    actionHref: '/signin',
    tone: 'info',
    icon: <LockPersonIcon fontSize="large" />,
  },
  Callback: {
    title: 'Sign in callback error',
    description:
      'Something went wrong while completing the sign in. Please try again.',
    actionLabel: 'Back to Sign in',
    actionHref: '/signin',
    tone: 'error',
    icon: <ReportGmailerrorredIcon fontSize="large" />,
  },
  Configuration: {
    title: 'Configuration error',
    description:
      'Auth is not configured correctly. Please contact the administrator.',
    actionLabel: 'Back to Home',
    actionHref: '/',
    tone: 'error',
    icon: <ReportGmailerrorredIcon fontSize="large" />,
  },
  Default: {
    title: 'Authentication error',
    description:
      'Something unexpected happened. Please try again or contact support if the problem persists.',
    actionLabel: 'Back to Home',
    actionHref: '/',
    tone: 'error',
    icon: <HelpOutlineIcon fontSize="large" />,
  },
};

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const sp: SearchParams | undefined = searchParams
    ? await searchParams
    : undefined;
  const errorParam = toStringParam(sp?.error);
  const code = errorParam && MESSAGES[errorParam] ? errorParam : 'Default';
  const cfg = MESSAGES[code];

  return (
    <ErrorLayout
      icon={cfg.icon}
      title={cfg.title}
      description={cfg.description}
      actionLabel={cfg.actionLabel}
      actionHref={cfg.actionHref}
      tone={cfg.tone}
    />
  );
}
