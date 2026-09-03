---
name: designing-typescript-types
description: Designs and tests TypeScript inference and generic relationships. Use when working with conditional or mapped types, correlated key/value APIs, variadic tuples, type recursion, or compile-time fixtures.
metadata:
  version: "4.2.0"
  domain: language
  role: specialist
  scope: type-system
  output-format: code
---

# Designing TypeScript Types

## Workflow

Flow: relationship → evidence → encode → inspect → prove → measure

1. **Relationship:** state the relationship in domain terms and name its owner. Complete when valid and rejected calls can be described without type-system syntax.
2. **Evidence:** identify the input, key, token, constructor, schema, discriminator, or enclosing class that establishes the relationship. Complete when every output choice traces to value-level or class-level evidence.
3. **Encode:** implement the smallest readable relationship, starting with inference. Complete when the public signature expresses the relationship without unsupported assertions.
4. **Inspect:** examine inferred and emitted types through editor or LSP navigation. Complete when the consumer-visible type is known rather than guessed.
5. **Prove:** add compile-time fixtures for expected inference and rejected calls. Complete when each important relationship has positive and negative evidence.
6. **Measure:** use `tsc --extendedDiagnostics` for expensive designs. Complete when measured cost is acceptable or the design has been simplified.

## Evidence

- Function-level generic outputs trace to an input, token, constructor, schema, discriminator, or class-level parameter.
- `as const` preserves literals and `satisfies` checks compatibility without replacing inference.
- Callable contracts carry concrete owner types; pure type-level constraints may use top types.
- Shallow transformations are the default; schemas generate large external contracts.
- “A type parameter should appear twice” is a smell detector rather than a law.

## Routes

- Load `references/mental-model.md` when assignability, erasure, structural typing, runtime identity, or host types are unclear.
- Load `references/advanced-types.md` when conditional types, mapped types, template literals, variadic tuples, or recursion encode the relationship.
- Load `references/utility-types.md` when deriving one owner contract from another.
- Load `references/event-contracts.md` when a key selects an event, command, or endpoint value contract.
- Load `references/type-testing.md` when inference or rejected calls require compile-time fixtures.

## Completion

Report the relationship, evidence source, public contract, fixtures, diagnostics, and measured complexity. Intended inference must remain stable and unsupported calls must fail.
