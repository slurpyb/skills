# outline-cli (`ol`) — full reference

Fuses the CLI surface (`src/commands/*.ts`, `src/lib/*.ts`, `CLAUDE.md`, `README.md`) with the
upstream Outline API. Node/TypeScript, ESM-only, Commander.js. Binary: **`ol`** (`bin.ol → dist/index.js`).

## Upstream contract

- **Transport:** every call is `POST {baseUrl}/api/<endpoint>` with `Authorization: Bearer <token>`, `Content-Type: application/json`, params in the JSON body (`src/lib/api.ts`).
- **Base URL:** `OUTLINE_URL` env → config → `https://app.getoutline.com` (trailing slash stripped). Self-hosted: set `OUTLINE_URL` or pass `--base-url` at login.
- **Response envelope:** `{ data, pagination? }`. Non-2xx → throws `API error: <message>` (message from response JSON `.message` if present).
- **Pagination:** `{ offset, limit, nextPath? }`; offset-based, caller-driven.

## Endpoint map (CLI command → Outline API path)

| CLI command | API path | Body fields |
|---|---|---|
| `auth login/status` | `auth.info` | — |
| `search <query>` | `documents.search` | `query`, `limit`, `collectionId?`, `statusFilter?` ([status]) |
| `document list` | `documents.list` | `limit`, `offset`, `sort`, `direction`, `collectionId?` |
| `document get` | `documents.info` | `id` |
| `document create` | `documents.create` | `title`, `collectionId`, `text?`, `publish?` |
| `document update` | `documents.update` | `id`, `title?`, `text?` |
| `document delete` | `documents.delete` | `id` |
| `document move` | `documents.move` | `id`, `collectionId` |
| `document archive` | `documents.archive` | `id` |
| `document unarchive` | `documents.unarchive` | `id` |
| `collection list` | `collections.list` | `limit`, `offset` |
| `collection get` | `collections.info` | `id` |
| `collection create` | `collections.create` | `name`, `description?`, `color?`, `permission?` |
| `collection update` | `collections.update` | `id`, `name?`, `description?`, `color?` |
| `collection delete` | `collections.delete` | `id` |

`document open` does not hit the API — it resolves the ref then opens `{baseUrl}{url}` in the browser.

## Auth (`src/lib/auth.ts`, `oauth*.ts`)

- Token resolution: `OUTLINE_API_TOKEN` → `~/.config/outline-cli/config.json` (`api_token`). Missing → throws "No API token found".
- Base URL: `OUTLINE_URL` → config `base_url` → default.
- OAuth client ID: `OUTLINE_OAUTH_CLIENT_ID` → config `oauth_client_id`. Saved on first login.
- Callback port: `--callback-port` → `OUTLINE_OAUTH_CALLBACK_PORT` → `54969` (must be 1–65535). Redirect URI `http://localhost:<port>/callback` must be registered in the Outline OAuth app.
- OAuth uses PKCE (`pkce.ts`) + a local callback server (`oauth-server.ts`).
- Config file `~/.config/outline-cli/config.json`: `{ api_token, base_url, oauth_client_id }`. `ol auth logout` deletes it.

## Commands + flags

### `ol auth`
| Cmd | Flags |
|---|---|
| `login` | `--token <t>` (manual token) · `--base-url <url>` · `--client-id <id>` · `--callback-port <port>` |
| `status` | — |
| `logout` | — |

### `ol search <query>`
`--limit <n>` (25) · `--collection <id>` · `--status <published\|draft\|archived>` · `--json` · `--ndjson` · `--full`

### `ol document` (alias `doc`)
| Sub | Flags |
|---|---|
| `list` | `--collection <ref>` · `--limit 25` · `--offset 0` · `--sort updatedAt` (`title\|updatedAt\|createdAt`) · `--direction DESC` · `--json` · `--ndjson` · `--full` |
| `get <ref>` | `--raw` · `--json` · `--full` |
| `open <ref>` | — |
| `create` | `--title <t>` (required) · `--collection <ref>` (required) · `--text <md>` · `--file <path>` · `--publish` · `--json` |
| `update <ref>` | `--title <t>` · `--text <md>` · `--file <path>` · `--json` |
| `delete <ref>` | `--confirm` (required to proceed) |
| `move <ref>` | `--collection <ref>` (required) |
| `archive <ref>` / `unarchive <ref>` | — |

### `ol collection` (alias `col`)
| Sub | Flags |
|---|---|
| `list` | `--limit 25` · `--offset 0` · `--json` · `--ndjson` · `--full` |
| `get <ref>` | `--json` · `--full` |
| `create` | `--name <n>` (required) · `--description <t>` · `--color <hex>` · `--private` · `--json` |
| `update <ref>` | `--name` · `--description` · `--color` · `--json` |
| `delete <ref>` | `--confirm` (required) |

### `ol skill` (manages agent skill files for this CLI, not Outline data)
`list` · `install [agent] [--local] [--force]` · `uninstall [agent] [--local]`

### Global
`--no-spinner` (also auto-off on non-TTY, JSON output, CI). `--version`, `--help`.

## Ref resolution (`src/lib/refs.ts`)

`<ref>` args (`<id>`) accept: full Outline URL, `urlId`/slug, or a name (resolved via search/list). `document get`/`collection get` may return partial data when resolved from a name list, then fetch full record via `*.info`.

## Text input + title extraction (`document.ts`)

- `--file <path>` reads markdown from disk; `--text <md>` inline. `--file` wins if both given.
- On `update`, if text is supplied and `--title` is NOT given, the leading `# Heading` line becomes the title and is stripped from the body. Pass `--title` to override.
- `collection create --private` sends `permission: ""`.

## Output modes (`src/lib/output.ts`)

| Mode | Behavior |
|---|---|
| default | colored human text via per-command formatter |
| `--json` | pretty JSON, essential fields only (unless `--full`) |
| `--json --full` | pretty JSON, all fields |
| `--ndjson` | one JSON object per line; `--full` honored; pagination hint suppressed |

Essential keys — document: `id,title,urlId,collectionId,updatedAt`; collection: `id,name,description,color,documentCount`; search result: `document,context`. Non-NDJSON lists print `(more results available — use --offset N)` when `pagination.nextPath` is set.

## Agent patterns

```bash
ol search "release notes" --ndjson | jq -r '.document.url'
ol document list --collection eng --ndjson | jq -r '.urlId'
ol document get my-doc-slug --raw > doc.md          # raw markdown to file
ol collection list --ndjson | jq -r '"\(.id)\t\(.name)"'
ol document create --title "RFC" --collection eng --file rfc.md --publish --json | jq -r '.urlId'
```

## Exit codes

`0` success · `1` on any error: API failure, `CONFIRMATION_REQUIRED` (delete without `--confirm`), invalid OAuth callback port, OAuth login failure, and the top-level `parseAsync().catch` (prints `err.message`, `process.exit(1)`). Commander handles unknown-command/missing-arg usage errors itself.

## Install / build

ESM TypeScript (`type: module`, target ES2022, NodeNext). `bin.ol → ./dist/index.js`.
- GitHub: `npm install -g github:Doist/outline-cli`
- Source: `npm install && npm run build && npm link`
- Dev: `npm run dev` (tsc watch), `npm run type-check`, `npm run test` (vitest), `npm run format` (biome).
