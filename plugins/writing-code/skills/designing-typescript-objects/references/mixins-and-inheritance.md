# Mixins and inheritance

Load when several classes share behavior or capabilities compose across hierarchies. Why: TypeScript mixins can preserve behavior, but conventional generic constructor recipes often rely on `any[]` and assertions forbidden here.

Prefer, in order:

1. an abstract behavioral base when one inheritance axis owns the lifecycle;
2. capability delegates when behaviors vary independently;
3. explicit finite composed bases when a small set of combinations is known;
4. a generic class-expression mixin only when its constructor and instance relationships pass lint and type tests without escape hatches.

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

Do not introduce `abstract new (...arguments_: any[])`, chained assertions, `Reflect.apply`, or property-copy helpers that fabricate an intersection type. If TypeScript cannot express a fully generic mixin soundly under repository policy, use an explicit abstract base or delegate rather than laundering the constructor.

For accepted inheritance, verify:

- base invariants survive every override;
- protected hooks are narrower than public operations;
- constructor requirements remain coherent;
- subclass instances remain substitutable;
- type fixtures preserve inherited and added capabilities.

Next: load `object-oriented-design.md` for ownership or use `designing-typescript-types` for constructor and capability fixtures; otherwise this step ends here.
