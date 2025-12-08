import type { Session } from 'next-auth';

export const AUTH_NOTICE_QUERY_KEY = 'authNotice';
const DEFAULT_FRIENDLY_NAME = 'Friend';

export function formatAlreadySignedInMessage(name: string) {
  return `${name} you are already signed in😅`;
}

export function getFriendlyNameFromSession(session: Session) {
  const { firstName, name, email } = session.user ?? {};
  return firstName || name || email || DEFAULT_FRIENDLY_NAME;
}

export function buildDashboardRedirectForSignedInUser(session: Session) {
  const friendlyName = getFriendlyNameFromSession(session);
  const params = new URLSearchParams({
    [AUTH_NOTICE_QUERY_KEY]: formatAlreadySignedInMessage(friendlyName),
  });
  return `/dashboard?${params.toString()}`;
}
