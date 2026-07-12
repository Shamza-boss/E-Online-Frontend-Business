---
name: e-online-frontend
description: Navigate E-Online Frontend-Business (Next.js 16 LMS), locate features by route, choose the correct data-fetch layer, and integrate with the ASP.NET backend. Use when working on dashboard pages, auth/proxy, Server Actions, component refactors, mobile layout, or onboarding to this codebase.
---

# E-Online Frontend Navigation

## Repositories

| Repo | Role |
|------|------|
| `E-Online-Frontend-Business` | Next.js 16 App Router UI (this repo) |
| `E-Online-Backend-Business` | ASP.NET Core minimal API (`E-Online-API/`) |

Backend base URL: `BASE_API_URL` (e.g. `http://localhost:5064`). All API calls target `{BASE_API_URL}/api/{endpoint}`.

## Quick navigation

### Find a feature by URL

| Route | Page file | Primary components |
|-------|-----------|-------------------|
| `/dashboard` | `src/app/dashboard/page.tsx` | `DashboardClient`, `MainGrid/` |
| `/dashboard/courses` | `dashboard/courses/page.tsx` | `courses/_components/Classes/` |
| `/dashboard/courses/[slug]` | `dashboard/courses/[slug]/page.tsx` | `courses/_components/Class/` |
| `/dashboard/manage-courses` | `dashboard/manage-courses/page.tsx` | `clientPage.tsx`, `manage-courses/_components/` |
| `/dashboard/management` | `dashboard/management/page.tsx` | `ManagementClient`, datagrids |
| `/dashboard/library` | `dashboard/library/page.tsx` | `library/_components/LibraryView/` |
| `/dashboard/institutions` | `dashboard/institutions/page.tsx` | `InstitutionsClient` |
| `/dashboard/billing` | `dashboard/billing/page.tsx` | `billing/_components/BillingExperience/` |
| `/dashboard/settings` | `dashboard/settings/page.tsx` | `settings/_components/SettingsExperience/` |
| `/signin`, `/signup` | `src/app/signin/`, `signup/` | Auth entry (passkey) |

Slug format for courses: `{classroomName}~{classroomId}` (URL-encoded).

### Find shared infrastructure

| Need | Path |
|------|------|
| Server Actions (mutations + client-callable reads) | `src/app/_lib/actions/` |
| Server-only cached reads (RSC pages) | `src/app/_lib/data/` |
| Server fetch (Bearer token) | `src/app/_lib/serverFetch.server.ts` |
| Client proxy fetch | `src/app/_lib/services/clientFetch.ts` |
| BFF proxy route | `src/app/api/proxy/[...proxy]/route.ts` |
| Auth (NextAuth + API JWT) | `src/auth.ts` |
| RBAC proxy (Next.js 16) | `src/proxy.ts` — active; redirects to `/signin` |
| Dashboard shell | `dashboard/_components/Dashboard/`, `layout.tsx` |
| Side nav + RBAC menu | `dashboard/_components/MenuContent/` |
| Layout tokens (padding/scroll) | `src/app/_lib/layout/dashboardPageLayout.ts` |
| Types | `src/app/_lib/interfaces/types.ts` |
| User roles | `src/app/_lib/Enums/UserRole.ts` |
| Engineering standards | `docs/TYPE_STANDARDS.md`, `docs/DATA_FETCHING_STANDARDS.md`, `docs/COMPONENT_STANDARDS.md`, `docs/OPENAPI_CLIENT.md` |

## Data-fetch decision tree

```
Need data?
├── Initial page load / SEO        → async page.tsx + _lib/data (cache())
├── Form submit / mutation         → _lib/actions ('use server')
├── Client refresh / optimistic    → SWR hook → Server Action fetcher
├── File download / webhook         → app/api route handler
└── Never                          → direct fetch to BASE_API_URL from browser
```

**Server/client boundary (build-critical):**
- `'use client'` imports pull the **entire dependency tree** into the client bundle
- `_lib/data/*` and `serverFetch.server.ts` → **server only** (`import 'server-only'`)
- Any module imported from a client file that hits the backend → **must** have `'use server'` at file top
- After changes: run `npm run build` to catch `server-only` leaks

## Page layout tokens

| Token | Use when |
|-------|----------|
| `dashboardScrollablePageSx` | Card grids, long pages (courses, manage-courses) — parent scrolls |
| `dashboardPageRootSx` | Full-height flex + internal scroll (management, settings tabs) |
| `dashboardScrollRegionSx` | Scrollable tab panel inside a flex shell |

See `docs/COMPONENT_STANDARDS.md` for mobile flex rules (`minWidth: 0`, one scroll parent).

## Component folder pattern

Reference: `src/app/dashboard/_components/MainGrid/`

```
FeatureName/
├── FeatureName.tsx   # composition only
├── constants.ts
├── utils.ts
├── elements.tsx      # styled MUI
├── types.ts
├── index.ts
└── components/       # optional nested
```

`_lib/` stays domain-grouped (`actions/`, `hooks/`, `data/`) — do not force the folder split there.

## Backend endpoint cheat sheet

Frontend actions map to `{BASE_API_URL}/api/...`:

| Domain | Backend prefix | Frontend module |
|--------|----------------|-----------------|
| Auth resolve | `GET /api/auth/resolve/{email}` | `auth.ts`, `api/auth/resolve/` |
| Users | `/api/users` | `actions/users.ts` |
| Institutions | `/api/institutions` | `actions/institutions.ts`, `data/institutions.ts` |
| Classrooms | `/api/classrooms` | `actions/classrooms.ts` |
| Dashboard | `/api/dashboard` | `data/dashboard.ts`, `actions/dashboard.ts` |
| Homework | `/api/homework` | `actions/homework.ts` |
| Notes | `/api/notes` | `actions/notes.ts` |
| Storage / library | `/api/storage` | `actions/storage.ts` |
| Stream video | `/api/stream` | `actions/stream.ts` |
| Subjects | `/api/subjects` | `data/subjects.ts`, `actions/subjects.ts` |
| Academic levels | `/api/academiclevel` | `data/academics.ts`, `actions/academics.ts` |
| Settings | `/api/settings/me` | `data/settings.ts`, `actions/settings.ts` |
| Billing | `/api/subscriptions`, `/api/invoices` | `actions/subscriptions.ts`, `actions/invoices.ts` |

Role enum alignment: frontend `UserRole` must match backend `UserRole` integers.

## Auth + API token flow

1. User signs in via **passkey** (NextAuth, `src/auth.ts`)
2. NextAuth calls `GET {BASE_API_URL}/api/auth/resolve/{email}` (public)
3. JWT callback mints `session.apiAccessToken` (HS256, 15m, signed with `AUTH_SECRET`)
4. Claims: `userId`, `role`, `institutionId`
5. Server Actions / `serverFetch.server` attach `Authorization: Bearer {apiAccessToken}`
6. Client components call `/api/proxy/...` → proxy reads session cookie → forwards with same Bearer token
7. Backend validates JWT with same `AUTH_SECRET` / `NEXTAUTH_SECRET`

## Common tasks

### Add a new dashboard page with server data

1. Create `_lib/data/{feature}.ts` with `import 'server-only'` + `cache()` + `serverFetch.server`
2. Create async `page.tsx` that prefetches and passes `initialData` to a client island
3. Add `loading.tsx` using a skeleton from `dashboard/_components/_skeletonLoaders/`
4. Use `dashboardScrollablePageSx` or `dashboardPageRootSx` per content type
5. Add menu entry in `MenuContent/` with `hasRouteAccess` rule
6. Add RBAC rule to `src/proxy.ts` if route is role-restricted

### Add a mutation

1. Add function to `_lib/actions/{domain}.ts` with `'use server'`
2. Use `serverFetch.server` for the HTTP call
3. Declare explicit return type (`Promise<void>` or concrete DTO) — see `docs/TYPE_STANDARDS.md`
3. Call `revalidatePath` or `revalidateTag` after success
4. Invoke from client via form action, `useTransition`, or SWR `mutate`

### Debug API failures

1. Check `BASE_API_URL` in `.env.local`
2. Server: trace `serverFetch.server.ts` — 401 redirects to `/signin`
3. Client: trace `/api/proxy/[...proxy]/route.ts` — returns 401 if no session
4. Compare endpoint path casing (ASP.NET is case-insensitive)
5. Verify role: billing/invoices require PlatformAdmin on backend

## Verification checklist

- [ ] `npm run build` passes (catches server/client boundary errors)
- [ ] No `'use client'` file imports `_lib/data` or `serverFetch.server`
- [ ] Scrollable pages use `dashboardScrollablePageSx`, not `dashboardPageRootSx`
- [ ] New components follow `MainGrid/` folder pattern
- [ ] Standards docs updated if patterns change

## Additional resources

- Full architecture + backend integration: [ARCHITECTURE.md](ARCHITECTURE.md)
- Prioritized improvement backlog: [IMPROVEMENTS.md](IMPROVEMENTS.md)
- Data fetching rules: `docs/DATA_FETCHING_STANDARDS.md`
- Component rules: `docs/COMPONENT_STANDARDS.md`
