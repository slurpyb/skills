---
name: designing-typescript-objects
description: Designs behavior-owning TypeScript object architectures with interfaces, abstract classes, inheritance, factories, repositories, units of work, and mixins. Use when choosing composition versus inheritance, building polymorphic lifecycles, constructing validated objects, defining persistence ports, or sharing behavior across class hierarchies.
metadata:
  version: "4.0.0"
  domain: language
  role: specialist
  scope: architecture
  output-format: code
---

# Designing TypeScript Objects

## Workflow

Flow: behavior → owner → abstraction → lifecycle → construction → persistence → proof

1. Identify coherent behavior and invariants before selecting a pattern.
2. Assign one named owner to each behavior, dependency, and lifecycle.
3. Choose interfaces for ports and capabilities, abstract classes for shared state and invariant-preserving lifecycles, concrete classes for implementation, and aliases for computed relationships.
4. Design narrow public operations and protected extension hooks. Verify substitutability at every inheritance level.
5. Establish complete valid objects through constructors, factories, staged builders, or schema validation.
6. Keep persistence mapping and transaction ownership at adapters and units of work.
7. Prove behavior with concrete fakes or in-memory implementations and repository checks.

## Architectural stance

Abstraction, inheritance, polymorphism, factories, repositories, units of work, staged builders, and deep class hierarchies are appropriate when every layer owns coherent behavior or an invariant. Composition is an option, not a reflexive replacement for inheritance.

```ts
abstract class ImportJob<Input, Output> {
  async execute(input: Input): Promise<Output> {
    await this.before(input);
    return this.perform(input);
  }

  protected async before(input: Input): Promise<void> {
    void input;
  }

  protected abstract perform(input: Input): Promise<Output>;
}
```

The base owns the lifecycle; subclasses own only the variable operation.

## Routes

- Load `references/object-oriented-design.md` for interfaces, abstract classes, inheritance, composition, and Template Method hooks.
- Load `references/construction-patterns.md` for factories, constructors, staged builders, and polymorphic products.
- Load `references/persistence-patterns.md` for repositories, specifications, transactions, and units of work.
- Load `references/mixins-and-inheritance.md` when shared capabilities cross class hierarchies.

## Constraints

Keep callable contracts free of explicit `any`, open dictionaries, and fabricated generic returns. Inject owned ports instead of mocking modules. Use reflective dispatch only when a platform contract makes it irreducible and document the safety boundary.

## Completion

Report every abstraction's owner and purpose, lifecycle and construction invariants, persistence boundaries, tests, and validation outcomes.
