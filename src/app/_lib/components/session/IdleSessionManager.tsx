'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { signIn as passkeySignIn } from 'next-auth/webauthn';
import { signOut as nextSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const DEFAULT_IDLE_MS = 15 * 60 * 1000; // 15 minutes
const EVENTS = [
  'mousemove',
  'keydown',
  'scroll',
  'click',
  'touchstart',
] as const;

type SignInResult = {
  ok?: boolean;
  url?: string | null;
  error?: string | null;
  status?: number;
};

function isSignInResult(value: unknown): value is SignInResult {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return 'ok' in v || 'url' in v || 'error' in v || 'status' in v;
}

export default function IdleSessionManager({
  idleMs = DEFAULT_IDLE_MS,
}: {
  idleMs?: number;
}) {
  const { status } = useSession();
  const router = useRouter();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasSignedOutByIdle = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      try {
        clearTimeout(timerRef.current);
      } finally {
        timerRef.current = null;
      }
    }
  }, []);

  const schedule = useCallback(() => {
    clearTimer();
    const id = setTimeout(async () => {
      // Ignore if this callback is from an older timer
      if (timerRef.current !== id) return;
      // Clear the active timer before proceeding to avoid overlapping actions
      clearTimer();
      if (status === 'authenticated') {
        try {
          wasSignedOutByIdle.current = true;
          await nextSignOut({ redirect: false });
        } catch (err) {
          console.error('Idle sign-out failed', err);
        }
      }
    }, idleMs);
    timerRef.current = id;
  }, [clearTimer, idleMs, status]);

  const onActivity = useCallback(async () => {
    if (status === 'authenticated') {
      schedule();
      return;
    }
    if (!wasSignedOutByIdle.current) return;
    try {
      if (typeof window === 'undefined') return;
      const { pathname, search, hash } = window.location;
      const currentUrl = `${pathname}${search}${hash}`;
      const raw = await passkeySignIn('passkey', {
        redirect: false,
        callbackUrl: currentUrl,
      });
      if (isSignInResult(raw) && raw.ok && raw.url) {
        router.replace(raw.url);
      } else {
        wasSignedOutByIdle.current = false;
      }
    } catch (err) {
      wasSignedOutByIdle.current = false;
    }
  }, [status, schedule, router]);

  // Attach activity listeners once
  useEffect(() => {
    EVENTS.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true })
    );
    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [onActivity]);

  // Manage timer only when authenticated
  useEffect(() => {
    if (status !== 'authenticated') {
      clearTimer();
      return;
    }
    schedule();
    return () => clearTimer();
  }, [status, schedule, clearTimer]);

  return null;
}
