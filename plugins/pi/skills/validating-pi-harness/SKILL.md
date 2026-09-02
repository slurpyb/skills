---
name: validating-pi-harness
description: Audits Pi packages, skills, prompts, settings, models, and tool definitions with deterministic checks. Use when reviewing a Pi harness, debugging resource discovery, checking package readiness, or interpreting validate-pi-harness.py findings.
metadata:
  version: "0.1.0"
---

# Validating a Pi Harness

Validate static contracts first, then prove runtime discovery and routing.

## Workflow

1. Read `references/validation.md` and choose package, project, or artifact scope. **Complete when:** the audit root and expected resources are listed.
2. Run `python3 <plugin-root>/scripts/validate-pi-harness.py <path>`; add `--json` for automation. **Complete when:** every finding is captured with severity and check id.
3. Fix errors before warnings; confirm heuristic warnings against source and runtime behavior. **Complete when:** static validation exits zero and no warning is silently ignored.
4. Inspect Pi's observable surface with startup diagnostics, `pi config`, `/model`, or SDK `ResourceLoader` diagnostics. **Complete when:** expected names appear once and unexpected resources do not load.
5. Exercise one invocation per resource and one negative trigger per model-callable skill/tool. **Complete when:** discovery, routing, execution, and failure recovery are proven separately.
6. Record environment, Pi version, model, commands, and residual risks. **Complete when:** another operator can reproduce the audit.

## Guardrails

- Static source checks are heuristic and never substitute for TypeScript, tests, or a smoke run.
- Validation reads credentials only as syntax; report names and locations, never resolved secret values.
- Project trust differences between interactive and non-interactive runs belong in the audit record.
- Extension validation is out of scope.

## References

- `references/validation.md` — checks, severity, runtime probes, and evidence format
