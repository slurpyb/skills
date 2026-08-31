# Repositories and units of work

Load when domain objects cross persistence boundaries or several repositories must commit atomically. Why: persistence abstractions should preserve domain ownership and transaction scope.

```ts
interface Specification<Entity> {
  isSatisfiedBy(entity: Entity): boolean;
}

abstract class Repository<Entity, Identifier, Query> {
  abstract find(identifier: Identifier): Promise<Entity | undefined>;
  abstract matching(query: Query): Promise<readonly Entity[]>;
  abstract save(entity: Entity): Promise<void>;
}

interface AccountRepositories {
  readonly accounts: Repository<Account, AccountId, AccountQuery>;
  readonly transfers: Repository<Transfer, TransferId, TransferQuery>;
}

abstract class UnitOfWork<Repositories> {
  abstract execute<Result>(
    operation: (repositories: Readonly<Repositories>) => Promise<Result>,
  ): Promise<Result>;
}
```

Rules:

- Repositories speak domain types; adapters map records and parse external storage values.
- Use named query/specification contracts, not open filter dictionaries.
- Bind repositories to the transaction supplied by the Unit of Work; do not resolve them reflectively from global state.
- A transaction callback's `Result` must flow from callback output to `execute` output.
- Keep commit/rollback ownership inside the Unit of Work.
- Test through in-memory repository and Unit of Work implementations, not module mocks.

If a repository is only a thin CRUD mirror with no domain boundary, prefer the database client's owned API rather than ceremonial abstraction.

Next: load `construction-patterns.md` when entities require factories, or use `designing-typescript-types` when generic correlations require compile-time fixtures; otherwise this step ends here.
