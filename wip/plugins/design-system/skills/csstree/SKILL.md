---
name: csstree
description: >
  Parse, validate, extract from, and transform CSS through the css-tree AST in Node scripts. Use
  when extracting CSS custom properties / design tokens from a stylesheet, validating CSS against
  W3C specs, walking or linting a stylesheet, renaming selectors, diffing tokens between two files,
  or doing source-to-source CSS transforms — anything that needs a real CSS parser instead of
  regex. Triggers: "parse CSS", "extract design tokens / custom properties from CSS", "validate
  CSS", "css-tree", "CSS AST", "transform a stylesheet".
allowed-tools: Bash(node:*) Bash(npm:*) Read Write Edit Grep Glob
---

# csstree — CSS AST toolkit

[css-tree](https://github.com/csstree/csstree) is a fast, spec-compliant CSS toolkit: parser
(CSS→AST), walker, generator (AST→CSS), and a lexer that validates values against W3C syntaxes.
Reach for it instead of regex whenever a task touches the **structure** of CSS.

## Setup (once)

This skill is self-contained — it carries its own `css-tree` dependency. Install it the first time:

```bash
npm install --prefix ~/.claude/skills/csstree
```

The helpers resolve css-tree from the skill's own `node_modules`, so they work in any project.

## Quick start — CLI (preferred for one-shot tasks)

```bash
SK=~/.claude/skills/csstree/scripts/cli.mjs
node "$SK" extract-tokens styles.css          # → JSON of every --custom-property
node "$SK" validate styles.css                # → W3C validation; exits 1 if invalid
node "$SK" diff-tokens source.css built.css   # → { exact, changed, missing, added }
node "$SK" declarations styles.css --selector :root
node "$SK" ast styles.css --context value     # → AST as JSON
node "$SK" rename-class styles.css old new    # → transformed CSS on stdout
```

`validate` exits non-zero on problems, so it drops straight into a build gate or pre-commit hook.

## Quick start — library

```js
// Import by ABSOLUTE path (Node does not expand ~ inside an import specifier).
import {
  extractCustomProperties, validateCss, diffCustomProperties, renameSelector,
  parseCss, generateCss, toPlain, fromPlain, csstree,
} from '/Users/<you>/.claude/skills/csstree/scripts/csstree-helpers.mjs';

extractCustomProperties(':root { --gap: 1rem; --ink: #111 }');
// [ { name: '--gap', value: '1rem', loc: {…} }, { name: '--ink', value: '#111', loc: {…} } ]

validateCss('a { colour: red }');
// { valid: false, errors: [ { property: 'colour', message: 'Unknown property…', line: 1, column: 5 } ] }
```

`csstree` (the raw namespace) is re-exported for anything the wrappers don't cover.

## Which function / command

| Task | Use |
|------|-----|
| Pull design tokens / `--vars` out of CSS | `extractCustomProperties` · `extract-tokens` |
| Check CSS is valid per W3C specs | `validateCss` · `validate` |
| Compare tokens across two files (parity) | `diffCustomProperties` · `diff-tokens` |
| Read all declarations (optionally by selector) | `extractDeclarations` · `declarations` |
| Rename a class everywhere (source→source) | `renameSelector` · `rename-class` |
| Inspect / round-trip the raw AST | `parseCss`, `toPlain`, `fromPlain`, `generateCss` · `ast` |
| Anything else | drop to the re-exported `csstree` namespace |

## Going deeper

The helpers cover the common cases. For the full API, load the matching reference (one level deep):

- [reference/parsing.md](reference/parsing.md) — `parse()` contexts (`value`, `declarationList`, …) + options
- [reference/traversal.md](reference/traversal.md) — `walk` / `find` / `findAll`, the `visit` fast path, `this.*` context
- [reference/generate.md](reference/generate.md) — `generate()` and source maps
- [reference/validation.md](reference/validation.md) — the lexer: `matchProperty`, `checkPropertyName`, error shape
- [reference/utils.md](reference/utils.md) — `property`, `keyword`, `ident`/`string`/`url`, `clone`, `to`/`fromPlainObject`
- [reference/ast-nodes.md](reference/ast-nodes.md) — node-type cheat sheet (`Declaration`, `Rule`, `Raw`, …)

## Notes

- Parsing is **tolerant**: bad fragments become `Raw` nodes, not exceptions. `parseCss(src)` throws
  on parse errors by default; pass `{ tolerant: true }` to collect them instead.
- Custom-property values parse as a single `Raw` node (not split into tokens) unless you pass
  `{ parseCustomProperty: true }`.
- The reference files are condensed; the source of truth is <https://github.com/csstree/csstree>.
