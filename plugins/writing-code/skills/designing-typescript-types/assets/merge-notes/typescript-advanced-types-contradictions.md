# Excluded advanced-types guidance

This is a non-normative merge audit. The following recommendations from the former `typescript-advanced-types` skill were intentionally not merged because they contradict the anti-slop policy owned by `writing-typescript`.

| Excluded guidance                                                      | Conflict                                                     | Adopted replacement                                                  |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| `any` in conditional types, event maps, state, and API clients         | Explicit `any` defeats evidence and fails lint               | Named contracts, inferred elements, or constrained generics          |
| `Record<string, any>` generic bounds                                   | Unsafe open dictionary                                       | Key-correlated mapped types without an open bound                    |
| `unknown` parameters and aliases                                       | Unknown values flowed into helpers instead of being decoded  | Parse at I/O boundaries into domain or `JsonValue` contracts         |
| Runtime `typeof` guards over external values                           | Representation checks do not establish the expected contract | Schema parsing, then discriminant narrowing                          |
| Assertion functions over unparsed input                                | Assertions claimed validity without decoding                 | Schema parse results                                                 |
| Builders using `{}` assertions, `return this as any`, and `state as T` | Chained/widen-then-assert construction                       | Staged types or schema validation at `build()`                       |
| API clients returning `{}` through an assertion                        | Fabricated response contract                                 | Parse the transport response before returning                        |
| Broad `object`/`Function` recursion examples                           | Contracts were structural and overly broad                   | Small owned capabilities and bounded domain recursion                |
| “Skip type checking in production” as general advice                   | Can omit the required typecheck gate                         | Run a separate required typecheck even when bundling transpiles only |

Compatible material—capability constraints, mapped and conditional types, template literal types, correlated key/value APIs, compile-time type tests, and complexity limits—was rewritten into normative references.
