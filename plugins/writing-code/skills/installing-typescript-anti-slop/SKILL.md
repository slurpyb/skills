---
name: installing-typescript-anti-slop
description: Installs and configures the bundled anti-slop Oxlint plugin for strict TypeScript evidence and boundary policies. Use when a user asks to install, migrate, update, or configure anti-slop rules, local Oxlint plugins, Effect service import policy, or the bundled writing-code lint policy.
metadata:
  version: "4.0.0"
  domain: tooling
  role: specialist
  scope: lint-policy
  output-format: config
---

# Installing TypeScript Anti-Slop

## Workflow

Flow: inspect → copy → configure → migrate → verify

1. Read repository instructions and `git status`. Detect the package manager, Oxlint configuration, local plugins, direct Effect dependency, and existing destination.
2. Load `references/anti-slop-installation.md` and copy the bundled plugin without overwriting unrelated work.
3. Query current compatible `oxlint` and `@oxlint/plugins` versions. Preserve the package manager and install matching versions.
4. Load `references/anti-slop-configuration.md`; merge plugin entries, ignores, and every generic rule at `"error"`.
5. Activate the Effect rule only for a direct dependency or explicit request.
6. Run repository lint and typecheck. Run the full `vp check` when Vite+ owns those checks.
7. Report owned-source findings without suppression, unsafe casts, severity weakening, or type laundering.

## Bundled installer

From the target repository:

```bash
node <skill-directory>/scripts/install-anti-slop.mjs [destination]
```

The default destination is `tools/oxlint/anti-slop/`. Existing destinations require review before explicit `--force` replacement.

## Completion

Report the copied path, package versions, configuration changes, validation outcomes, migration decisions, and remaining findings or plugin limitations.
