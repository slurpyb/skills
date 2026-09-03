---
description: PandaCSS Studio — apply when setting up a local visual dashboard to browse tokens/recipes/patterns or onboarding a designer to the system
---

# PandaCSS — Panda Studio

A built-in read-only dashboard for the resolved design system. Useful for designer/developer alignment and visual audits — not a runtime artifact.

## Setup

```bash
bun add -d @pandacss/studio
```

## Run

```bash
panda studio
# opens http://localhost:4000 (or first free port)
```

Optional script:

```json
{
  "scripts": {
    "studio": "panda studio"
  }
}
```

## What it shows

- Tokens (colors, spacing, typography, shadows, gradients) with live previews.
- Semantic tokens with their resolved values across conditions.
- Recipes and slot recipes with each variant rendered.
- Patterns with prop matrix.

## Rules

- Read-only — editing in Studio doesn't write back to `theme/`. Edit the TS source and re-run codegen.
- Restart studio after token/recipe changes, or run alongside `panda --watch` for hot updates.
- Studio runs locally; don't expose it to production (it serves the full design system).

## See also

- [Spec](spec.md)
- [Tokens](../theming/tokens.md)
- [Styled system](../configuring/styled-system.md)
