---
name: configuring-typescript
description: Configures TypeScript compiler and package boundaries. Use when editing tsconfig, module resolution, project references, declaration emit, target support, or compiler performance.
metadata:
  version: "4.2.0"
  domain: language
  role: specialist
  scope: configuration
  output-format: config
---

# Configuring TypeScript

## Workflow

Flow: inspect → classify → configure → package → measure → gate

1. **Inspect** inherited configs, framework presets, runtime, bundler, supported versions, and repository commands. Complete when every effective source of compiler behavior is identified.
2. **Classify** each affected package as an application, published library, tooling package, or project-reference boundary. Complete when each package has one explicit role.
3. **Configure** the smallest justified option set for that role. Complete when every changed option has a runtime, framework, package, or correctness reason.
4. **Package** declarations, maps, outputs, and exports where the package role requires them. Complete when consumer resolution matches the supported runtimes and TypeScript versions.
5. **Measure** compiler performance before tuning it. Complete when diagnostics identify the cost or show that tuning is unnecessary.
6. **Gate** with repository lint and every affected typecheck. Complete when checks pass with zero owned configuration findings.

## Routes

- Load `references/applications.md` when configuring an application or framework package.
- Load `references/libraries.md` when configuring a published package, declaration output, exports, or source maps.
- Load `references/compiler-performance.md` when typechecking is slow, memory-heavy, or dominated by generic instantiation.

## Completion

Report changed options and reasons, package roles, runtime assumptions, measured diagnostics, validation outcomes, and compatibility risks.
