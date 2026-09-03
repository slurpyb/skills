---
description: PandaCSS divide utilities — apply when adding consistent dividers between sibling children of a flex/grid/stack container (avoids manually adding borders to each item)
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Divide Utilities

`divideX` / `divideY` add a border between adjacent direct children of the parent (skipping the first), so you don't have to attach `borderBottom` to every list item.

| Key | Effect |
|-----|--------|
| `divideX` | Vertical dividers between children (border-inline-start on each child after the first) |
| `divideY` | Horizontal dividers between children (border-block-start on each child after the first) |
| `divideColor` | Color for both `divideX` / `divideY` |
| `divideStyle` | `solid` / `dashed` / `dotted` |

## Form

```tsx
<ul className={css({
  divideY: "1px",
  divideColor: "border.subtle",
})}>
  <li>...</li>
  <li>...</li>
  <li>...</li>
</ul>
```

With dynamic transparency:

```tsx
css({ divideY: "1px", divideColor: "brand.ink/10" })
```

## Rules

- Applies to **direct children only** — wrap nested groups in a fragment-less container if you want them to be siblings.
- Don't combine `divideY` with explicit `borderTop` on every child — that doubles up.
- For a layout container with built-in divider config, use a custom `definePattern` (e.g. `divider: { type: "boolean" }`).
- `divide*` does not interact with `gap`. A `divideY` between children sits flush against the next child; add `pt`/`pb` on the items if you need padding around the line.

## See also

- [Border](border.md)
- [Spacing](spacing.md)
- [Flex and grid](flex-and-grid.md)
