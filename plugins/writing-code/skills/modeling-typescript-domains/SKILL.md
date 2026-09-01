---
name: modeling-typescript-domains
description: Models TypeScript business invariants as value objects, commands, outcomes, and lifecycle states. Use when designing domain concepts or separating domain models from transport and persistence records.
metadata:
  version: "4.1.0"
  domain: language
  role: specialist
  scope: architecture
  output-format: code
---

# Modeling TypeScript Domains

## Workflow

Flow: vocabulary → invariants → states → transitions → boundaries → proof

1. **Vocabulary:** name each concept after its domain owner. Complete when every changed concept has one stable domain name.
2. **Invariants:** identify values that require validation and controlled construction. Complete when the public contract admits only valid values.
3. **States:** model finite lifecycle states and outcomes as discriminated unions. Complete when every valid combination is representable and each variant carries only its own data.
4. **Transitions:** place invariant-preserving behavior on entities, aggregates, or domain services. Complete when every state change has one named owner.
5. **Boundaries:** map transport and persistence records into domain values. Complete when external representations and incidental nullability remain in adapters.
6. **Proof:** test construction, rejection, transitions, and exhaustive handling. Complete when every public constructor and transition has success and rejection evidence where applicable.

## Rules

- Prefer readonly value objects and collections; expose mutation through invariant-preserving methods.
- Use a validated class or schema-derived owner type when nominal identity matters.
- Represent domain absence or failure with a named option or result when it is a real business concept.
- Accept the widest meaningful owner contract.
- Give commands, entities, transport values, and persistence records separate contracts when their semantics differ.
- Derive with `Partial<Entity>` only while the derived value retains entity semantics.

```ts
class AccountId {
  private constructor(readonly value: string) {}

  static parse(value: string): AccountId {
    if (!value.startsWith("acct_")) throw new Error("Invalid account ID");
    return new AccountId(value);
  }
}

type TransferState =
  | { status: "requested" }
  | { status: "settled"; settledAt: Date }
  | { status: "rejected"; reason: string };
```

## Completion

Report vocabulary, invariants, valid states, transition owners, boundary mappings, and proof. The public contract must make invalid combinations unconstructable.
