# OpenAPI client generation (spike)

Generate TypeScript types from the ASP.NET Swagger document instead of hand-syncing DTOs.

## Source of truth

Backend Swashbuckle serves:

- UI: `{BASE_API_URL}/swagger`
- Spec: `{BASE_API_URL}/swagger/v1/swagger.json`

Local default from `.env.example`: `http://localhost:5064`.

## Recommended tool

[`openapi-typescript`](https://github.com/openapi-ts/openapi-typescript) — types only (no runtime client). Fits the existing `serverFetch` / `clientFetch` layers.

Alternative later: [orval](https://orval.dev/) if you want generated fetchers + React Query/SWR hooks.

## Generate

1. Start the backend so Swagger is reachable.
2. From the frontend repo:

```bash
npm run generate:api-types
```

This writes `src/app/_lib/api/generated/schema.d.ts`.

Override the spec URL:

```bash
OPENAPI_SPEC_URL=https://api.example.com/swagger/v1/swagger.json npm run generate:api-types
```

## Adoption path (incremental)

1. Generate `schema.d.ts` and keep it out of day-to-day edits (regenerate on API changes).
2. Map hot endpoints first — e.g. dashboard, subjects, classrooms — by importing `paths` / `components['schemas']` into `_lib/data` return types.
3. Do **not** replace `serverFetch` wholesale; wrap typed responses at the boundary:

```ts
import type { paths } from '@/app/_lib/api/generated/schema';

type InstitutionDashboard =
  paths['/api/dashboard/institution']['get']['responses'][200]['content']['application/json'];
```

(Adjust path keys to match the actual Swagger document.)

4. Keep Zod/Conform schemas for forms; OpenAPI types cover API wire shapes.

## Out of scope for this spike

- Committing generated output until the first consumer is wired
- Auth scheme codegen (Bearer is already handled by NextAuth + fetch wrappers)
- Breaking rename of existing `_lib/interfaces/types.ts` in one PR
