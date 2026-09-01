---
name: designing-typescript-objects
description: Designs TypeScript object lifecycles with interfaces, abstract classes, factories, and repositories. Use when behavior needs polymorphism, validated construction, transaction ownership, or shared class capabilities.
metadata:
  version: "4.2.0"
  domain: language
  role: specialist
  scope: architecture
  output-format: code
---

# Designing TypeScript Objects

## Workflow

Flow: behavior → owner → abstraction → lifecycle → construction → persistence → proof

1. **Behavior:** identify coherent behavior and invariants before selecting a pattern. Complete when every proposed abstraction protects named behavior or an invariant.
2. **Owner:** assign each behavior, dependency, and lifecycle to one contract. Complete when ownership is unambiguous at every changed boundary.
3. **Abstraction:** choose interfaces for ports, abstract classes for shared lifecycles, concrete classes for implementation, and aliases for computed relationships. Complete when each form matches what it must own.
4. **Lifecycle:** design public operations and protected extension hooks. Complete when every subclass preserves base preconditions, results, and invariants.
5. **Construction:** establish complete objects through constructors, factories, staged builders, or schema validation. Complete when public construction yields valid complete instances.
6. **Persistence:** map records at adapters and bind repositories to explicit transaction scope. Complete when commit, rollback, and mapping each have one owner.
7. **Proof:** test through owned ports and concrete fakes or in-memory implementations. Complete when lifecycle, construction, persistence, and substitution paths are exercised where applicable.

## Stance

Abstraction, inheritance, polymorphism, and deep hierarchies earn their place by owning coherent behavior or an invariant. Composition fits independently varying capabilities; inheritance fits stable lifecycles with narrow hooks.

## Routes

- Load `references/object-oriented-design.md` when choosing interfaces, abstract classes, inheritance, composition, or Template Method hooks.
- Load `references/construction-patterns.md` when construction needs validation, staged inputs, dependency selection, or polymorphic products.
- Load `references/persistence-patterns.md` when domain objects cross persistence boundaries or operations require atomic commit.
- Load `references/mixins-and-inheritance.md` when behavior must be shared across class hierarchies.

## Completion

Report each abstraction's owner and purpose, lifecycle and construction invariants, persistence boundaries, proof, and validation outcomes.
