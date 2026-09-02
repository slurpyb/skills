# Pi Harness

Resource-only toolkit for configuring, composing, and validating the Pi coding harness. Extension authoring is intentionally excluded.

## Install

After npm publication:

```bash
pi install npm:@slurpyb/pi-harness
pi config
```

For a local checkout, install the package directory itself:

```bash
pi install -l ./plugins/pi
```

Claude-compatible consumers can install the `pi` entry from this repository's marketplace.

## Skills

- `configuring-pi` — settings, models, resources, trust, and precedence
- `building-pi-tools` — TypeBox contracts, honest results, direct tests, SDK `customTools`
- `building-with-pi-sdk` — sessions, runtimes, resources, models, persistence, lifecycle
- `authoring-pi-resources` — skills, prompts, context guidance, resource-only packages
- `reconstructing-mcp-tools` — focused MCP-to-Pi reconstruction and offline fixtures
- `validating-pi-harness` — deterministic and runtime audit workflow

## Prompt templates

Pi loads the package's non-recursive `prompts/` directory. Available templates:

- `/pi-tool`
- `/pi-sdk`
- `/pi-config`
- `/pi-package`
- `/pi-mcp-reconstruct`
- `/pi-audit`
- `/pi-bootstrap`

## Validate

```bash
cd plugins/pi
python3 scripts/validate-pi-harness.py .
python3 scripts/validate-pi-harness.py /path/to/project --json
python3 scripts/smoke-pi-resources.py .
python3 -m unittest discover -s tests -p 'test_*.py'
```

The validator checks package/resource contracts, skills, prompts, selected settings/model schemas, secret hygiene, and heuristic `defineTool` source conventions. TypeScript findings remain warnings: compiler diagnostics and direct tool tests are still required. The RPC smoke script makes no model request; it proves each packaged skill and prompt is discovered exactly once with the expected source type.

## Project instruction fragment

`plugins/pi/assets/AGENTS.pi.md` is a source fragment. Tailor and merge it into a project's own `AGENTS.md`; package installation does not auto-load the asset.
