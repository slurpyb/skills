---
name: web-extraction
description: "Routes a page-to-structured-data task to the right federa engine and validates the result - mcp__federa__jina_read (instruction + json_schema) for single pages, structured_extract / firecrawl_extract for many-URL or whole-domain (async, poll _status), firecrawl_map then firecrawl_crawl for discovery, firecrawl_scrape with actions for auth/pagination/JS, firecrawl_parse for local PDFs/DOCX. Covers schema design, validating extracted records, and partial-failure handling. Use to turn pages into JSON, not to answer questions (see rag-pipeline). Triggers: extract data, scrape into JSON, structured extraction, pull fields from pages, crawl a site, scrape a PDF, parse document."
---

# Web Extraction
Choosing the right extraction engine, designing a schema, and validating the output (parse, don't validate). Use when the deliverable is structured records from web or document content - not a synthesized answer (`rag-pipeline`).

## Phase 1 - Pick the engine
- Single known page, fields out: `mcp__federa__jina_read` with an `instruction` + `json_schema`. Returns markdown unless you request JSON.
- Many URLs or a whole domain, same shape each: `mcp__federa__structured_extract` or `mcp__federa__firecrawl_extract`. These are ASYNC - kick off, then poll `mcp__federa__firecrawl_extract_status`.
- Don't know the URLs yet: `mcp__federa__firecrawl_map` to enumerate a site, then `mcp__federa__firecrawl_crawl` (async; poll `_status`, `_cancel` to abort) to fetch the matching set.
- Behind login, paginated, or JS-rendered: `mcp__federa__firecrawl_scrape` with `actions` (click/scroll/wait/input) to drive the page first.
- Local PDF/DOCX/file: `mcp__federa__firecrawl_parse`.
- For LLM-bound content set `onlyMainContent` to strip nav/boilerplate.

## Phase 2 - Design the schema
- Define a precise JSON schema for the target record: required fields, types, enums; mark genuinely-optional fields nullable, not everything.
- Keep it flat and minimal - one record shape per extraction job; nest only when the source truly is nested.
- Make illegal states unrepresentable: a field that must be a date is a date, not a free string.

## Phase 3 - Run and poll
- Sync engines (`jina_read`, single `firecrawl_scrape`): read the `{status, data, error, meta}` envelope directly.
- Async engines (`firecrawl_crawl`, `firecrawl_extract`, `firecrawl_batch_scrape`): submit, then loop on the matching `_status` tool until done/failed; cancel runaway crawls with `_cancel`.

## Phase 4 - Validate and handle partial failure
- Parse each returned record against the schema at the boundary. Reject/quarantine records that miss required fields rather than passing half-shapes downstream (fail loud, parse don't validate).
- For batch jobs, expect partial success: split results into valid / invalid / missing-URL buckets; report counts in `meta`; retry only the failures.
- Never trust extracted text blindly - check obvious sanity (date ranges, non-empty keys, enum membership) before handing records on.

## Checklist / boundaries
- [ ] Engine matched to scope (single page / many / discovery / interactive / local file).
- [ ] `onlyMainContent` set for LLM-bound scrapes.
- [ ] Precise schema with correct required/optional + types.
- [ ] Async jobs polled via the right `_status`; runaways cancellable.
- [ ] Records validated at the boundary; partial failures bucketed and reported, not silently dropped.
- Out of scope: answering a question from sources (-> rag-pipeline), long-form reports (-> deep-research-report), choosing a search provider (-> provider-routing).
