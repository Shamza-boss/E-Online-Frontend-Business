// src/auth.ts
import NextAuth, { type Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Passkey from '@auth/core/providers/passkey';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/app/_lib/prisma';
const isDev = process.env.NODE_ENV === 'development';

const SESSION_MAX_AGE_SECONDS = 60 * 15; // 15 minutes hard session timeout

type ExtendedToken = JWT & {
  sessionIssuedAt?: number;
  sessionExpiresAt?: number;
};

const ORIGIN = (
  process.env.AUTH_URL ??
  process.env.NEXTAUTH_URL ??
  'http://localhost:3000'
).replace(/\/+$/, '');
const rpId = new URL(ORIGIN).hostname;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: 0,
  },
  debug: isDev,
  trustHost: true,
  experimental: { enableWebAuthn: true },
  // Route NextAuth UI to custom pages
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },

  providers: [
    Passkey({
      id: 'passkey',
      name: 'Passkey',
      relayingParty: { id: rpId, name: 'E-Online', origin: ORIGIN },

      async getUserInfo(_opts, request) {
        const url =
          request.url instanceof URL
            ? request.url
            : new URL(String(request.url));
        const email =
          url.searchParams.get('email') ??
          // @ts-ignore – defensive in case body/query is present in this runtime
          request?.body?.email ??
          // @ts-ignore
          request?.query?.email;

        if (!email) return null;

        const api = process.env.BASE_API_URL;
        if (!api) return null;

        try {
          const res = await fetch(`${api}/api/auth/resolve/${email}`, {
            cache: 'no-store',
          });
          if (!res.ok) return null;

          const u = await res.json();
          const name =
            [u.firstName, u.lastName].filter(Boolean).join(' ') || '';
          // Allow creation/linking locally; don’t return an id here.
          return {
            exists: false,
            user: {
              email: u.email,
              name,
              firstName: u.firstName ?? undefined,
              lastName: u.lastName ?? undefined,
              role: u.role ?? null,
              institutionId: u.institutionId ?? undefined,
              institutionName: u.institutionName ?? undefined,
            },
          } as const;
        } catch {
          return null;
        }
      },

      // Safe to keep on in dev only — prevents accidental duplicate links in prod
      // @ts-ignore
      allowDangerousEmailAccountLinking: true,
    }) as any,
  ],

  callbacks: {
    async jwt({ token, user }) {
      const extended = token as ExtendedToken;
      const nowSeconds = Math.floor(Date.now() / 1000);

      const api = process.env.BASE_API_URL;
      const email = user?.email ?? token.email;

      // Enrich if first login (user present), or any critical claim missing
      const needsEnrich =
        !!email &&
        (!!user ||
          token.userId == null ||
          token.role == null ||
          token.institutionName == null);

      if (api && needsEnrich) {
        const url = `${api}/api/auth/resolve/${email}`;
        try {
          const res = await fetch(url, { cache: 'no-store' });

          if (!res.ok) {
            console.warn('[auth][jwt] resolve failed', res.status, url);
          } else {
            const u = await res.json();
            // Accept multiple possible field spellings
            const institutionName =
              u.institutionName ?? u.inststitutionName ?? u.institution?.name;

            token.email = u.email ?? email;
            token.userId = u.userId ?? token.userId;
            token.appUserId = token.userId; // legacy support
            token.role = u.role ?? token.role ?? null;
            token.institutionId =
              u.institutionId ?? token.institutionId ?? null;
            token.firstName = u.firstName ?? token.firstName ?? undefined;
            token.lastName = u.lastName ?? token.lastName ?? undefined;
            token.institutionName =
              institutionName ??
              token.institutionName ??
              'Absolute Online PTY LTD';
          }
        } catch (e) {
          console.error('[auth][jwt] resolve error', e);
        }
      }
      if (user) {
        extended.sessionIssuedAt = nowSeconds;
        extended.sessionExpiresAt = nowSeconds + SESSION_MAX_AGE_SECONDS;
      } else {
        if (extended.sessionIssuedAt == null) {
          extended.sessionIssuedAt = nowSeconds;
        }
        if (extended.sessionExpiresAt == null) {
          extended.sessionExpiresAt =
            extended.sessionIssuedAt + SESSION_MAX_AGE_SECONDS;
        }
      }

      if (extended.sessionIssuedAt != null) {
        token.iat = extended.sessionIssuedAt;
      }
      if (extended.sessionExpiresAt != null) {
        token.exp = extended.sessionExpiresAt;
      }

      return token;
    },
    async session({ session, token }) {
      const t = token as ExtendedToken;
      if (session.user) {
        session.user.id =
          (t.userId ?? t.appUserId ?? t.sub) || session.user.id || '';
        if (t.userId || t.appUserId)
          session.user.userId = t.userId ?? t.appUserId;
        session.user.email = t.email || session.user.email || '';
        if (t.firstName) session.user.firstName = t.firstName;
        if (t.lastName) session.user.lastName = t.lastName;
        // Only assign role when it's not null/undefined to satisfy the strict UserRole type
        if (t.role != null)
          session.user.role = t.role as Session['user']['role'];
        if (t.institutionId) session.user.institutionId = t.institutionId;
        if (t.institutionName) session.user.institutionName = t.institutionName;
      }
      return session as Session;
    },
  },
});
