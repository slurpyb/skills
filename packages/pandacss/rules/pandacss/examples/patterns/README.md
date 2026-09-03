# Layout patterns

Panda's pattern layer, demonstrated against the techniques in
`frontend/skills/tailwindcss-advanced-layouts`. We translate the *intent*, not
the Tailwind habits — our CSS rules win: logical properties, relative units +
tokens, intrinsic / container queries over viewport breakpoints, z-index as
tokens, semantic tokens over literals.

A pattern is layout (arrangement). It never carries component state — that's a
recipe. Compose: a pattern wraps a recipe/styled element, not the reverse.

## Built-ins cover ~40% of the SKILL (no custom code)

See `builtins/BuiltinsDemo.tsx`. Each is a JSX component from `styled-system/jsx`:

| SKILL technique | Built-in |
|---|---|
| auto-fit/auto-fill grids | `<Grid minChildWidth="16rem">` |
| flex space distribution / clusters | `<Wrap>`, `<Flex>` |
| negative-margin bleeds | `<Bleed inline="8">` |
| aspect ratio | `<AspectRatio ratio={21/9}>` |
| dividers between items | `<Stack>` + `<Divider>` |
| container queries | `<Cq name="card">` |
| reading container | `<Container>` |
| centering | `<Center>` |
| `.clipped` / sr-only | `<VisuallyHidden>` |

## Custom patterns (`definePattern`) — typed props become typed JSX props

| Pattern | JSX | Demonstrates |
|---|---|---|
| `app-shell` | `<AppShell sidebar aside>` | **extend technique 3** — wrap built-in `grid`, add template areas |
| `card-grid` | `<CardGrid min>` | **extend technique 2** — compose `grid.raw()` + edge-case fix |
| `container-override` | `<Container>` | **extend technique 1** — override a built-in's defaults project-wide |
| `subgrid` | `<Subgrid axis>` | enum prop → typed JSX prop |
| `masonry` | `<Masonry min gap>` | CSS columns, intrinsic track count |
| `text-columns` | `<TextColumns min="measure.narrow">` | ch reading measure (semantic token) |
| `snap-row` | `<SnapRow gap inset>` | compose `flex.raw()` + scroll-snap |
| `sticky-top` | `<StickyTop offset>` | logical `insetBlockStart`, z-index **token** |
| `fluid-stack` | `<FluidSection min max>` | `clamp()` between spacing tokens, no breakpoints |

## Three ways to extend a built-in pattern

1. **Override defaults** — redefine the key in `patterns.extend` (`container`).
   Every `<Container>` in the app gets your gutters with no per-call config.
2. **Compose via `.raw()`** — `grid.raw({...})` / `flex.raw({...})` return the
   style object; spread into a richer pattern (`card-grid`, `snap-row`).
3. **Wrap for structure** — build template areas / extra rules on top of a
   built-in's output (`app-shell`).

## Wiring

All patterns register in the single `panda.config.ts` under the top-level
`patterns.extend` key (NOT a separate config file). Z-index is a token category
(`theme.extend.tokens.zIndex`), consumed as `zIndex: "modal"` — see
`z-index.tokens.ts`.
