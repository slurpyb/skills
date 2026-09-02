---
description: Audit a Pi harness package or project with static and runtime evidence
argument-hint: "[path] [focus]"
---
Use the `validating-pi-harness` skill.

Audit `${1:-.}`. Additional focus: `${@:2}`

Run the bundled validator first, then inspect runtime discovery, trust, resource names, model availability, and SDK tool exposure as applicable. Treat source checks as heuristic; confirm with typecheck, tests, and bounded smokes. Report credential names/locations only, never values. Extension validation is out of scope.

Done means static errors are zero, every warning has a disposition, expected resources appear exactly once, positive/negative routing has evidence, and the audit record includes commands, versions, trust mode, and residual risks.
