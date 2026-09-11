---
description: PandaCSS conditional styles (_hover, _focus, _dark, _groupHover, etc.) — apply when adding state-dependent styling inside css/cva/sva calls or style props
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Conditional Styles

Underscore-prefixed conditions (`_hover`, `_focus`, `_active`, `_disabled`, `_dark`, `_osDark`, `_groupHover`, `_peerHover`, `_focusVisible`, `_motionReduce`, ...) gate a nested style object on a CSS state, media query, or data attribute.

## Form

```tsx
css({
  bg: "white",
  color: "fg.default",
  _hover: { bg: "neutral.50" },
  _focusVisible: { outline: "2px solid", outlineColor: "accent.500" },
  _dark: { bg: "neutral.900", color: "fg.inverse" },
})
```

## Component state via `[data-state]`

Model a component's interaction state as a `data-*` attribute set **once on the
root**, and let descendants react through a shared custom condition — instead of
state classes or prop-drilling state into every slot.

```ts
// panda.config.ts
conditions: {
  extend: {
    open:     "&[data-state=open], [data-state=open] &",
    selected: "&[data-state=selected], [data-state=selected] &",
  },
}
```

```tsx
// root carries the attribute; any slot reads it via _open
sva({
  slots: ["root", "panel", "icon"],
  base: {
    panel: { display: "none", _open: { display: "block" } },
    icon:  { _open: { rotate: "180deg" } },
  },
})
```

## Rules

- Use `_focusVisible` (keyboard) instead of `_focus` for outline rings — avoids mouse-click flashes.
- Nest conditions for compound states: `_hover: { _dark: { ... } }`.
- For sibling/parent state, use `_groupHover` / `_peerHover` and add `group` / `peer` class on the controller element.
- Always pair `_motionReduce` with any non-decorative animation.
- Conditions valid inside `css()`, `cva` variants, `sva` slot styles, and JSX style props.
- Set component state as `[data-state]` on the recipe root; descendants react via a custom `_open`/`_selected` condition — don't thread state through every slot.
- Define those conditions once in `conditions.extend` so the selector lives in one place.

## See also

- [Responsive design](responsive.md)
- [Slot recipes](../composing/slot-recipes.md)
- [Writing styles](css.md)
- [Style props](style-props.md)
