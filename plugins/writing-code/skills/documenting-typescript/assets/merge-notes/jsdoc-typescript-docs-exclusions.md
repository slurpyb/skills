# JSDoc skill exclusions

This non-normative audit records guidance excluded from the former `jsdoc-typescript-docs` skill.

Excluded:

- documenting every parameter and return when the signature is already sufficient;
- API examples returning unparsed `response.json()` values;
- caller-selected output-only generics such as `get<Result>(path): Promise<Result>`;
- `unknown` generic defaults exposed in request contracts;
- assertion- or lint-conflicting examples;
- enums as a universal state-modeling default;
- redundant `@optional`, `@readonly`, or type-restating prose;
- remembered TypeDoc dependency versions instead of current compatible versions;
- generated documentation and checked-in output as universal requirements.

Preserved and rewritten material includes behavior-first TSDoc, remarks, examples, throws, links, deprecation, type-parameter documentation, internal API marking, TypeDoc validation, and documentation CI.
