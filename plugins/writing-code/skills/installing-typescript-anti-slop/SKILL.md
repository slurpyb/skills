---
name: installing-typescript-anti-slop
description: Installs the bundled anti-slop Oxlint policy. Use when installing or migrating that policy, configuring its local plugin and Effect rule, or updating its rule bundle.
metadata:
  version: "4.2.0"
  domain: tooling
  role: specialist
  scope: lint-policy
  output-format: config
---

# Installing TypeScript Anti-Slop

## Workflow

Flow: inspect → copy → depend → configure → migrate → verify

1. **Inspect** repository instructions, `git status`, package manager, Oxlint configuration, local plugins, direct Effect dependency, and destination. Complete when existing policy and unrelated work are accounted for.
2. **Copy** the bundled plugin from the target repository. Complete when the destination is new, or an existing destination has been backed up and its replacement diff reviewed.

   ```bash
   node <skill-directory>/scripts/install-anti-slop.mjs [destination]
   ```

   The default destination is `tools/oxlint/anti-slop/`; reviewed replacement requires explicit `--force`.

3. **Depend** on current compatible `oxlint` and `@oxlint/plugins` versions through the existing package manager. Complete when both direct development dependencies use the same version.
4. **Configure** the copied plugin with `references/anti-slop-configuration.md`. Complete when every exported generic rule is an error, ignores cover installed tooling, and Effect activation matches direct dependency or explicit user intent.
5. **Migrate** owned findings within the requested scope. Complete when each remaining finding is fixed or reported without changing policy strength.
6. **Verify** repository lint and typecheck, plus full `vp check` when Vite+ owns those checks. Complete when applicable checks pass or every residual owned finding is reported.

## Completion

Report copied path, package versions, configuration changes, migration decisions, validation outcomes, and plugin limitations.
