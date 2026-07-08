import { signIn as passkeySignIn } from 'next-auth/webauthn';
import type { ResolvedUser, ShowAlertFn } from './interfaces';
import { SIGN_IN_CALLBACK_URL } from './constants';

export const normalizeEmail = (email: string): string =>
  (email ?? '').trim().toLowerCase();

export const getInstitutionInactiveMessage = (
  resolvedUser: ResolvedUser,
  normalizedEmail: string,
): string => {
  const primaryAdminEmail =
    resolvedUser?.primaryAdminEmail ?? resolvedUser?.PrimaryAdminEmail ?? null;
  const isPrimaryAdmin =
    typeof primaryAdminEmail === 'string' &&
    primaryAdminEmail.trim().toLowerCase() === normalizedEmail;

  return isPrimaryAdmin
    ? 'Your institution is inactive. Please contact AbsoluteOnline for assistance.'
    : 'Your institution is inactive. Please contact your institution administrator.';
};

export async function submitSignIn(
  email: string,
  showAlert: ShowAlertFn,
): Promise<void> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    showAlert('error', 'Please enter your email');
    return;
  }

  const existsRes = await fetch(`/api/auth/resolve/${normalizedEmail}`, {
    cache: 'no-store',
  });

  if (existsRes.status === 404) {
    showAlert(
      'error',
      'No account found. Please contact your institution administrator.',
    );
    return;
  }
  if (!existsRes.ok) {
    showAlert('error', 'Unable to verify your account. Try again.');
    return;
  }

  const resolvedUser: ResolvedUser = await existsRes.json();
  const isInstitutionActive =
    resolvedUser?.isInstitutionActive ??
    resolvedUser?.IsInstitutionActive ??
    true;

  if (!isInstitutionActive) {
    showAlert('error', getInstitutionInactiveMessage(resolvedUser, normalizedEmail));
    return;
  }

  const hp = await fetch(
    `/api/auth/has-passkey?email=${encodeURIComponent(normalizedEmail)}`,
    { cache: 'no-store' },
  ).then((r) => r.json());

  if (!hp.existsInPrisma || !hp.hasPasskey) {
    showAlert(
      'info',
      'First time with this account. Please complete registration.',
    );
    window.location.href = `/signup?email=${encodeURIComponent(normalizedEmail)}`;
    return;
  }

  await passkeySignIn(
    'passkey',
    { redirect: true, callbackUrl: SIGN_IN_CALLBACK_URL },
    { email: normalizedEmail },
  );
}
