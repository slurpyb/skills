# Portable Panda CSS pattern rules

- Discover the owning Panda config or preset, registry, token contract, package version, and verification commands from the target repository.
- Classify the work as a built-in extension or a distinct custom pattern before editing.
- Preserve a built-in pattern's existing properties, defaults, responsive behavior, JSX metadata, and passthrough styles unless replacement is explicit.
- Define the smallest semantic property surface with Panda property, token, enum, boolean, number, or string definitions.
- Use `definePattern`; export inferred props when properties are declared.
- Destructure semantic props in `transform`, use `map` for conditional scalar transformations, and spread unrelated style props last.
- Validate units, CSS variables, and CSS functions before interpolating values into calculations or shorthands.
- Register additions and overrides under `patterns.extend` so inherited patterns remain available.
- Test registry presence, defaults, transform output, token and literal values, responsive behavior, precedence, and passthrough props.
- Refresh Panda-generated code or types when applicable, then run the repository's formatter, build, typecheck, lint, and tests.
- Keep reusable instructions free of absolute paths, repository-specific imports, organization names, and fixed package-manager commands.
