# Frontend Improvement Backlog

Prioritized opportunities based on current codebase state (mid RSC migration).

## P0 — Security & correctness

| Item | Why | Where |
|------|-----|-------|
| **Wire middleware** | `src/proxy.ts` has RBAC but no `middleware.ts` exports it — dashboard routes lack server-side auth gate | Create `src/middleware.ts` re-exporting `proxy` |
| **Align redirect targets** | Middleware sends unauthenticated users to `/`; fetch layers redirect to `/signin` | `src/proxy.ts`, `serverFetch.server.ts` |
| **Fix NextAuth types** | `session.accessToken` in types vs `apiAccessToken` at runtime | `next-auth.d.ts`, `auth.ts` |

## P1 — Architecture completion

| Item | Why | Where |
|------|-----|-------|
| **Finish RSC migration** | `/dashboard/courses` still client-fetches; inconsistent with dashboard/settings | `courses/page.tsx`, `Classes.tsx` |
| **Deduplicate data/actions** | `getAllAcademics` etc. exist in both `_lib/data` and `_lib/actions` | Merge reads into `data/`, actions call data or revalidate only |
| **Remove dead fetch modules** | `serverFetch.ts` (isomorphic) has zero consumers | Delete or document as deprecated |
| **Consolidate client fetch** | `clientFetch`, `proxyFetcher`, `swrFetcher` overlap | Single client proxy helper |
| **Add `.env.example`** | Onboarding friction | Repo root |

## P2 — UX & layout

| Item | Why | Where |
|------|-----|-------|
| **Audit scroll shells** | Pages using `dashboardPageRootSx` on scrollable content clip overflow | Billing, library, dashboard home review |
| **Mobile datagrid** | DataGrids need column hiding / card fallback on xs | Management, institutions, homework tables |
| **Reduce dashboard client boundary** | `dashboard/layout.tsx` is fully `'use client'` | Extract MathJax/date picker to leaf providers |
| **Double theme wrap** | `AppTheme` in both `providers.tsx` and `Dashboard.tsx` | Remove one layer |
| **Segment error boundaries** | Only `dashboard/error.tsx` exists | Add per-feature `error.tsx` where data-heavy |

## P3 — Component standards rollout

| Item | Why | Where |
|------|-----|-------|
| **Folder pattern migration** | ~50% adoption; monoliths remain (FormBuilderModal ~2k lines) | `manage-courses`, `library`, flat settings files |
| **Dead template cleanup** | Unused scaffold components | `HighlightedCard`, `ChartUserByCountry`, etc. |
| **Skeleton parity** | All routes should have 1:1 loading skeletons | Remaining segments without `loading.tsx` |

## P4 — Performance

| Item | Why | Where |
|------|-----|-------|
| **Cache tags on reads** | Many actions still use `revalidatePath` only | Academics, subjects, classrooms mutations |
| **Parallel server fetches** | Some pages await sequentially | Audit `page.tsx` files for `Promise.all` |
| **Bundle size** | Excalidraw, TipTap, PDF heavy | Dynamic `import()` on course/manage-courses routes |
| **SWR deduping** | Global config wired but per-hook keys inconsistent | `_lib/hooks/*` |

## P5 — Developer experience

| Item | Why | Where |
|------|-----|-------|
| **ESLint boundary rule** | Catch `server-only` imports in client graph at lint time | `eslint.config` custom rule |
| **API type generation** | Manual DTO sync with backend | OpenAPI client from backend Swagger |
| **E2E smoke tests** | No automated route coverage | Playwright for auth + dashboard load |
| **Rename dashboard typos** | `getInstitutionDashBoard` vs `getInstitutionDashboard` | `actions/dashboard.ts` |

## Suggested next PRs

1. Wire `middleware.ts` + unify auth redirects
2. RSC-migrate `/dashboard/courses` + dedupe academics/subjects data layer
3. Dynamic-import Excalidraw/PDF on course detail routes
4. ESLint rule: no `_lib/data` imports from `'use client'` files
