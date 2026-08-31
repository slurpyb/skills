---
name: designing-typescript-types
description: Designs and verifies TypeScript type relationships through inference, generics, conditional and mapped types, template literals, variadic tuples, correlated contracts, and utility types. Use when authoring advanced types, debugging assignability or inference, correlating event or endpoint keys with values, testing rejected calls, or simplifying expensive generic designs.
metadata:
  version: "4.0.0"
  domain: language
  role: specialist
  scope: type-system
  output-format: code
---

# Designing TypeScript Types

## Workflow

Flow: relationship → evidence → encode → inspect → prove → measure

1. State the relationship in domain terms and name its owner.
2. Identify the value-level evidence: input, key, token, constructor, schema, discriminator, or enclosing class.
3. Encode the smallest readable relationship with inference first and generic machinery only where needed.
4. Inspect inferred and emitted types through editor or LSP navigation.
5. Add compile-time fixtures for expected inference and rejected calls; keep runtime tests for behavior.
6. Measure expensive designs with `tsc --extendedDiagnostics` and simplify before increasing compiler limits.

## Evidence policy

- A function-level output-only generic is unsafe unless value evidence or a class-level relationship establishes it.
- Preserve literals with `as const`; check compatibility with `satisfies`.
- Keep explicit `any`, bare `object`, callable top types, unsafe dictionaries, and unsupported assertion chains out of contracts.
- Prefer shallow transformations. Generate large external contracts from schemas.
- Treat “a type parameter should appear twice” as a smell detector, not a law.

```ts
type Events = {
  created: { id: string };
  closed: { id: string; reason: string };
};

declare function emit<Name extends keyof Events>(
  name: Name,
  event: Events[Name],
): void;
```

`name` supplies the evidence that selects the event contract.

## Routes

- Load `references/mental-model.md` for assignability, structural typing, erasure, runtime identity, and host types.
- Load `references/advanced-types.md` for generics, conditional and mapped types, template literals, variadic tuples, and recursion.
- Load `references/utility-types.md` when deriving one known owner contract from another.
- Load `references/event-contracts.md` when keys select correlated event, command, or endpoint values.
- Load `references/type-testing.md` for inference fixtures, rejected calls, modifiers, distribution, and declaration output.

## Completion

Report the relationship, its evidence source, public contract, fixtures, diagnostics, and remaining complexity. Complete only when unsupported calls fail and intended inference remains stable.
