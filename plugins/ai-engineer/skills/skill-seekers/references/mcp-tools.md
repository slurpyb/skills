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

All 40, verified against `mcp/server_fastmcp.py` in the installed source. Every
name below is a registered `@mcp.tool`.

### Scraping — build a skill from a source (6)
| Tool | Does |
|---|---|
| `scrape_docs` | Scrape a documentation site |
| `scrape_github` | Scrape a GitHub repository |
| `scrape_pdf` | Scrape PDF documentation |
| `scrape_video` | Scrape video content |
| `scrape_codebase` | Analyse a local codebase |
| `scrape_generic` | Jupyter, HTML, OpenAPI, AsciiDoc, PPTX, RSS, manpage, Confluence, Notion, chat |

### Analysis — C3.x (4)
| Tool | Does |
|---|---|
| `detect_patterns` | Detect design patterns in source code |
| `extract_test_examples` | Extract usage examples from test files |
| `build_how_to_guides` | Build how-to guides from workflow test examples |
| `extract_config_patterns` | Extract configuration patterns, optionally AI-enhanced |

### Config authoring (5)
| Tool | Does |
|---|---|
| `generate_config` | Generate a config from a URL |
| `list_configs` | List preset configurations |
| `validate_config` | Validate a config for errors |
| `sync_config` | Re-check a config's `start_urls` against the live site |
| `estimate_pages` | Estimate page count before committing to a run |

### Config sharing (6)
| Tool | Does |
|---|---|
| `fetch_config` | Fetch from API, git URL, or a registered source |
| `submit_config` | Submit a config to the community |
| `add_config_source` | Register a git repo as a config source |
| `list_config_sources` | List registered sources |
| `remove_config_source` | Remove a registered source |
| `push_config` | Push a config to a registered source repo |

### Splitting and routing (2)
| Tool | Does |
|---|---|
| `split_config` | Split a large config into several focused skills |
| `generate_router` | Generate the router/hub skill for a split |

### Enhancement (1)
`enhance_skill` — mode `"local"` is FREE; prefer it.

### Enhancement workflows (5)
| Tool | Does |
|---|---|
| `list_workflows` | List enhancement workflow presets |
| `get_workflow` | Get a workflow's full YAML |
| `create_workflow` | Create a user workflow |
| `update_workflow` | Update a user workflow |
| `delete_workflow` | Delete a user workflow |

These are the MCP face of the steering workflows that make level-3 enhancement
worth running — see the parent skill on enhancement.

### Packaging and install (3)
| Tool | Does |
|---|---|
| `package_skill` | Package for a target platform (claude, gemini, openai, langchain, llama-index, markdown, 16+ RAG/vector targets) |
| `upload_skill` | Upload a package to a platform |
| `install_skill` | One-command end-to-end install |

### Vector database export (4)
| Tool | Does |
|---|---|
| `export_to_weaviate` | Export to Weaviate format |
| `export_to_chroma` | Export to Chroma format |
| `export_to_faiss` | Export to a FAISS index |
| `export_to_qdrant` | Export to Qdrant format |

Vector export needs the client libraries (`chromadb`, `weaviate`, …), which are
separate from the `[mcp]` extra. The tool registers whether or not they are
installed.

### Marketplace (4)
| Tool | Does |
|---|---|
| `add_marketplace` | Register a plugin marketplace repo |
| `list_marketplaces` | List registered marketplaces |
| `remove_marketplace` | Remove a registered marketplace |
| `publish_to_marketplace` | Publish a skill to a marketplace |

### Key tool parameters
```jsonc
// scrape_docs
{ "url": "https://react.dev", "max_pages": 100,
  "selectors": { "content": "article" }, "output_dir": "./output/react" }

// scrape_github
{ "repo": "facebook/react", "include_issues": false,
  "include_tests": true, "output_dir": "./output/react-github" }

// scrape_codebase  (full C3.x)
{ "directory": "./my-project", "comprehensive": true, "output_format": "claude" }

// enhance_skill     (mode "local" = FREE; prefer it)
{ "skill_path": "./output/react", "method": "local", "platform": "claude" }

// package_skill
{ "skill_path": "./output/react", "target": "claude" }

// generate_config
{ "name": "myframework", "url": "https://docs.myframework.com/",
  "description": "My Framework documentation" }

// estimate_pages    (check cost/time before running)
{ "config": "configs/react.json", "include_enhancement": true }
```

---

## Natural-language phrasings

The host maps these to tools automatically:

- "Scrape the React docs (max 50 pages)" → `scrape_docs`
- "Analyze facebook/react with tests" → `scrape_github`
- "Analyze this codebase comprehensively" → `scrape_codebase`
- "Detect design patterns in src/" → `detect_patterns`
- "Extract test examples" → `extract_test_examples`
- "Enhance my skill (free/local)" → `enhance_skill`
- "Validate this config" → `validate_config`
- "Estimate how long the React scrape will take" → `estimate_pages`
- "Package for Claude" → `package_skill` (with `--target claude`)
- "Generate a config for docs.myframework.com" → `generate_config`

---

## Common MCP workflows

**Quick skill:** `scrape_docs` → `enhance_skill` → `package_skill` (target: claude).

**Codebase analysis:** `scrape_codebase` → `detect_patterns` → `extract_test_examples` →
`build_how_to_guides` → `package_skill` (target: claude).

**Multi-source:** `generate_config` (or fetch) → `scrape_docs` + `scrape_github` (via config) → `enhance_skill` → `package_skill`.

---

## Troubleshooting

- **Tools missing:** re-run `./setup_mcp.sh`; fully restart the host app; test the
  server directly with `python -m skill_seekers.mcp.server_fastmcp`.
- **`ModuleNotFoundError: mcp`:** `pip install -e ".[mcp]"`.
- **HTTP won't start:** port in use → `lsof -i :3000`, or use `--port 8080`.
- **Timeouts on long jobs:** raise the host's MCP timeout; use `estimate_pages` first.
- **Inspect tools:** `npx @modelcontextprotocol/inspector python -m skill_seekers.mcp.server_fastmcp`.
