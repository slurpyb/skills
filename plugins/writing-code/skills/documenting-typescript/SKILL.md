---
name: documenting-typescript
description: Documents TypeScript source and public APIs with behavior-first TSDoc, checked examples, coherent exports, TypeDoc validation, and documentation CI. Use when adding JSDoc or TSDoc, documenting extension hooks or local helpers, publishing a library API, configuring TypeDoc, or diagnosing unclear declaration output.
metadata:
  version: "4.0.0"
  domain: documentation
  role: specialist
  scope: public-api
  output-format: documentation
---

# Documenting TypeScript

## Workflow

Flow: audience → contract → source → examples → publication → validation

1. Identify consumers, extension authors, maintainers, and generated-reference readers.
2. Inspect exported owner types, overloads, declaration output, and non-obvious local helpers.
3. Document behavior types cannot express: invariants, lifecycle, side effects, ordering, caching, failure, defaults, and extension rules.
4. Add examples only when they clarify usage; lint and typecheck them when practical.
5. Preserve existing TypeDoc and publication conventions. Query compatible package and plugin versions instead of remembering them.
6. Validate links, unexported symbols, declarations, examples, and repository checks.

## Rules

- Explain contracts; do not narrate names, syntax, or parameter types.
- Document exported APIs, protected hooks, and local declarations when behavior remains non-obvious from names and types.
- Keep overload distinctions on public signatures and implementation details private.
- Use `@remarks`, `@example`, `@throws`, `@see`, `@deprecated`, `@since`, `@typeParam`, and `@internal` only when they add information.
- Treat TypeDoc exclusion as a publication decision, not permission to omit useful source TSDoc.
- Generate or publish docs only when the repository owns that artifact; CI should validate docs without committing output by default.

```ts
abstract class UnitOfWork {
  /**
   * Runs `operation` inside one transaction.
   *
   * @remarks Commit and rollback remain owned by the unit of work.
   * @throws TransactionError If commit or rollback fails.
   */
  abstract execute<Result>(
    operation: () => Promise<Result>,
  ): Promise<Result>;
}
```

The comment adds lifecycle and failure information absent from the signature.

## Routes

- Load `references/documenting-typescript.md` for source TSDoc, examples, extension hooks, and TypeDoc behavior.
- Load `references/public-api-quality.md` for export ownership, inference, declarations, compatibility, and compiler complexity.

## Completion

Report documented contracts, export changes, example validation, TypeDoc or declaration checks, and residual publication limitations.
