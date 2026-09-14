---
name: outline-cli
description: >-
  Manages an Outline wiki / knowledge base from the terminal via the Outline API CLI —
  binary is `ol` (NOT `outline-cli`), a Node/TypeScript Commander.js tool. Use when you need
  to search documents, list/get/create/update/delete/move/archive documents, render a doc as
  markdown, manage collections, or open a doc in the browser. Documents are markdown; refs
  accept a full URL, slug/urlId, or name. Supports `--json` (essential fields), `--json
  --full` (all fields), and `--ndjson` (one object per line, agent-friendly). Auth via OAuth
  login (PKCE) or a personal API token (`OUTLINE_API_TOKEN`); base URL via `OUTLINE_URL` for
  self-hosted. NOT an Airtable-style record DB (use nocodb-cli), web search (jina-cli), or AI
  answers (perplexity-cli). It is the wiki/docs/collections tool.
---

# outline-cli

A Node/TypeScript CLI (Commander.js, ESM-only) over the **Outline** wiki/knowledge-base API.
The installed binary is **`ol`** — not `outline-cli`. Every API call is `POST {baseUrl}/api/<path>` with Bearer auth.

## When to use it (and when not)

- **Use `ol`** for Outline wiki content: searching docs, reading/writing markdown documents, organizing collections, moving/archiving docs.
- **Not** for Airtable-like tables/records (`nocodb-cli`), web search (`jina-cli`), or synthesized AI answers (`perplexity-cli`). It is the **documents + collections** tool.

## ⚠️ The things that bite everyone

1. **The binary is `ol`, not `outline-cli`.** `npm link` / `npm install -g` installs `ol`.
2. **Destructive ops require `--confirm`.** `ol document delete <id>` and `ol collection delete <id>` exit `1` with `CONFIRMATION_REQUIRED` unless `--confirm` is passed.
3. **`document update` auto-extracts the title** from a leading `# Heading` of `--text`/`--file` *only when you don't pass `--title`*. Pass `--title` explicitly to keep control.
4. **Pagination is offset-based, manual.** Non-NDJSON list output prints `(more results available — use --offset N)`; bump `--offset` yourself. NDJSON suppresses that hint.

## Auth

Two modes; token resolution `OUTLINE_API_TOKEN` env → `~/.config/outline-cli/config.json`. Base URL `OUTLINE_URL` env → config → `https://app.getoutline.com`.

```bash
# OAuth (PKCE, opens browser) — recommended
ol auth login                              # prompts for base URL + client ID
ol auth login --base-url https://wiki.acme.com --client-id <id> --callback-port 54969
# Manual personal token
ol auth login --token <api-token>          # Settings → API Tokens in Outline
ol auth status                             # show source + team/user
ol auth logout                             # clear ~/.config/outline-cli/config.json
```

OAuth setup: create a public OAuth app in Outline (Settings → Applications), redirect URI `http://localhost:54969/callback` (or your `--callback-port`). Client ID is saved for future logins; can also set `OUTLINE_OAUTH_CLIENT_ID`. Callback port: `--callback-port` → `OUTLINE_OAUTH_CALLBACK_PORT` → `54969`.

## Core commands + curated flags

Refs (`<id>`) accept a full URL, `urlId`/slug, or name (resolved via search).

```bash
# Search
ol search "query" --limit 10 --collection <id> --status published   # published|draft|archived

# Documents (alias: ol doc)
ol document list --collection <ref> --sort updatedAt --direction DESC --limit 25 --offset 0
ol document get <ref>                  # renders markdown for the terminal
ol document get <ref> --raw            # raw markdown, no terminal formatting
ol document open <ref>                 # open in browser
ol document create --title "T" --collection <ref> --file doc.md --publish
ol document create --title "T" --collection <ref> --text "# Body"
ol document update <ref> --file updated.md         # title auto-extracted from leading # unless --title given
ol document move <ref> --collection <target-ref>
ol document archive <ref> / unarchive <ref>
ol document delete <ref> --confirm

# Collections (alias: ol col)
ol collection list --limit 25 --offset 0
ol collection get <ref>
ol collection create --name "Engineering" --description "..." --color "#4CAF50" --private
ol collection update <ref> --name "New Name" --color "#fff"
ol collection delete <ref> --confirm

# Skill installers (manage agent skill files for this CLI)
ol skill list
ol skill install <agent> [--local] [--force]
ol skill uninstall <agent> [--local]
```

Global flag: `--no-spinner` (also auto-disabled on non-TTY / JSON output / CI).

## Output + agent patterns

Three modes (default = colored human text): `--json` (pretty, essential fields only), `--json --full` (all fields), `--ndjson` (one JSON object per line — best for pipelines; suppresses pagination hint).

```bash
ol search "onboarding" --ndjson | jq -r '.document.url'
ol document list --collection eng --ndjson | jq -r '.urlId'
ol document list --collection eng --json --full | jq '.[].revision'
ol collection list --ndjson | jq -r '"\(.name)\t\(.documentCount)"'
```

Essential JSON fields — documents: `id,title,urlId,collectionId,updatedAt`; collections: `id,name,description,color,documentCount`; search wraps each hit as `{document:{…}, context}`.

## Exit codes

`0` success · `1` on any error — API errors (non-2xx → `API error: <message>`), `CONFIRMATION_REQUIRED` (delete without `--confirm`), OAuth failures, and uncaught rejections all `process.exit(1)`. Commander emits its own usage errors for unknown commands/missing args.

## Install / invoke

Node ESM project, `bin.ol → ./dist/index.js`. From GitHub: `npm install -g github:Doist/outline-cli`. From source: `npm install && npm run build && npm link` (builds TS → `dist/`, links `ol`). Dev: `npm run dev` (watch), `npm run type-check`, `npm run test` (vitest). Full command/flag + API-path surface → `references/outline-cli-api.md`.
