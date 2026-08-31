# Documenting TypeScript

Load when writing JSDoc/TSDoc, publishing API references, or configuring TypeDoc. Why: documentation should explain contracts the type system cannot express, not narrate syntax.

Document contracts the type system cannot express, on exported APIs, extension hooks, and module-local declarations. Describe behavior, invariants, side effects, ordering, caching, failure modes, lifecycle expectations, defaults, and examples. Skip comments that merely repeat names or types.

````ts
/**
 * Runs work inside one transaction.
 *
 * @remarks Repositories passed to `operation` share the same transaction.
 * Commit and rollback remain owned by the unit of work.
 *
 * @typeParam Result - The operation result propagated after commit.
 * @param operation - Work performed with transaction-bound repositories.
 * @returns The committed operation result.
 * @throws TransactionError If commit or rollback fails.
 *
 * @example
 * ```ts
 * await unitOfWork.execute(async ({ accounts }) => accounts.save(account));
 * ```
 */
abstract execute<Result>(
  operation: (repositories: Readonly<Repositories>) => Promise<Result>,
): Promise<Result>;
````

An unexported helper whose `id` may be `null` still needs source TSDoc. TypeDoc may omit it from generated pages; the editor hover does not:

```ts
/**
 * Builds a JSON-RPC 2.0 response from a correlated identifier and router outcome.
 *
 * @param id - Request identifier, or `null` when correlation is unavailable.
 * @param outcome - Successful result or protocol/method error.
 * @returns A response containing either `result` or `error`.
 */
function response(id: RpcId, outcome: RpcOutcome): RpcResponse {
  return "error" in outcome
    ? { jsonrpc: "2.0", id, error: outcome.error }
    : { jsonrpc: "2.0", id, result: outcome.result };
}
```

Use `@remarks`, `@example`, `@throws`, `@see`, `@deprecated`, `@since`, `@typeParam`, and `@internal` only when they add useful information. Document overload distinctions on their public signatures; do not expose implementation-overload details.

Examples are owned code: keep them lintable, typecheck them when practical, and never demonstrate unparsed responses, output-only generics, or unsupported assertions as normal usage.

For TypeDoc, query current compatible package/plugin versions, preserve existing config, exclude private/protected/internal members as intended, and enable invalid-link plus unexported-symbol validation. TypeDoc exclusion is a publication choice; it is not a reason to omit source TSDoc. Generate or publish docs only when the repository owns that artifact; CI should validate documentation without committing generated output by default.

Next: load `public-api-quality.md` for export design or return to the `SKILL.md` done gate.
