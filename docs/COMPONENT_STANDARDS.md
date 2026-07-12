# Component Standards

Reference implementation: [`src/app/dashboard/_components/MainGrid/`](../src/app/dashboard/_components/MainGrid/)

## Folder template

Every feature component lives in its own folder:

```
ComponentName/
├── ComponentName.tsx   # Composition only — hooks, layout, child assembly
├── constants.ts        # Labels, config, static copy
├── utils.ts            # Pure transforms, formatters, access rules
├── elements.tsx        # Styled MUI primitives
├── types.ts            # Props/types (when non-trivial)
├── index.ts            # Barrel: export { default } from './ComponentName'
└── components/         # Optional nested children (large features)
```

Use `utils.tsx` when helpers return JSX (charts, icons).

## Responsibilities

| File | Put here | Do not put here |
|------|----------|-----------------|
| `ComponentName.tsx` | Orchestration, hooks, JSX composition | Styled components, magic strings, pure logic |
| `constants.ts` | Strings, numeric config, route lists | React components |
| `utils.ts` | Pure functions, data mapping | Side effects, fetch calls |
| `elements.tsx` | `styled()` MUI wrappers | Business logic |
| `types.ts` | Props, local types | Implementation |

## Naming

- Folders and main files: **PascalCase** (`BillingOverviewCard/`)
- Utils/constants: **camelCase** exports
- Avoid flat `.tsx` files directly under `_components/` — always use a folder + `index.ts`

## When to split

- Main component file **>200 lines** → extract sub-components into `components/`
- **>3 styled primitives** → move to `elements.tsx`
- **>5 magic strings** → move to `constants.ts`
- **Reusable pure logic** → `utils.ts`; promote to `_lib/utils/` only when used in 2+ features

## Client vs server boundaries

- Default pages to **Server Components** (no `'use client'`)
- Add `'use client'` only on the **leaf** that needs state, effects, or browser APIs
- Pass **serializable props** from server parents to client children (no functions from server except Server Actions)
- See [Data Fetching Standards — Server/Client module boundaries](./DATA_FETCHING_STANDARDS.md#serverclient-module-boundaries) for fetch-layer rules, import-graph constraints, and build verification
- See [TypeScript Standards](./TYPE_STANDARDS.md) for `type`-over-`interface`, nullability, and Server Action return types

## `_lib` vs feature components

| Location | Use for |
|----------|---------|
| `src/app/<feature>/_components/` | Feature-specific UI |
| `src/app/_lib/components/` | Shared UI used across 2+ features |
| `src/app/_lib/actions/` | Server Actions (mutations) |
| `src/app/_lib/data/` | Server-only cached reads |
| `src/app/_lib/hooks/` | Client hooks (SWR, UI state) |

Do **not** force `_lib` modules into the `elements/constants/utils` split — keep domain grouping there.

## Nested composition

Large features (e.g. `Class/`) may nest child folders:

```
Class/
├── ClassComponent.tsx
├── constants.ts, utils.ts, elements.tsx, types.ts
├── hooks/
└── components/
    ├── NotesPanel/
    └── TabsContent/
```

Each nested folder follows the same template.

## Mobile flex layout

When building dashboard pages with flex:

- Use tokens from `_lib/layout/dashboardPageLayout.ts` (`dashboardPageRootSx`, `dashboardScrollablePageSx`, `getDashboardPagePadding`) instead of fixed `p: 3`
- Use `dashboardPageRootSx` only for full-height flex pages (datagrids, tabbed panels). Use `dashboardScrollablePageSx` for card grids and long scrolling content
- Always set `minWidth: 0` on flex children that contain grids, tables, or charts
- Prefer `spacing={{ xs: 2, md: 3 }}` over fixed `spacing={2}` in vertical stacks
- Stack toolbars/actions vertically below `sm` (`direction={{ xs: 'column', sm: 'row' }}`)
- Scroll inside one container (`ChildrenContainer` / `dashboardScrollRegionSx`), not nested `overflow: hidden` chains


- [ ] Folder with `index.ts` barrel
- [ ] No magic strings in JSX
- [ ] Styled components in `elements.tsx`
- [ ] Main file under 200 lines
- [ ] `'use client'` only if required
