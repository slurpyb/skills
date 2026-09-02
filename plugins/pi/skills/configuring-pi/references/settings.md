# Settings and resource loading

## Ownership

| Concern | Location |
|---|---|
| Global defaults | `~/.pi/agent/settings.json` |
| Project overrides | `.pi/settings.json` |
| Custom model catalog | `~/.pi/agent/models.json` |
| Saved trust decisions | `~/.pi/agent/trust.json` |
| Process configuration | `PI_*`, proxy, and editor environment variables |

Project settings override global settings. Nested objects merge; arrays replace unless the specific resource/filter format says otherwise. Paths in global settings resolve from the agent directory. Paths in project settings resolve from `.pi`.

## High-value settings

- Model: `defaultProvider`, `defaultModel`, `defaultThinkingLevel`, `modelThinkingLevels`, `enabledModels`
- Tool surface: `defaultTools`, plus CLI `--tools`, `--exclude-tools`, `--no-tools`, and `--no-builtin-tools`
- Reliability: `compaction`, `retry`, `transport`, `httpIdleTimeoutMs`
- Resources: `packages`, `skills`, `prompts`, `extensions`, `themes`, `enableSkillCommands`
- Operations: `sessionDir`, `npmCommand`, `defaultProjectTrust`, `httpProxy`

Use `/settings` for common settings, `/model` or `/thinking` plus Ctrl+S for startup defaults, and `pi config` for package resource enablement.

## Trust

Interactive Pi prompts before loading untrusted project settings, `.pi` resources, packages, or project `.agents/skills`. Context files (`AGENTS.override.md`, `AGENTS.md`, `CLAUDE.md`) still load unless context loading is disabled. Non-interactive modes do not prompt. With no saved decision, `defaultProjectTrust: "ask"` and `"never"` ignore protected project resources; `"always"` loads them. `--approve` and `--no-approve` override one run. `/trust` saves a future decision and requires restart.

## Environment precedence

`--session-dir` overrides `PI_CODING_AGENT_SESSION_DIR`, which overrides `sessionDir`. `PI_CODING_AGENT_DIR` relocates the agent directory. `PI_OFFLINE=1` blocks startup network operations; `PI_SKIP_VERSION_CHECK=1` only skips the version request. `PI_TELEMETRY=0` disables install/update telemetry but not update checks.

## Completion

Configuration is complete when its owner, scope, precedence, trust behavior, and observable smoke check are all explicit.
