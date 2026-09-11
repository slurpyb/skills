---
description: Bootstrap a project with lean Pi instructions and resource configuration
argument-hint: "[project goal] [constraints]"
---
Use the `authoring-pi-resources` and `configuring-pi` skills.

Bootstrap Pi support for: `${ARGUMENTS:-this project}`

Inspect existing `AGENTS.md`, `.pi/settings.json`, `.pi/skills/`, and `.pi/prompts/` before writing. Adapt the package's `assets/AGENTS.pi.md` fragment rather than copying blindly. Preserve project instructions and choose the smallest project-local resource surface. Keep secrets external. Extensions are out of scope.

Done means the instruction diff contains only durable project invariants, project settings validate, a trust-aware restart discovers intended resources, and one disposable prompt follows the new guidance.
