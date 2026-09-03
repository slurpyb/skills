---
description: PandaCSS panda spec command — apply when wiring a docs site / Storybook integration / design-system audit pipeline that needs a JSON export of tokens, recipes, and patterns
paths:
  - "**/panda.config.ts"
  - "**/package.json"
  - "**/scripts/**/*.{ts"
  - "js"
  - "sh}"
  - "**/docs/**/*.{ts"
  - "tsx"
  - "mdx"
  - "md}"
---

# PandaCSS — `panda spec`

`panda spec` emits a JSON dump of your resolved design system (tokens, semantic tokens, recipes, patterns) to disk. Consume it from docs sites, Storybook integrations, visual diff tools, or design-system audit scripts.

## Generate

```bash
panda spec               # default outdir from config
panda spec --outdir docs # override location
```

Wire as a script:

```json
{
  "scripts": {
    "spec": "panda spec",
    "docs:tokens": "panda spec && node scripts/build-tokens-page.js"
  }
}
```

## Output shape (high level)

```json
{
  "tokens": { "colors": { ... }, "spacing": { ... } },
  "semanticTokens": { "colors": { "bg.surface": { ... } } },
  "recipes": { "button": { "base": {...}, "variants": {...} } },
  "slotRecipes": { "accordion": {...} },
  "patterns": { "stack": {...}, "container": {...} },
  "breakpoints": { "sm": "...", "md": "..." }
}
```

## Rules

- Run after `panda codegen` — spec reflects whatever the last codegen produced.
- Don't commit the output unless the docs site reads it as a static asset; add to `.gitignore` otherwise.
- Spec is read-only; mutating it does not change the theme. Edit the source under `theme/` and re-run.

## See also

- [Using Panda Studio](studio.md)
- [Tokens](../theming/tokens.md)
- [Styled system](../configuring/styled-system.md)
