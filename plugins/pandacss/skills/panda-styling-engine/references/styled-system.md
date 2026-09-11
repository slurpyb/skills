# Styled System

Load when working with generated imports, extraction, package output, codegen, or missing generated types.

The styled system is generated from the resolved Panda configuration. It exposes project-specific runtime helpers, JSX components, patterns, recipes, tokens, types, and CSS.

| Surface                  | Responsibility                                    |
| ------------------------ | ------------------------------------------------- |
| `styled-system/jsx`      | Generated `styled` factory and pattern components |
| `styled-system/patterns` | Callable built-in and custom layout patterns      |
| `styled-system/recipes`  | Config recipes and slot recipes                   |
| `styled-system/tokens`   | Typed token lookup and token metadata             |
| generated CSS            | Extracted utilities, recipes, tokens, and layers  |

## Ownership

- Edit preset and config source rather than generated files.
- Use the configured import map or shared package boundary; avoid private aliases that consumers cannot resolve.
- Regenerate after token, condition, utility, pattern, recipe, style, breakpoint, or config changes.
- Run codegen before typechecking or starting a consumer that imports generated types.
- Commit only the generated package metadata the repository intentionally publishes; treat generated implementation output according to project policy.

## Missing output

When an import, type, variant, or class is missing:

1. Confirm the source is exported into the resolved preset.
2. Confirm the config includes the source files and correct framework.
3. Confirm the import map and output directory agree with TypeScript and bundler resolution.
4. Run clean codegen.
5. Use `staticCss` only when valid usage remains invisible to extraction.

Next, load [usage.md](./usage.md) for build integration or the reference for the missing generated primitive.
