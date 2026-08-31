---
name: configuring-typescript
description: Configures TypeScript compiler and package boundaries for applications and published libraries. Use when editing tsconfig files, module or target settings, project references, declaration output, package exports, strictness options, source maps, or compiler performance.
metadata:
  version: "4.0.0"
  domain: language
  role: specialist
  scope: configuration
  output-format: config
---

# Configuring TypeScript

## Workflow

Flow: inspect → classify → configure → package → measure → gate

1. Inspect inherited configs, framework presets, runtime, bundler, package role, supported TypeScript versions, and repository commands.
2. Classify each package as an application, published library, tooling package, or genuine project-reference boundary.
3. Make the smallest justified option changes while preserving framework requirements.
4. For libraries, verify declarations, declaration maps, output directories, source maps, package exports, and lowest supported targets.
5. Use `tsc --extendedDiagnostics` before optimizing compiler performance.
6. Run repository lint and every affected typecheck.

## Defaults to evaluate

For applications, evaluate `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, `isolatedModules`, and `noEmit` against repository and framework constraints.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

This is an evaluation baseline, not a preset to overwrite inherited framework configuration.

- Match `module` and `moduleResolution` to the actual runtime or bundler.
- Use project references for real package boundaries rather than arbitrary folders.
- Include owned scripts and exclude generated or vendored output.
- Keep strict null checking enabled.
- Treat `skipLibCheck` as a measured compatibility or performance decision.
- Test published libraries against their lowest supported TypeScript and runtime targets.

## Completion

Report each changed option and its reason, package and runtime assumptions, diagnostics before and after performance work, validation commands, and remaining compatibility risks.
