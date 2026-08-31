# Effective TypeScript exclusions

This non-normative audit records guidance intentionally excluded while integrating the useful material from the former `writing-effective-typescript` skill.

Excluded recommendations:

- exposed `unknown` parameters and returns;
- hand-written external type guards and runtime `typeof` decoding;
- hidden assertions treated as sufficient proof;
- explicit or evolving `any` as an accepted implementation tool;
- open `Record<string, unknown>` contracts;
- `Partial<T>` accumulation followed by `as T`;
- generic returns chosen by callers without an input relationship;
- deliberate excess-property-check bypasses;
- assertion-based `Object.keys` access;
- universal `skipLibCheck` guidance;
- functional collection operators elevated above OOP or imperative clarity.

Preserved and rewritten material includes the type-system mental model, domain-state modeling, type derivation, conditional distribution, template literals, variadic tuples, currying inference, code generation, readonly design, public API documentation, type tests, source maps, and compiler diagnostics.
