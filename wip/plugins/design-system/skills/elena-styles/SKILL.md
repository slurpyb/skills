---
name: elena-styles
description: Author or review Elena component CSS, recipe transposition, token use, scoped ownership, progressive rendering, layout, motion, and visual verification.
---

# Style Elena components

Read the styling sections of `docs/engineering/elena-conventions.md` and
`agent-os/standards/elena/styles-and-layout.md` before changing component CSS. For a port,
also follow the recipe transposition branch in `.agents/skills/porting-components/SKILL.md`.

Use `@scope (elena-*)` for Light DOM encapsulation. Apply the full Elena reset only to
rendered primitives; composites preserve consumer styling and descendants. Give rendered
primitives equivalent pre-hydration host and owned-element presentation so upgrade does not
create a semantic or visual discontinuity.

Expose documented public `--elena-*` inputs through private `--_elena-*` resolution with a
usable standalone fallback. Components consume inherited design-system palette and semantic
tokens; they do not define, repoint, or select `--colors-color-palette-*`. Preserve recipe
layer order, original slot/modifier intent, logical properties, forced-colors behavior, and
reduced-motion correctness.

Use deterministic preview scenarios and Playwright inspection to verify computed styles,
responsive states, focus visibility, motion, and console output. Source and DOM-emulator
tests prove selector branches and ownership; browser inspection proves actual layout and
rendering. Finish with the applicable Bun checks and `bun run verify`.
