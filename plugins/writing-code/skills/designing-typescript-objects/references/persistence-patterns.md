# Repositories and units of work

Persistence abstractions preserve domain ownership and explicit transaction scope.

```ts
interface Specification<Entity> {
  isSatisfiedBy(entity: Entity): boolean;
}

abstract class Repository<Entity, Identifier, Query> {
  abstract find(identifier: Identifier): Promise<Entity | undefined>;
  abstract matching(query: Query): Promise<readonly Entity[]>;
  abstract save(entity: Entity): Promise<void>;
}

abstract class UnitOfWork<Repositories> {
  abstract execute<Result>(
    operation: (repositories: Readonly<Repositories>) => Promise<Result>,
  ): Promise<Result>;
}
```

- Repositories speak domain types; adapters map records and parse stored values.
- Named query or specification contracts own query semantics.
- The Unit of Work supplies transaction-bound repositories and owns commit or rollback.
- The callback result flows directly to the `execute` result.
- In-memory repositories and units of work prove behavior through the same ports.
- A thin CRUD mirror can remain the database client's owned API when it adds no domain boundary.

## Completion

Every record mapping, query, repository, and transaction has one owner; atomic operations share explicit scope; commit and rollback paths are tested.
