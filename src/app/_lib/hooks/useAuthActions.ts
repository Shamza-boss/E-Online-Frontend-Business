'use client';
import { signIn, signOut } from 'next-auth/react';
import { signIn as passkeySignIn } from 'next-auth/webauthn';
import { useRouter } from 'next/navigation';

interface Credentials {
  email: string;
  password: string;
}

interface PasskeyRegisterParams {
  email: string; // username
  firstName?: string;
  lastName?: string;
  name?: string; // optional explicit display name
  callbackUrl?: string; // where to go after successful creation
  redirect?: boolean; // default false so caller can handle errors
}

export default function useAuthActions() {
  const router = useRouter();

  /**
   * Generic sign-in helper.
   * If provider omitted (or 'passkey'), uses WebAuthn passkey flow.
   * Keep optional support for 'credentials' if added later.
   */
  const handleSignIn = async (
    provider: string = 'passkey',
    callbackUrl: string = '/dashboard',
    credentials?: Credentials
  ) => {
    if (provider === 'passkey') {
      return handlePasskeySignIn(callbackUrl);
    }

    if (provider === 'credentials') {
      if (!credentials?.email || !credentials?.password) {
        throw new Error(
          'Email and password are required for credentials sign-in.'
        );
      }
      const result = (await signIn(provider, {
        email: credentials.email,
        password: credentials.password,
        callbackUrl,
        redirect: false,
      })) as unknown as
        | { ok?: boolean; error?: string; url?: string }
        | undefined;
      if (!result?.ok) {
        console.error('Sign-in failed:', result?.error);
        throw new Error(result?.error || 'Sign-in failed');
      }
      if (result.url) router.push(result.url);
      return;
    }

    throw new Error(
      `Unsupported provider '${provider}'. Use 'passkey' or add the provider configuration first.`
    );
  };

  // Existing user authenticates with a registered passkey
  const handlePasskeySignIn = async (callbackUrl: string = '/dashboard') => {
    const result = (await passkeySignIn('passkey', {
      redirect: false as false,
      callbackUrl,
    })) as unknown as
      | { ok?: boolean; error?: string; url?: string }
      | undefined;
    if (!result?.ok) {
      console.error('Passkey sign-in failed:', result?.error);
      throw new Error(result?.error || 'Passkey sign-in failed');
    }
    if (result.url) router.push(result.url);
  };

  // Register a new passkey for the (current or new) user
  const handlePasskeyRegister = async ({
    email,
    firstName,
    lastName,
    name,
    callbackUrl = '/post-signin?registered=1',
    redirect = false,
  }: PasskeyRegisterParams) => {
    if (!email) throw new Error('email is required for passkey registration');
    const displayName =
      name || [firstName, lastName].filter(Boolean).join(' ').trim() || email;

    let result: { ok?: boolean; error?: string; url?: string } | undefined;
    if (redirect) {
      // Fire-and-forget variant (no result returned when redirect:true)
      await passkeySignIn('passkey', {
        action: 'register',
        username: email,
        name: displayName,
        callbackUrl,
        redirect: true,
      });
      return; // browser will navigate
    } else {
      result = (await passkeySignIn('passkey', {
        action: 'register',
        username: email,
        name: displayName,
        callbackUrl,
        redirect: false,
      })) as unknown as
        | { ok?: boolean; error?: string; url?: string }
        | undefined;
    }
    if (!result?.ok) {
      console.error('Passkey registration failed:', result?.error);
      throw new Error(result?.error || 'Passkey registration failed');
    }
    if (result.url) router.push(result.url);
  };

  const handleSignOut = async (callbackUrl: string = '/') => {
    const result = await signOut({ redirect: false, callbackUrl });
    if (result.url) router.push(result.url);
  };

  return {
    handleSignIn,
    handlePasskeySignIn,
    handlePasskeyRegister,
    handleSignOut,
  };
}
