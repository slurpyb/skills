# Mixins and inheritance

Shared behavior should preserve constructor evidence, lifecycle ownership, and substitutability.

Prefer, in order:

1. an abstract behavioral base when one inheritance axis owns the lifecycle;
2. capability delegates when behaviors vary independently;
3. explicit finite composed bases when a small set of combinations is known;
4. a generic class-expression mixin when constructor and instance relationships pass lint and type fixtures directly.

```ts
class AuditTrail {
  readonly entries: string[] = [];

  record(entry: string): void {
    this.entries.push(entry);
  }
}

abstract class AuditedEntity<Identifier> extends Entity<Identifier> {
  protected readonly audit = new AuditTrail();
}
```

Use explicit bases or delegates when a generic mixin would need constructor assertions, reflective calls, or property copying that fabricates an intersection.

Verify:

- base invariants survive every override;
- protected hooks are narrower than public operations;
- constructor requirements remain coherent;
- subclass instances remain substitutable;
- type fixtures preserve inherited and added capabilities.

## Completion

The selected sharing mechanism has one lifecycle owner, constructor evidence remains intact, every subclass is substitutable, and capability fixtures pass.
