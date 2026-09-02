---
description: Author a resource-only Pi package of skills and prompts
argument-hint: "<package capability> [distribution constraints]"
---
Use the `authoring-pi-resources` skill.

Create or revise a resource-only Pi package for: $ARGUMENTS

Choose skill, prompt, and context surfaces by invocation cost. Keep skill descriptions sharp, references one level deep, prompt arguments within Pi syntax, and package paths explicit. Include `pi-package` metadata and only `pi.skills`/`pi.prompts`; extensions are out of scope. Never embed credentials.

Done means the bundled validator passes, all links and manifest paths resolve, local-path installation succeeds, `pi config` exposes only intended resources, and one realistic invocation per resource reaches the expected workflow.
