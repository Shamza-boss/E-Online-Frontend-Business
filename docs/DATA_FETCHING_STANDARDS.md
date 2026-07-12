# Data Fetching Standards

## Decision tree

```
Need data?
├── Initial page load / SEO content     → Server Component + _lib/data (cache())
├── Form submit / mutation              → Server Action ('use server')
├── File download / webhook / external  → Route Handler (app/api/...)
├── Live refresh / optimistic update    → SWR hook (client island)
└── Never                               → Direct client fetch to BASE_API_URL
```

Client reads must go through `/api/proxy` via `clientFetch` when SWR is required.

## Server/Client module boundaries

Next.js treats the **entire import graph** of a `'use client'` file as client bundle code. If any ancestor of that graph imports `server-only`, `auth()`, or `BASE_API_URL`, the build fails (environment poisoning prevention).

```
'use client' component
  └── imports ENTIRE dependency tree into client bundle
        └── server-only / auth() / BASE_API_URL = BUILD ERROR
```

### Three allowed fetch layers

| Layer | File | Import from | Mechanism |
|-------|------|-------------|-----------|
| Server reads (RSC pages) | `_lib/data/*.ts` | `page.tsx` only | `import 'server-only'` + `cache()` + `serverFetch.server` |
| Server mutations + client-callable reads | `_lib/actions/*.ts` | Client components, hooks, forms | **Must** have `'use server'` at file top; reads may delegate to `_lib/data` |
| Client proxy fetch (legacy SWR only) | `clientFetch.ts` / `proxyFetcher` | Avoid for new code; prefer Server Actions | `/api/proxy` |

### Do / don't

- **Do:** prefetch on server in `page.tsx`, pass serializable `initialData` to client islands
- **Do:** use `'use server'` on any module imported by a `'use client'` file that touches the backend
- **Do:** add `import 'server-only'` to `_lib/data/*`, `serverFetch.server.ts`, and server-only services (e.g. `paginationService.ts`)
- **Don't:** import `_lib/data/*` from hooks, client components, or SWR modules
- **Don't:** import `serverFetch.server.ts` from modules without `'use server'`
- **Don't:** bulk-replace `serverFetch` imports without checking the client import graph

### Verification checklist

After any change to `_lib/actions`, `_lib/data`, or `serverFetch*`:

1. `npm run build` — must pass (catches `server-only` leaks)
2. Grep: client files (`'use client'`) must not import `_lib/data` or `serverFetch.server`
3. Every `actions/*.ts` imported from a client file must start with `'use server'`

## Mutations

Mutations live in `_lib/actions/*.ts` with `'use server'`. Return explicit types — never `Promise<unknown>`. Form actions use discriminated unions from `_lib/types/actionState.ts`. See [TypeScript Standards](./TYPE_STANDARDS.md).

## Layer responsibilities

| Layer | Path | Role |
|-------|------|------|
| Server reads | `_lib/data/*.ts` | `cache()`-wrapped functions, `import 'server-only'` |
| Server fetch | `_lib/serverFetch.server.ts` | Authenticated backend calls (server only) |
| Client fetch | `_lib/services/clientFetch.ts` / `_lib/config/swr.ts` | Proxy-routed client calls |
| Mutations | `_lib/actions/*.ts` | `'use server'` + `revalidateTag` / `revalidatePath` |
| Client cache | `_lib/hooks/*.ts` | SWR for interactive/live data |

## Server page pattern (default)

```tsx
// app/dashboard/page.tsx — Server Component
import { auth } from '@/auth';
import { getInstitutionDashboard, getPlatformOwnerDashboard } from '@/app/_lib/data/dashboard';
import { normalizeRole } from '@/app/dashboard/_components/MainGrid/utils';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  const role = normalizeRole(session?.user?.role);
  const data =
    role === UserRole.PlatformAdmin
      ? await getPlatformOwnerDashboard()
      : await getInstitutionDashboard();

  return <DashboardClient role={role} initialData={data} />;
}
```

```tsx
// DashboardClient.tsx — Client island
'use client';
export default function DashboardClient({ role, initialData }) {
  // Use initialData directly; optional SWR with fallbackData for refresh
  return role === UserRole.PlatformAdmin
    ? <PlatformOwnerDashboard initialData={initialData} />
    : <InstitutionMainGrid initialData={initialData} />;
}
```

## Before / after: dashboard home

**Before:** `page.tsx` renders `<MainGrid />` → client `useSession` + `useInstitutionDashboard()` → proxy round-trip → spinner.

**After:** `page.tsx` fetches on server → passes `initialData` → charts render on first paint.

## Caching

- Wrap read functions in React `cache()` for per-request deduplication
- Use `tags` on server fetch for lookup data (academics, subjects, classrooms)
- Call `revalidateTag('tag')` in create/update Server Actions
- Use `revalidatePath('/dashboard/settings')` for page-scoped invalidation

## SWR (when to keep)

- Optimistic updates (notes, inline edits)
- Polling / focus revalidation after mutations
- Heavy interactive views where server prefetch is not enough

Pass `fallbackData: initialData` from server props when using SWR on the same key.

## Route handlers

Use **only** for:

- `/api/proxy` (BFF gateway)
- Auth (`/api/auth/*`)
- PDF/binary downloads
- Webhooks

Avoid duplicate route handlers when a Server Action already covers the mutation.

## Error and loading boundaries

- `loading.tsx` per segment for skeleton UI
- `error.tsx` for recoverable errors
- `global-error.tsx` for root fallback

## Global SWR config

`swrConfig` from `_lib/config/swr.ts` is wired in `providers.tsx` via `<SWRConfig>`.
