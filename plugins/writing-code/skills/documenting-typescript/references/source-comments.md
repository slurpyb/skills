# Source comments

Source documentation explains behavior the signature cannot express on exported APIs, extension hooks, and non-obvious local declarations.

````ts
abstract class UnitOfWork<Repositories> {
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
}
````

Document invariants, side effects, ordering, caching, failure, lifecycle expectations, defaults, and extension rules. A local helper earns documentation when behavior remains non-obvious from its name and types.

Use `@remarks`, `@example`, `@throws`, `@see`, `@deprecated`, `@since`, `@typeParam`, and `@internal` when each adds information. Keep overload distinctions on public signatures. Treat examples as owned code and typecheck them where practical.

## Completion

Every changed behavior invisible to the type signature is documented at its declaration, comments add information rather than syntax, and examples pass applicable checks.
