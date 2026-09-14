# MCP Tools Reference

The Skill Seekers MCP server exposes the toolkit to AI agents over Model Context
Protocol. v3.5.0 ships **40 tools across 10 categories**. When the server is
connected, drive it by **natural language** — the agent picks the tool. You do not
need to shell out to the CLI.

> Tool counts vary by host: Claude Code (stdio) gets the full set; Cursor/Windsurf/
> IntelliJ (HTTP) expose ~18 core tools; VS Code+Cline ~20.

## Table of contents
- [Setup (stdio & HTTP)](#setup)
- [Tool catalog](#tool-catalog)
- [Natural-language phrasings](#natural-language-phrasings)
- [Common MCP workflows](#common-mcp-workflows)
- [Troubleshooting](#troubleshooting)

---

## Setup

**One-command (recommended):**
```bash
git clone https://github.com/yusufkaraaslan/Skill_Seekers.git && cd Skill_Seekers
./setup_mcp.sh        # detects installed agents, configures all, starts HTTP if needed
```

**Manual install:**
```bash
pip install -e ".[mcp]"          # or: pip install mcp anthropic-mcp fastmcp
python -m skill_seekers.mcp.server_fastmcp            # stdio (default)
python -m skill_seekers.mcp.server_fastmcp --http --port 3000   # HTTP
```

**Transport by agent:**

| Agent | Transport | Config file (macOS) |
| --- | --- | --- |
| Claude Code | stdio | `~/Library/Application Support/Claude/mcp.json` |
| VS Code + Cline | stdio | `…/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` |
| Cursor | HTTP | `~/Library/Application Support/Cursor/mcp_settings.json` |
| Windsurf | HTTP | `~/Library/Application Support/Windsurf/mcp_config.json` |
| IntelliJ IDEA | HTTP | `…/JetBrains/IntelliJIdea<ver>/mcp.xml` |

**stdio config (Claude Code, Cline):**
```json
{ "mcpServers": { "skill-seeker": {
  "command": "python", "args": ["-m", "skill_seekers.mcp.server_fastmcp"] } } }
```

**HTTP config (Cursor, Windsurf, IntelliJ)** — start the server first, then:
```json
{ "mcpServers": { "skill-seeker": { "url": "http://localhost:3000/sse" } } }
```

HTTP endpoints: health `GET /health`, SSE `/sse`. Restart the host app after editing
config. Verify in Claude Code by asking "What Skill Seekers tools do you have?"

---

## Tool catalog

### Skill creation (8)
`scrape_docs`, `scrape_github`, `scrape_pdf`, `unified_scrape`, `create_skill`
(from local files), `clone_skill`, `merge_skills`, `split_skill`.

### Analysis — C3.x (6)
`analyze_codebase`, `detect_patterns`, `extract_tests`, `generate_guides`,
`analyze_config`, `generate_architecture`.

### Enhancement (4)
`enhance_skill`, `improve_descriptions`, `add_examples`, `validate_skill`.

### Packaging (4)
`package_for_claude`, `package_for_langchain`, `package_for_llamaindex`,
`package_for_coding` (Cursor/Windsurf/Cline IDE rules).

### Configuration / utility (4)
`list_configs`, `validate_config`, `estimate_job`, `resume_job`.

### Config generation & sources (lower-level server tools)
`generate_config`, `fetch_config`, `submit_config`, `add_config_source`,
`list_config_sources`, `remove_config_source`, `split_config`, `generate_router`,
`estimate_pages`, `package_skill`, `upload_skill`, `install_skill`.

### Key tool parameters
```jsonc
// scrape_docs
{ "url": "https://react.dev", "max_pages": 100,
  "selectors": { "content": "article" }, "output_dir": "./output/react" }

// scrape_github
{ "repo": "facebook/react", "include_issues": false,
  "include_tests": true, "output_dir": "./output/react-github" }

// analyze_codebase  (full C3.x)
{ "directory": "./my-project", "comprehensive": true, "output_format": "claude" }

// enhance_skill     (mode "local" = FREE; prefer it)
{ "skill_path": "./output/react", "method": "local", "platform": "claude" }

// package_for_claude
{ "skill_path": "./output/react", "include_router": true }

// generate_config
{ "name": "myframework", "url": "https://docs.myframework.com/",
  "description": "My Framework documentation" }

// estimate_job      (check cost/time before running)
{ "config": "configs/react.json", "include_enhancement": true }
```

---

## Natural-language phrasings

The host maps these to tools automatically:

- "Scrape the React docs (max 50 pages)" → `scrape_docs`
- "Analyze facebook/react with tests" → `scrape_github`
- "Analyze this codebase comprehensively" → `analyze_codebase`
- "Detect design patterns in src/" → `detect_patterns`
- "Generate an ARCHITECTURE doc" → `generate_architecture`
- "Enhance my skill (free/local)" → `enhance_skill` (`method: local`)
- "Validate this skill / config" → `validate_skill` / `validate_config`
- "Estimate how long the React scrape will take" → `estimate_job`
- "Package for Claude with a router" → `package_for_claude`
- "Generate a config for docs.myframework.com" → `generate_config`

---

## Common MCP workflows

**Quick skill:** `scrape_docs` → `enhance_skill` → `package_for_claude` → `validate_skill`.

**Codebase analysis:** `analyze_codebase` → `detect_patterns` → `extract_tests` →
`generate_guides` → `package_for_coding`.

**Multi-source:** `unified_scrape` → `merge_skills` → `enhance_skill` → `package_for_langchain`.

---

## Troubleshooting

- **Tools missing:** re-run `./setup_mcp.sh`; fully restart the host app; test the
  server directly with `python -m skill_seekers.mcp.server_fastmcp`.
- **`ModuleNotFoundError: mcp`:** `pip install -e ".[mcp]"`.
- **HTTP won't start:** port in use → `lsof -i :3000`, or use `--port 8080`.
- **Timeouts on long jobs:** raise the host's MCP timeout; use `estimate_job` first.
- **Inspect tools:** `npx @modelcontextprotocol/inspector python -m skill_seekers.mcp.server_fastmcp`.
