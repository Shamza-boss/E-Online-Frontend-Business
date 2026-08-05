# OpenAPI client types

TypeScript types for the ASP.NET API are generated from the OpenAPI contract — not hand-synced DTO copies.

## Source of truth

| Layer | Location |
|-------|----------|
| Authoritative contract | Backend `E-Online-Backend-Business/contracts/openapi.v1.json` |
| Vendored copy (this repo) | `contracts/openapi.v1.json` |
| Generated types | `src/app/_lib/api/generated/schema.d.ts` |
| App aliases | `src/app/_lib/api/schemas.ts` |

Backend ownership and export/check scripts: sibling repo `docs/API_CONTRACT.md`.

## Generate

From the frontend repo (prefers sibling backend contract when present):

```bash
npm run generate:api-types
```

Resolution order:

1. `OPENAPI_SPEC_PATH` (file)
2. `../E-Online-Backend-Business/contracts/openapi.v1.json`
3. `./contracts/openapi.v1.json` (vendored)
4. `OPENAPI_SPEC_URL` or `{BASE_API_URL}/swagger/v1/swagger.json`

When generating from the sibling (or an explicit path), the script also refreshes `contracts/openapi.v1.json`.

`AppDto<SchemaName>` in `schemas.ts` deep-requires properties (Swashbuckle marks most as optional) while still deriving names/types from the generated schema.

Commit both the vendored JSON and `schema.d.ts` after API contract changes.

## Using types

Prefer aliases from `schemas.ts` (keeps FE names stable where needed):

```ts
import type { SystemAdminDashboardDto } from '@/app/_lib/api/schemas';
```

Or path-level responses:

```ts
import type { paths } from '@/app/_lib/api/generated/schema';

type InstitutionDashboard =
  paths['/api/dashboard/institution']['get']['responses'][200]['content']['application/json'];
```

Wire types at `_lib/data` / `_lib/actions` boundaries. Keep Zod/Conform for forms.

## Workflow after a backend API change

1. Backend: export + commit `contracts/openapi.v1.json` (`scripts/export-openapi.ps1`).
2. Frontend: `npm run generate:api-types` (with sibling repo checked out next to this one).
3. Fix any TypeScript breakages; ship FE PR with vendored contract + generated types.
