---
name: documenting-typescript
description: Documents behavior and extension contracts in TypeScript source and generated API references. Use when writing TSDoc, configuring TypeDoc, or improving a published library surface.
metadata:
  version: "4.1.0"
  domain: documentation
  role: specialist
  scope: public-api
  output-format: documentation
---

# Documenting TypeScript

## Workflow

Flow: audience → contract → source → examples → publication → validation

1. **Audience:** identify consumers, extension authors, maintainers, and reference readers. Complete when each changed contract has a named audience.
2. **Contract:** inspect exports, overloads, declarations, and non-obvious local helpers. Complete when every behavior invisible to the type signature is identified.
3. **Source:** document invariants, lifecycle, side effects, ordering, caching, failure, defaults, and extension rules. Complete when each identified behavior is available at its declaration.
4. **Examples:** add examples where usage remains ambiguous. Complete when every added example is linted and typechecked where practical.
5. **Publication:** preserve repository ownership and current compatible tooling. Complete when generated scope, visibility, and artifact ownership are explicit.
6. **Validation:** run documentation, declaration, link, example, lint, and type checks that apply. Complete when owned documentation findings are zero.

## Principle

Document contracts the type system cannot express. Names, syntax, and parameter types remain the type signature's job.

## Routes

- Load `references/source-comments.md` when writing JSDoc or TSDoc for exported declarations, extension hooks, or local helpers.
- Load `references/public-api-quality.md` when shaping exports, declarations, inference, or compatibility for library consumers.
- Load `references/typedoc.md` when configuring TypeDoc, publishing API references, or validating documentation in CI.

## Completion

Report documented contracts, export decisions, example validation, publication checks, and residual limitations.
