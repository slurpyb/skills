# Anti-slop installation

Load when installing or migrating the bundled Oxlint plugin. Why: copying and dependency changes must preserve existing tooling and unrelated work.

1. Read agent instructions and `git status`. Detect the package manager, Oxlint config, local plugins, and existing destination.
2. From the target repository, run:

   ```bash
   node <skill-directory>/scripts/install-anti-slop.mjs
   ```

   The default destination is `tools/oxlint/anti-slop/`. Pass a relative destination when the repository has another tooling layout. The script refuses an existing destination; use `--force` only after backing it up and reviewing the diff.

3. Query current versions with `npm view oxlint version` and `npm view @oxlint/plugins version`. Install the same version of both as development dependencies using the existing package manager.
4. Load `anti-slop-configuration.md` and merge its plugin, ignores, and rules. Preserve every existing setting.
5. Run the repository lint and typecheck commands. For Vite+, run the full `vp check` after adding both lint and formatter ignores.
6. Fix owned-source findings only when migration or cleanup is in scope. Do not suppress rules, weaken severity, add unsafe casts, or mechanically launder types.
7. Report the copied path, package versions, configuration changes, checks, and remaining findings.

When replacing an older local copy, compare its rules and diagnostics before overwriting. Keep project-specific policy in a separate plugin.

Next: load `anti-slop-configuration.md` after the plugin is copied; otherwise this step ends here.
