# Pi harness guidance

Use this as a source fragment for a project's `AGENTS.md`; tailor it to the project. This file is not loaded automatically from the package.

- **Source of truth:** Read installed Pi docs and the project's actual config before changing harness behavior. Treat generated examples and remembered flags as hints until verified.
- **Scope:** Put global operator defaults in `~/.pi/agent/settings.json` and project behavior in `.pi/settings.json`. Record project-trust requirements for non-interactive runs.
- **Surface:** Keep always-loaded instructions to durable invariants and source pointers. Put reusable workflows in skills and repeatable task kickoffs in prompt templates.
- **Tight loop:** Test tool logic by calling `execute()` directly, then typecheck, then smoke routing in Pi. Use SDK `customTools` for project integrations.
- **Honesty:** Put exact evidence in tool `details` and complete model-facing outcomes in `content`. Report partial and cancelled work explicitly.
- **Secrets:** Resolve credentials from environment variables, Pi login storage, or command-backed configuration. Commit placeholders and variable names only.
- **Validation:** Run the Pi harness validator after changing package manifests, skills, prompts, settings, models, or tool definitions; then verify runtime discovery separately.
- **Boundary:** Build skills, prompts, packages, SDK integrations, and SDK-native tools here. Plan extension authoring as a separate change.
