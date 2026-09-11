---
description: PandaCSS border utilities — apply when setting border width/color/style/radius (physical or logical) on a component
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Border Utilities

## Physical

| Shorthand | Long form | Token |
|-----------|-----------|-------|
| `border` | `border` | composite (`borders`) |
| `borderWidth` | `border-width` | `borderWidths` |
| `borderColor` | `border-color` | `colors` |
| `borderStyle` | `border-style` | — |
| `borderTop`/`borderRight`/`borderBottom`/`borderLeft` | per-side composite | composite |
| `borderTopWidth`/`...Color`/`...Style` | per-side per-prop | matching category |
| `rounded` / `borderRadius` | `border-radius` | `radii` |
| `roundedTop`/`roundedLeft`/etc. | per-corner radius | `radii` |

## Logical (writing-direction aware)

| Shorthand | Long form |
|-----------|-----------|
| `borderInline` | `border-inline` (left + right in LTR) |
| `borderBlock` | `border-block` (top + bottom) |
| `borderInlineStart` / `borderInlineEnd` | per-side logical |
| `borderBlockStart` / `borderBlockEnd` | per-side logical |
| `roundedStart` / `roundedEnd` | logical radius |

## Form

```tsx
css({
  borderWidth: "1px",
  borderColor: "border.subtle",
  borderStyle: "solid",
  rounded: "md",
  _hover: { borderColor: "border.default" },
})
```

Composite token:

```tsx
css({ border: "1px solid token(colors.border.subtle)" })
```

## Rules

- Prefer `rounded` over `borderRadius` — shorter, same semantics.
- Use **logical** properties (`borderInline*`, `roundedStart`) for any UI that ships in RTL locales.
- Don't write `border: "none"` — set `borderWidth: 0` instead so token-driven borders aren't dropped.
- `border: "1px solid"` + `borderColor: ...` is fine when the style is dynamic; pure tokens prefer composite via `token(...)`.

## See also

- [Outline](outline.md)
- [Focus ring](focus-ring.md)
- [Divide](divide.md)
