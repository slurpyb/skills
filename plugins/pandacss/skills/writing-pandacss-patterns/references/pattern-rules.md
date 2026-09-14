# Panda pattern authoring rules

## Ownership and compatibility

- A built-in extension keeps the upstream pattern name and public properties.
- Start an extension from the complete installed Panda definition, not a visual approximation.
- Preserve defaults, precedence, responsive values, JSX metadata, blocklists, strictness, and passthrough behavior unless the requested change explicitly replaces them.
- Give a distinct reusable abstraction its own custom pattern name.
- Keep one pattern per module when the codebase uses module-based pattern ownership; keep registry composition centralized.

## Property contracts

- Declare the smallest semantic API that removes repeated styling decisions.
- Use `property` definitions for CSS-valued controls, `token` definitions for token-led controls, enums for closed choices, and primitive definitions for genuine booleans, numbers, or strings.
- Export `InferProps<typeof properties>` when a pattern declares properties.
- Choose defaults that work with the owning preset's token contract.
- State precedence for incompatible inputs and consume every semantic prop in the transform.
- Keep presentation or interaction variants in recipes when they are not reusable style transformations.

## Transform contracts

- Destructure semantic props at the transform boundary and spread `...rest` last.
- Return a Panda system style object; use property names Panda can resolve and generate.
- Use `map` for scalar props that may be responsive or conditional.
- Before interpolating token-or-literal values into `calc()` or shorthand strings, distinguish CSS units, variables, and functions with Panda's helpers and provide an appropriate token fallback.
- Keep selector scope deliberate and document any selector-dependent child contract.
- Represent runtime-observed state with a documented attribute or class hook; a pattern only generates styles.

## Portability

- Discover project paths, package-manager commands, and token categories from the target repository.
- Avoid absolute paths, repository names, organization-specific imports, and assumptions about directory layout.
- Use package imports from `@pandacss/dev` and `@pandacss/types` rather than reaching into another checkout.
- Treat installed package source as version evidence, not as a runtime dependency on an external clone.
- Keep all reusable instructions, templates, and test guidance bundled with the skill.

## Registration

Use `extend` to layer pattern definitions without replacing inherited patterns:

```ts
import { patterns } from './patterns'

export const preset = definePreset({
  patterns: {
    extend: {
      ...patterns,
    },
  },
})
```

A project may register one pattern inline, but a shared preset should expose a centralized registry.

## Completion

A pattern change is complete when:

- ownership and compatibility are explicit;
- properties, defaults, responsive behavior, and precedence are documented by code and tests;
- the transform consumes semantic props and preserves unrelated style props;
- registration uses the owning config's `patterns.extend` section;
- generated code or types are refreshed when applicable;
- repository verification passes.
