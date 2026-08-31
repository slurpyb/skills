# Type-system mental model

Load when assignability, generic constraints, runtime identity, or host types are confusing. Why: architecture built on the wrong model acquires casts and accidental coupling.

- A type denotes a set of values. In `Candidate extends Requirement`, `extends` means assignable subset; class `extends` separately means runtime inheritance.
- TypeScript is structural. A value satisfies an interface through capability, not declaration. Use classes or validated value objects when nominal identity and invariants matter.
- Interfaces and aliases exist only in type space. Classes exist in type and value space, so `instanceof` works only with runtime constructors.
- Types are erased. Generic parameters cannot select runtime behavior without a value-level token, constructor, discriminator, or schema.
- Passing typecheck proves no tracked contradiction, not runtime correctness. Indexing, assertions, external data, and mutation remain soundness boundaries.
- Model the actual runtime with intentional `lib`, `types`, module, and target settings.

```ts
interface Identified<Identifier> {
  readonly id: Identifier;
}

abstract class Entity<Identifier> implements Identified<Identifier> {
  protected constructor(readonly id: Identifier) {}
}
```

Structural interfaces define capabilities; the abstract class can own runtime behavior and protected lifecycle rules. Neither approach is universally preferred.

Next: use `modeling-typescript-domains` for nominal values and valid states, or `designing-typescript-objects` for inheritance ownership; otherwise this step ends here.
