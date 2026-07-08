import { signIn } from 'next-auth/webauthn';
import { Messages } from '@/app/_lib/interfaces/Auth/Messages';
import type { ShowAlertFn } from './interfaces';
import { SIGN_UP_CALLBACK_URL } from './constants';

export const normalizeEmail = (email: string): string =>
  (email ?? '').trim().toLowerCase();

export async function submitSignUp(
  email: string,
  showAlert: ShowAlertFn,
): Promise<void> {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    showAlert('error', 'Please enter your email');
    return;
  }

  const res = await fetch(
    `/api/auth/resolve/${encodeURIComponent(normalized)}`,
    { cache: 'no-store' },
  );

  if (res.status === 404) {
    showAlert(
      'error',
      'We could not find an account for that email. Please contact your administrator.',
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
    callbackUrl: SIGN_UP_CALLBACK_URL,
    action: 'register',
    email: normalized,
    name,
  } as unknown as Parameters<typeof signIn>[1]);

  showAlert(
    'info',
    'Passkey dialog was closed. You can create a passkey later from Settings.',
  );
}

export function getSignUpErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return (
    Messages?.error?.generic ??
    'Something went wrong. Please contact support or your administrator.'
  );
}
