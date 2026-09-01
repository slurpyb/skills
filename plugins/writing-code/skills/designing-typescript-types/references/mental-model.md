# Type-system mental model

Use the runtime model, value evidence, and assignability rules as the basis for architecture.

- A type denotes a set of values. In `Candidate extends Requirement`, `extends` means assignable subset; class `extends` separately means runtime inheritance.
- TypeScript is structural: values satisfy interfaces through capability. Classes or validated value objects carry nominal identity and invariants.
- Interfaces and aliases exist only in type space. Classes exist in type and value space, so `instanceof` requires a runtime constructor.
- Generic parameters are erased. Runtime selection requires a token, constructor, discriminator, or schema.
- Typecheck proves no tracked contradiction. Indexing, assertions, external data, and mutation remain soundness boundaries.
- `lib`, `types`, module, and target settings model the actual host runtime.

```ts
interface Identified<Identifier> {
  readonly id: Identifier;
}

abstract class Entity<Identifier> implements Identified<Identifier> {
  protected constructor(readonly id: Identifier) {}
}
```

The interface defines structural capability; the abstract class can own runtime behavior and protected lifecycle rules.

## Completion

Every changed type-level claim matches runtime identity and erasure, each runtime generic choice has value evidence, and host types match the deployed environment.
