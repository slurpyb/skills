---
name: modeling-typescript-domains
description: Models TypeScript domains with entities, value objects, commands, outcomes, invariants, and explicit lifecycle states. Use when defining business concepts, removing invalid state combinations, replacing primitive or branded values, designing nullability, or separating domain models from DTOs and persistence records.
metadata:
  version: "4.0.0"
  domain: language
  role: specialist
  scope: architecture
  output-format: code
---

# Modeling TypeScript Domains

## Workflow

Flow: vocabulary → invariants → states → transitions → boundaries → proof

1. **Vocabulary:** name each contract after its domain owner rather than its storage shape.
2. **Invariants:** identify values that require validation and construction rules. Complete when public construction cannot bypass them.
3. **States:** model finite lifecycle states and outcomes as discriminated unions. Complete when dependent optional fields and sentinels are gone.
4. **Transitions:** place invariant-preserving behavior on entities, aggregates, or domain services. Complete when every mutation has a named owner.
5. **Boundaries:** map DTOs and persistence records into domain values once. Complete when incidental nullability and representations stay at adapters.
6. **Proof:** test valid construction, rejection, transitions, and exhaustive handling.

## Rules

- Prefer readonly value objects and collections. Keep mutation behind invariant-preserving methods.
- Use a validated class or schema-derived owner type when nominal identity matters.
- Keep absence or failure in the domain only when it is a real concept, represented by a named option or result.
- Accept the widest meaningful owner contract, not the widest structurally possible input.
- Use separate named contracts when commands, entities, DTOs, and persistence records have different semantics.
- Use `Partial<Entity>` only when the derived value genuinely retains entity semantics.

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

Report the vocabulary, invariants, valid states, transition owners, boundary mappings, and tests. The model is complete when invalid combinations cannot be constructed through its public contract.
