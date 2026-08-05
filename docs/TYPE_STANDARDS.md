# TypeScript Standards

Canonical typing rules for E-Online Frontend-Business. Aligned with the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

Related docs:

- [Component Standards](./COMPONENT_STANDARDS.md) — folder layout (`types.ts`)
- [Data Fetching Standards](./DATA_FETCHING_STANDARDS.md) — Server Action return types

## Principles

1. **`type` by default** — one convention for object shapes, props, DTOs, and unions
2. **No lazy `unknown` / `any`** — every value has a named type or is narrowed at a boundary
3. **Intentional nullability** — `| null` for backend nulls; `?` only when callers may omit a key
4. **Explicit function contracts** — exported functions declare return types; failures use unions or `Result`, not opaque throws

## `type` over `interface`

Use `type` for unions, tuples, primitives, mapped/conditional types, and all internal object shapes ([handbook comparison](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)).

**Exceptions (do not autofix):**

- `declare module '…' { interface … }` — required for module augmentation ([`next-auth.d.ts`](../next-auth.d.ts))
- Rare third-party `.d.ts` declaration merging

```ts
// Preferred
export type UserDto = {
  userId: string;
  email: string;
  role: UserRole | null;
};

// Union / discriminated union
export type ActionResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

### File naming

| Location | File |
|----------|------|
| Component folder | `types.ts` |
| Shared DTOs | `src/app/_lib/interfaces/types.ts` (path kept for `@/interfaces/*`; contents are `type`-only) |

## `unknown` — boundaries only

TypeScript requires `unknown | any` on catch bindings ([TS 4.4+](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html)). We use `unknown` and narrow immediately.

| Allowed | Not allowed |
|---------|-------------|
| `catch (error: unknown)` then narrow | `prevState: unknown` on Server Actions |
| Type-guard input: `function isX(v: unknown): v is X` | `Promise<unknown>` return types |
| Zod `.safeParse()` input before validation | `Record<string, unknown>` in app code |
| Adapter at a 3rd-party untyped API | `as unknown as` to silence errors |

**Approved narrowing:** [`src/lib/api/errors.ts`](../src/lib/api/errors.ts) — `isApiError`, `getErrorMessage`, `formatErrorForLog`.

```ts
try {
  await createUser(dto);
} catch (error: unknown) {
  return { status: 'error', message: getErrorMessage(error) };
}
```

## `undefined` and optionals

- **C# nullable** (`string?`) → `string | null` in TS
- **`?` optional property** → only when callers may legitimately omit the key
- **Do not** use `T | undefined` in public APIs when the value is always present or always null
- **Indexed access** — `arr[i]` is `T | undefined` (`noUncheckedIndexedAccess`)

## Function return types

- All **exported** functions: explicit return type
- **Server Actions:** discriminated union or Conform `SubmissionResult` — see [`actionState.ts`](../src/app/_lib/types/actionState.ts)
- **API helpers:** `Promise<Result<T, ApiError>>` or concrete `Promise<UserDto>` — never `Promise<unknown>`
- **Void mutations:** `Promise<void>`

```ts
import type { FormActionState } from '@/app/_lib/types/actionState';

export async function SubmitForm(
  _prev: FormActionState<UserDto> | null,
  formData: FormData,
): Promise<FormActionState<UserDto>> {
  const submission = parseWithZod(formData, { schema: registrationSchema });
  if (submission.status !== 'success') {
    return submission.reply();
  }
  // …
}
```

## Ban `any`

Use `any` only with `// @ts-expect-error` and a one-line justification (3rd-party gap). ESLint `@typescript-eslint/no-explicit-any` flags all other uses.

Prefer `JsonValue` / `JsonPrimitive` from [`src/lib/api/json.ts`](../src/lib/api/json.ts) over `Record<string, unknown>` for JSON-shaped data.

## Compiler options

[`tsconfig.json`](../tsconfig.json):

- `strict: true` (includes `useUnknownInCatchVariables`)
- `noUncheckedIndexedAccess`
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`

**Deferred:** `exactOptionalPropertyTypes` — high churn with MUI/React optional props.

## ESLint

[`eslint.config.mjs`](../eslint.config.mjs) enforces:

- `@typescript-eslint/consistent-type-definitions: type`
- `@typescript-eslint/no-explicit-any: error`
- `@typescript-eslint/consistent-type-imports: error`
- `@typescript-eslint/explicit-module-boundary-types: warn`

## Verification

After type changes:

```bash
npx tsc --noEmit
npm run build
npm run lint
```
