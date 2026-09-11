---
description: PandaCSS responsive value syntax — apply when assigning a style property that varies across breakpoints (mobile-first)
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Responsive Design

Panda is mobile-first. Two equivalent syntaxes for breakpoint-keyed values:

```tsx
// Object syntax (preferred — explicit keys)
columns: { base: 1, sm: 2, md: 3, lg: 4 }

// Array syntax (positional: base, sm, md, lg, xl, 2xl)
columns: [1, 2, 3, 4]
```

Both compile to the same CSS. `base` applies at all breakpoints unless a larger key overrides it.

## Intrinsic first, breakpoints as fallback

Reach for layout that adapts to *available space* before reaching for breakpoint
keys. A breakpoint reacts to the viewport, not the component's container — it
breaks when the component is reused in a narrower or wider slot.

- Wrapping rows → `flexWrap: "wrap"` + `flexBasis` / `flex: "1 1 <basis>"`.
- Auto-fitting grids → `gridTemplateColumns: "repeat(auto-fit, minmax(<min>, 1fr))"`.
- Container-relative changes → container queries (`containerType`, see [Layout]).

Use breakpoint objects (`{ base, md, lg }`) when the change is genuinely
viewport-driven (page chrome, global density) — not as the default for every
component.

## Breakpoint keys

Default keys: `base`, `sm`, `md`, `lg`, `xl`, `2xl`. Defined in `theme.breakpoints` — extend or replace in `panda.config.ts` if needed.

## Combining with conditions

```tsx
css({
  fontSize: { base: "sm", md: "md", lg: "lg" },
  _hover: {
    color: { base: "accent.500", md: "accent.600" },
  },
})
```

## Rules

- Always start with `base` — omit it only when the property does not apply at the smallest breakpoint.
- Object syntax beats array syntax once there are 3+ breakpoints — it survives reordering and partial coverage.
- Do not write multiple `@media` queries inline; use the breakpoint object instead.
- Prefer intrinsic layout (auto-fit/minmax, flex-wrap) over breakpoint objects when the layout should respond to its container rather than the viewport.
- Breakpoint changes require `panda codegen` to refresh types.

## See also

- [Conditional styles](conditions.md)
- [Writing styles](css.md)
- [Tokens](../theming/tokens.md)
