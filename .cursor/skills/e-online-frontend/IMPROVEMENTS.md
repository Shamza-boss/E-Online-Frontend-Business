# Frontend Improvement Backlog

Prioritized opportunities based on current codebase state (mid RSC migration).

## P0 — Security & correctness ✅ (done)

| Item | Status | Notes |
|------|--------|-------|
| ~~**Wire middleware**~~ | ✅ Done | Next.js 16 uses `src/proxy.ts` (exports `proxy` + `config.matcher`) — build shows `ƒ Proxy (Middleware)` |
| ~~**Align redirect targets**~~ | ✅ Done | `proxy.ts` now redirects unauthenticated/invalid-role users to `/signin` with `callbackUrl` (matches `serverFetch.server.ts`) |
| ~~**Fix NextAuth types**~~ | ✅ Done | Removed duplicate `interfaces/Auth/next-auth.d.ts` (`accessToken`); canonical types in root `next-auth.d.ts` (`apiAccessToken`) |

## P1 — Architecture completion ✅ (done)

| Item | Why | Where |
|------|-----|-------|
| ~~**Type standards rollout**~~ | ✅ Done | `docs/TYPE_STANDARDS.md`, `tsconfig` + ESLint, `actionState.ts`, `interfaces.ts` → `types.ts`, hotspot cleanup |
| ~~**Finish RSC migration**~~ | ✅ Done | Courses / manage-courses / library / slug pages prefetch via `_lib/data` |
| ~~**Deduplicate data/actions**~~ | ✅ Done | Academics, subjects, classrooms reads live in `_lib/data`; actions delegate for SWR |
| ~~**Remove dead fetch modules**~~ | ✅ Done | Deleted unused isomorphic `serverFetch.ts` |
| ~~**Consolidate client fetch**~~ | ✅ Done | Single `clientFetch`; `swrFetcher`/`proxyFetcher`/`createProxyFetcher` wrap it |
| ~~**Add `.env.example`~~ | ✅ Done | Repo root |

## P2 — UX & layout ✅ (done)

| Item | Why | Where |
|------|-----|-------|
| ~~**Audit scroll shells**~~ | ✅ Done | Documented shell tokens; management/institutions use `dashboardPageRootSx` + `dashboardFlexBodySx`; billing/courses stay scrollable |
| ~~**Mobile datagrid**~~ | ✅ Done | `EDataGrid.mobileHiddenFields` hides secondary columns on `sm`; wired on management + institutions grids |
| ~~**Reduce dashboard client boundary**~~ | ✅ Done | MathJax/date pickers extracted to leaf providers; dashboard layout no longer wraps them |
| ~~**Double theme wrap**~~ | ✅ Done | Root `providers` owns `AppTheme` + MUI X; Dashboard shell no longer nests another |
| ~~**Segment error boundaries**~~ | ✅ Done | Shared `SegmentError` + `error.tsx` on courses, manage-courses, management, institutions, billing, library |

## P3 — Component standards rollout ✅ (done)

| Item | Why | Where |
|------|-----|-------|
| ~~**Folder pattern migration**~~ | ✅ Done | FormBuilderModal → `useFormBuilderDraft`; QuestionEditorPanel DnD → `useQuestionEditorDnD` (~851 → ~534 lines) |
| ~~**Dead template cleanup**~~ | ✅ Done | Removed unused scaffold: `CardAlert`, `ChartUserByCountry`, `CustomDatePicker`, `CustomizedTreeView`, `HighlightedCard`, `SelectContent`, `internals/` |
| ~~**Skeleton parity**~~ | ✅ Done | All main dashboard segments already have `loading.tsx` |

## P4 — Performance ✅ (mostly done)

| Item | Why | Where |
|------|-----|-------|
| ~~**Cache tags on reads**~~ | ✅ Done | Academics/subjects/classrooms mutations call `updateTag` + `revalidatePath` |
| ~~**Parallel server fetches**~~ | ✅ Done | Management + manage-courses slug already `Promise.all`; billing stays sequential (depends on first institution); pages audited |
| ~~**Bundle size**~~ | ✅ Done | PDF via `next/dynamic` barrel; Excalidraw CSS moved off root layout into Excalidraw components |
| ~~**SWR deduping**~~ | ✅ Done | Canonical `swrKeys` in `_lib/config/swrKeys.ts`; academics/subjects shared across library + management |

## P5 — Developer experience ✅ (done)

| Item | Why | Where |
|------|-----|-------|
| ~~**ESLint boundary rule**~~ | ✅ Done | `no-restricted-imports` blocks `_lib/data` from hooks/components/client modules |
| ~~**API type generation**~~ | ✅ Contract flow | Backend `contracts/openapi.v1.json` + FE `npm run generate:api-types` → `_lib/api/generated/` + `_lib/api/schemas.ts`; dashboard DTOs wired |
| ~~**E2E smoke tests**~~ | ✅ Done | Playwright: `e2e/smoke.spec.ts` (signin load + unauth `/dashboard` → `/signin`); `npm run test:e2e` |
| ~~**Rename dashboard typos**~~ | ✅ Done | `getSystemAdminDashboard` / `getInstitutionDashboard` (removed `DashBoard` casing) |

## Suggested next PRs

1. Map more `_lib/data` / actions modules onto `_lib/api/schemas` (classrooms, library, billing)
2. Optional CI job for Playwright smoke against preview
3. Further leaf splits in FormBuilder review/tree handlers if those files grow again
