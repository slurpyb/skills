---
name: panda-styling-engine
description: Use when styling interfaces with Panda CSS, creating React components around recipes, or deciding among generated JSX, patterns, recipes, slot recipes, style context, tokens, semantic tokens, named styles, conditions, utilities, and configuration.
---

# Panda Styling Engine

## Workflow

**Flow:** SURVEY → CLASSIFY → ROUTE → APPLY → VERIFY

### 1. SURVEY the active Panda MCP

Before inspecting files or proposing styles, check the current session for Panda MCP tools.

- When present, inspect the resolved configuration and the smallest task-relevant set of tokens, semantic tokens, recipes, patterns, conditions, text or layer styles, font roles, or usage data.
- Relate the returned project vocabulary to the request: identify reusable APIs, missing concepts, and the local source that owns the change.
- When absent or unavailable, continue from the project's Panda config, preset source, and generated styled-system types.

SURVEY is complete when the available project-specific styling vocabulary is known.

### 2. CLASSIFY the situation

Answer these questions before choosing syntax:

1. Does an existing component, recipe, pattern, token, or named style already express the request?
2. Is the request integration work, baseline configuration, layout, component presentation, typography foundation, theme vocabulary, or styling-language configuration?
3. For component presentation, is there one styled part or a coordinated set of slots?
4. Is the value fixed, semantic, condition-dependent, or runtime-selected from a finite set?
5. Is the styling local to one generated JSX element, or is it a reusable contract?
6. For a React component, is the styled anatomy one part, fixed multipart structure, or independently composable parts that require style context?

CLASSIFY is complete when one styling owner and one primary Panda primitive are named.

```text
Request: Add a compact option affecting every part of a tabs component.
Classification: reusable component presentation + coordinated parts
Primary primitive: slot recipe
Routes: slot-recipes.md, writing-styles.md
```

### 3. ROUTE to the matching reference

| Situation                                                                   | Load                                                                |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Astro, PostCSS, CLI, codegen, or Storybook integration                      | [usage.md](./references/usage.md)                                   |
| Baseline config, shared output, preset stack, plugin, or static contract    | [configuration-baseline.md](./references/configuration-baseline.md) |
| Global variables, font faces, semantic font roles, or text-style cascade    | [typography-foundation.md](./references/typography-foundation.md)   |
| Existing or new layout relationships; Stack, Flex, Grid, or custom patterns | [patterns.md](./references/patterns.md)                             |
| Reusable single-part component variants                                     | [recipes.md](./references/recipes.md)                               |
| Reusable multipart component variants                                       | [slot-recipes.md](./references/slot-recipes.md)                     |
| React anatomy, state, exports, polymorphism, refs, or DOM hooks             | [react-component-api.md](./references/react-component-api.md)       |
| React component wrapping one standard recipe                                | [react-standard-recipe.md](./references/react-standard-recipe.md)   |
| React component owning one fixed slot-recipe structure                      | [react-slot-component.md](./references/react-slot-component.md)     |
| React compound parts sharing a slot recipe through style context            | [react-style-context.md](./references/react-style-context.md)       |
| Generated imports, package output, extraction, or codegen                   | [styled-system.md](./references/styled-system.md)                   |
| Small element-local styling through generated JSX                           | [style-props.md](./references/style-props.md)                       |
| Authoring Panda style objects inside the selected primitive                 | [writing-styles.md](./references/writing-styles.md)                 |
| Combining existing styling sources or overrides                             | [merging-styles.md](./references/merging-styles.md)                 |
| Fixed design values and token categories                                    | [tokens.md](./references/tokens.md)                                 |
| Intent-based or condition-dependent values                                  | [semantic-tokens.md](./references/semantic-tokens.md)               |
| Theme internals, named styles, config functions, conditions, or extensions  | [theme-config.md](./references/theme-config.md)                     |
| Color opacity, palettes, or virtual colors                                  | [color.md](./references/color.md)                                   |
| Existing utility props or authoring a reusable custom utility               | [utilities.md](./references/utilities.md)                           |

Load every row that materially affects the request, then stop. The references are branches, not a reading list.

### 4. APPLY the project vocabulary

Consume an existing API before extending one. Put reusable behavior in the preset or theme layer that owns it. Keep call sites declarative: select components, patterns, recipe variants, semantic tokens, text styles, and named styles rather than rebuilding their CSS decisions locally. Let preset-owned global styles establish the intrinsic document and typography baseline.

For React, make the component the public API and keep the generated recipe inside its implementation. Align component anatomy, slot names, behavior parts, and exports before writing JSX.

### 5. VERIFY the route and output

- Confirm the chosen primitive still matches the final implementation.
- Run Panda codegen after config, preset, token, pattern, recipe, or utility changes.
- For baseline config work, inspect the resolved preset order, shared import map, explicit `theme.extend`, color-removal plugin, full recipe emission, and primary accent theme emission.
- For typography work, verify the intrinsic cascade, semantic body and heading fonts, variable-font fallback, and deep-merged heading overrides.
- For React components, verify native semantics, accessibility, controlled and uncontrolled behavior, ref delivery, variant extraction, slot coverage, class merge order, and server rendering.
- Run `bash scripts/check-styling-boundaries.sh <changed-source...>` from this skill directory.
- Typecheck and inspect generated output; use a browser for visual or responsive behavior.

VERIFY is complete when extraction succeeds, generated types are current, the boundary check passes, and the rendered result matches the request.
