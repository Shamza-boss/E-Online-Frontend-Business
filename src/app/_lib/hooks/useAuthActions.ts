'use client';
import { signIn, signOut } from 'next-auth/react';
import { signIn as passkeySignIn } from 'next-auth/webauthn';
import { useRouter } from 'next/navigation';

type Credentials = {
  email: string;
  password: string;
};

type PasskeyRegisterParams = {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  callbackUrl?: string;
  redirect?: boolean;
};

type SignInResult = {
  ok?: boolean;
  error?: string;
  url?: string;
};

function pushRoute(router: ReturnType<typeof useRouter>, url: string): void {
  (router.push as (href: string) => void)(url);
}

export default function useAuthActions() {
  const router = useRouter();

  const handleSignIn = async (
    provider: string = 'passkey',
    callbackUrl: string = '/dashboard',
    credentials?: Credentials,
  ): Promise<void> => {
    if (provider === 'passkey') {
      return handlePasskeySignIn(callbackUrl);
    }

    if (provider === 'credentials') {
      if (!credentials?.email || !credentials?.password) {
        throw new Error(
          'Email and password are required for credentials sign-in.',
        );
      }
      const result = (await signIn(provider, {
        email: credentials.email,
        password: credentials.password,
        callbackUrl,
        redirect: false,
      })) as SignInResult | undefined;
      if (!result?.ok) {
        console.error('Sign-in failed:', result?.error);
        throw new Error(result?.error || 'Sign-in failed');
      }
      if (result.url) pushRoute(router, result.url);
      return;
    }

    throw new Error(
      `Unsupported provider '${provider}'. Use 'passkey' or add the provider configuration first.`,
    );
  };

  const handlePasskeySignIn = async (
    callbackUrl: string = '/dashboard',
  ): Promise<void> => {
    const result = (await passkeySignIn('passkey', {
      redirect: false as const,
      callbackUrl,
    })) as SignInResult | undefined;
    if (!result?.ok) {
      console.error('Passkey sign-in failed:', result?.error);
      throw new Error(result?.error || 'Passkey sign-in failed');
    }
    if (result.url) pushRoute(router, result.url);
  };

  const handlePasskeyRegister = async ({
    email,
    firstName,
    lastName,
    name,
    callbackUrl = '/post-signin?registered=1',
    redirect = false,
  }: PasskeyRegisterParams): Promise<void> => {
    if (!email) throw new Error('email is required for passkey registration');
    const displayName =
      name || [firstName, lastName].filter(Boolean).join(' ').trim() || email;

    if (redirect) {
      await passkeySignIn('passkey', {
        action: 'register',
        username: email,
        name: displayName,
        callbackUrl,
        redirect: true,
      });
      return;
    }

    const result = (await passkeySignIn('passkey', {
      action: 'register',
      username: email,
      name: displayName,
      callbackUrl,
      redirect: false,
    })) as SignInResult | undefined;

    if (!result?.ok) {
      console.error('Passkey registration failed:', result?.error);
      throw new Error(result?.error || 'Passkey registration failed');
    }
    if (result.url) pushRoute(router, result.url);
  };

  const handleSignOut = async (callbackUrl: string = '/'): Promise<void> => {
    const result = await signOut({ redirect: false, callbackUrl });
    if (result.url) pushRoute(router, result.url);
  };

  return {
    handleSignIn,
    handlePasskeySignIn,
    handlePasskeyRegister,
    handleSignOut,
  };
}
