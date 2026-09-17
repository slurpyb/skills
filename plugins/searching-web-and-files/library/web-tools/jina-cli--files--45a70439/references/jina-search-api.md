# jina-cli — full reference

Fuses the CLI surface (`jina_cli/main.py`, `AGENTS.md`) with the upstream Jina Search API
contract (vendored `jina-search-api.json`). CamelCase field names below ARE the API wire
format — `--json`/stdin use them directly.

## Upstream contract

- **Endpoint:** `https://s.jina.ai/` — `GET|POST /{q}` (search) and `GET|POST /search` (searchIndex).
- **Auth:** `Authorization: Bearer $JINA_API_KEY`.
- **Returns:** `Array<FormattedPageDto>` — SERP hits with extracted page content.
- **Param groups** (spec schemas): `GoogleSearchExplicitOperatorsDto` (site/ext/filetype/intitle/loc),
  `CrawlerOptions` (content/rendering/retention), plus search control + output format.
- **Method:** `POST` (default, params in body) or `GET` (`-m GET`, params in query string).

## Every flag (`jina-cli [GLOBAL] search [QUERY] [OPTIONS]`)

### Global (before `search`)
| Flag | Env | Default | Notes |
|---|---|---|---|
| `--pretty` | — | off | indented JSON (mutually exclusive with `--text`) |
| `--text` | — | off | Rich human output |
| `--api-key` | `JINA_API_KEY` | — | required |
| `--proxy` | `JINA_PROXY_URL` | — | `http://user:pass@host:port` |
| `--timeout` | `JINA_TIMEOUT` | `30.0` | seconds |

### search options
| Flag | Short | API key (camelCase) | Notes |
|---|---|---|---|
| `--num` | `-n` | `num` | result count |
| `--respond-with` | `-f` | `respondWith` | `content`·`markdown`·`html`·`text`·`pageshot`·`screenshot`·`vlm`·`readerlm-v2` |
| `--provider` | | `provider` | `google` (default)·`bing`·`reader` |
| `--site` | `-s` | `site` (array) | comma-separated → array |
| `--gl` | | `gl` | country, ISO 3166-1 alpha-2 |
| `--hl` | | `hl` | language, ISO 639-1 |
| `--type` | `-t` | `type` | `web`·`images`·`news` |
| `--intitle` | | `intitle` (array) | term in page title |
| `--filetype` | | `filetype` (array) | e.g. `pdf,docx` |
| `--location` | | `location` | geo context |
| `--no-cache` | | `noCache` | bypass cache |
| `--max-tokens` | | `maxTokens` | per-result content cap |
| `--token-budget` | | `tokenBudget` | total content cap |
| `--retain-images` | | `retainImages` | `none`·`all`·`alt`·`all_p`·`alt_p` |
| `--retain-links` | | `retainLinks` | `none`·`all`·`text`·`gpt-oss` |
| `--with-links-summary` | | `withLinksSummary` | bool |
| `--with-images-summary` | | `withImagesSummary` | bool |
| `--target` | | `targetSelector` (array) | CSS selectors to extract |
| `--wait-for` | | `waitForSelector` (array) | wait for selectors |
| `--remove` | | `removeSelector` (array) | strip selectors |
| `--engine` | | `engine` | `auto`·`browser`·`curl`·`cf-browser-rendering` (`browser` for JS/SPA pages) |
| `--instruction` | | `instruction` | NL extraction guidance |
| `--method` | `-m` | — | `POST`/`GET` |
| `--json` | `-j` | — | full JSON input (camelCase) |

### JSON-only params (no flag — set via `--json`/stdin)
`ext` (array), `count`, `nfpr`, `fallback`, `cacheTolerance`, `withGeneratedAlt`, `userAgent`,
`locale`, `viewport` (`{width,height,deviceScaleFactor,isMobile,...}`), `respondTiming`
(`html`·`visible-content`·`mutation-idle`·`resource-idle`·`media-idle`·`network-idle`),
`removeOverlay`, `detachInvisibles`, `noGfm`, `withIframe`, `withShadowDom`, `keepImgDataUrl`,
`jsonSchema` (structured extraction), `robotsTxt`, `referer`, `markdownChunking`.

## JSON input

`--json`/stdin keys are **camelCase**; CLI flags override JSON. `q` is required (or pass it as the positional arg).
```json
{ "q": "rust async", "num": 3, "respondWith": "markdown", "site": ["github.com"],
  "gl": "US", "type": "web", "engine": "browser", "instruction": "extract the main article" }
```
Gotchas: snake_case keys are rejected; `site`/`intitle`/`filetype`/`*Selector` must be arrays in JSON; the count key is `num` (not `max_results`).

## Output schema (`FormattedPageDto`, `extra=allow`)

```jsonc
{ "query": "string",
  "respond_with": "markdown | content | null",
  "results": [ {
    "title": "str|null", "description": "str|null", "url": "string (always)",
    "content": "str|null", "chunks": ["str"]|null, "publishedTime": "str|null",
    "html": "str|null", "text": "str|null",
    "screenshotUrl": "str|null", "pageshotUrl": "str|null", "numPages": "int|null",
    "links": {"text":"url"}|["url"]|null, "images": {"alt":"url"}|["url"]|null,
    "warning": "str|null", "metadata": {}|null } ] }
```

## Config cascade (first wins)

`--flag` → `JINA_*` env → `./.jina-cli.json` → `~/.config/jina-cli/config.json`. Fields:
`api_key` (`JINA_API_KEY`), `proxy_url`, `timeout`, `default_num`, `default_respond_with`,
`default_provider`, `default_method`. Never store `api_key` in the JSON files.

## Exit codes

`0` success · `2` auth (401/403) or missing key · `3` rate limit (429) · `4` bad input/validation/400 ·
`5` server 5xx · `70` internal CLI error · `130` interrupted.

## Notes

- `.env` is NOT auto-loaded — `source .env` or use `direnv`.
- Reader API (`r.jina.ai`, single-URL → markdown) is planned/unbuilt in this CLI (`jina-reader-api.json` is empty).
- Debug: `JINA_CLI_DEBUG=1` for full tracebacks.
