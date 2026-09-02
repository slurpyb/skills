# Validation model

## Static checks

The bundled validator inspects:

- package manifest keyword, Pi resource paths, and no extension resource declaration
- skill frontmatter, naming, trigger descriptions, surface size, workflows, and local links
- prompt frontmatter, supported argument forms, and command-name collisions
- selected `settings.json` key types and unknown-key warnings
- `models.json` provider/model shape, supported APIs, and likely committed secrets
- TypeScript `defineTool` source conventions: imports, required fields, object schema, result channels, cwd, and ESM suffixes

Regex-based TypeScript findings are warnings unless a deterministic package/resource contract is broken. Run the language server/typecheck and direct tests for semantic proof.

## Runtime probes

Run `python3 <plugin-root>/scripts/smoke-pi-resources.py <package-root>` first. It starts Pi RPC with explicit skill/prompt paths, makes no model request, and proves every packaged command appears exactly once with the expected source type.

| Surface | Probe |
|---|---|
| Package resources | `pi config`, startup resource list |
| Skills | `/skill:name`, matching user request |
| Prompts | `/name` with empty/default and full args |
| Models | `pi --list-models`, `/model`, bounded request |
| Tools in SDK | inspect `session.agent.state.tools`, positive/negative trigger prompts |
| Project trust | interactive restart and non-interactive `--approve`/`--no-approve` comparison |

Use `--no-session` for disposable smoke runs. Use explicit resource flags with `--no-*` to isolate one suspect source.

## Evidence record

Capture:

- audit root and git revision
- Pi package version and runtime version
- global/project config paths involved
- trust mode and relevant environment variable names
- selected provider/model/reasoning level
- static command and exit code
- runtime probes and observed names
- every deferred warning with owner and reason

Never capture credential values, command-resolved secrets, auth files, or unredacted MCP recordings.

## Completion

An audit is complete when static errors are zero, warnings have dispositions, runtime discovery matches the manifest, positive and negative routing are checked, and the evidence record is reproducible without secrets.
