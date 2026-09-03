---
name: authoring-pi-resources
description: Authors and packages Pi skills, prompt templates, context instructions, and resource-only packages. Use when creating SKILL.md files, prompts/*.md, AGENTS.md guidance, package.json pi manifests, or installing reusable Pi workflows without extensions.
metadata:
  version: "0.1.0"
---

# Authoring Pi Resources

Spend always-loaded context only on routing and project invariants.

## Workflow

1. Choose skill, prompt template, context instruction, or package using `references/resources.md`. **Complete when:** invocation, scope, and context cost match the artifact.
2. Define the user branch and a checkable outcome before writing. **Complete when:** the artifact has one job and an observable done state.
3. Write the smallest surface; move branch-specific depth into one-level references or assets. **Complete when:** every always-loaded line changes behavior.
4. Validate names, frontmatter, arguments, links, and package paths. **Complete when:** `validate-pi-harness.py` reports no errors.
5. Load explicitly first (`--skill`, `--prompt-template`, or local package), then test discovery and invocation. **Complete when:** startup reports the resource and one realistic invocation reaches it.
6. Package with `pi.skills`/`pi.prompts` and `pi-package` metadata. **Complete when:** `pi install <local-path>` and `pi config` expose only intended resources.

## Guardrails

- Skills and packages are executable trust surfaces even without extensions; review scripts and instructions.
- Context files hold durable project invariants, not cached command output or broad tutorials.
- Prompt templates orchestrate a known workflow; skills teach reusable capability.
- Extension resources are out of scope.

## References

- `references/resources.md` — artifact selection, contracts, discovery, and packaging
- `../../assets/AGENTS.pi.md` — optional project instruction fragment; copy deliberately, never assume auto-loading
