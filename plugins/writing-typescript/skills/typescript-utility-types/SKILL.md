---
name: typescript-utility-types
description: Compose or refactor TypeScript utility types, including deep object transformations, property selection, branded identifiers, mutually exclusive options, typed paths, and exhaustiveness checks. Use before writing reusable mapped or conditional type helpers.
---

# TypeScript Utility Types

Use [`ts-essentials`](https://github.com/ts-essentials/ts-essentials) for reusable type operations beyond TypeScript's built-in utilities. Prefer its existing types over implementing equivalent generic machinery.

Search the [API catalog](https://github.com/ts-essentials/ts-essentials#api) by the operation needed. Useful starting points include:

- Recursive transformations: `DeepPartial`, `DeepReadonly`, `DeepRequired`, `DeepWritable`.
- Property operations: `StrictOmit`, `MarkOptional`, `MarkRequired`, `Merge`.
- Distinct identities and exclusive alternatives: `Opaque`, `XOR`.
- Nested access: `Paths`, `PathValue`.
- Exhaustiveness: `UnreachableCaseError`.

Use built-in types when they already express the requirement. Check each selected utility's documented semantics, especially for unions, collections, and optional properties; similar names need not mean identical behavior.

Import types with `import type`. Verify TypeScript compatibility and enable the required `strictNullChecks`. A development dependency suffices for internal type-only usage; runtime helpers require a runtime dependency. Ensure consumers can resolve the package if published declarations reference it.

Run the project's type check after integration. Type transformations describe values; runtime validation and transformation remain separate operations.
