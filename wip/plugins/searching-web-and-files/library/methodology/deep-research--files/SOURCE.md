---
name: deep-research
description: Subject-neutral deep research workflow. Decomposes any topic into facet axes, runs 6+ parallel fan-out rounds across mixed sources (web/registry/repo/docs), produces datestamped append-only artifacts, and synthesizes a schema-validated report with a full citation index. Use when the user wants to "research deeply", "become an expert on", "scrape and synthesize", "deep dive", "investigate", or "build a knowledge base on" a topic.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Task, TaskCreate, TaskUpdate, TaskList, WebFetch, mcp__exa__web_search_exa, mcp__exa__web_fetch_exa, mcp__octocode__githubViewRepoStructure, mcp__octocode__githubGetFileContent, mcp__octocode__githubSearchCode, mcp__octocode__githubSearchRepositories, mcp__firecrawl__firecrawl_search, mcp__firecrawl__firecrawl_scrape, mcp__firecrawl__firecrawl_crawl
---

# Deep Research

Reusable, subject-neutral research engine. Replicates the *behavior* of an
expert dossier build — facet decomposition, parallel fan-out, multi-source
triangulation, datestamped artifacts, schema-validated synthesis — for any
topic the user provides.

The skill is **subject-agnostic by contract**. No topic-specific terminology
appears anywhere in the playbook except in clearly flagged illustrative
examples inside `references/methodology.md`.

## When to Use

Trigger on any of these intents:

- "research [X] deeply" / "deep dive on [X]" / "investigate [X]"
- "become an expert on [X]" / "build a knowledge base on [X]"
- "scrape and synthesize [X]"
- "what is the current state of [X]"
- "produce a dossier on [X]"
- The user wants citations, raw artifacts, and a re-loadable working set —
  not just an answer.

## Do Not Use When

- A single targeted lookup answers the question (use `exa-search` or a single
  perplexity-cli call).
- The user wants a one-pass news summary (use `research-ops` light path).
- The user wants a market recommendation only (use `market-research`).
- The user wants people/company enrichment (use `lead-intelligence`).
- The user wants codebase-only forensics with no web component (use
  `octocode-research`).

## Phase 0 Source-Selection Gate (mandatory)

Before any other work, query the user for their preferred research
methodology and source mix. Offer a menu, let them mix and match:

1. `perplexity-cli` (default web summarization)
2. `exa` MCP / `firecrawl` MCP (semantic search + clean scrape)
3. `google-cli` (Search Console, Analytics, Ads context if useful)
4. Local filesystem — point at a directory of ebooks, PDFs, docs
5. Plaintext logs — for triage / issue-by-storytelling research
6. Sibling agents / models — Gemini CLI, Codex CLI, GLM 5.X, Chutes
7. `octocode` Research — for any codebase- or repo-centric topic
8. Anything else relevant in the current environment

Record the user's choice into `resources/<YYYYMMDD>-run-config.json` under
`source_allowlist`. Every later round MUST stay inside that allowlist unless
the user expands it explicitly.

## How It Works

The workflow is a 7-phase chain (Phase 0 + 6 fan-out/synthesis phases). Each
phase has its own trigger conditions, fan-out width, source mix, artifact
naming convention, and exit criteria. Long-form per-phase instructions live
in `references/phases.md`. The high-level chain-of-reasoning, facet-axis
taxonomy, and stopping criteria live in `references/methodology.md`.

| Phase | Name | Goal |
|-------|------|------|
| 0 | Scope & Topic Decomposition | Decompose topic into facet-axis tree; pick source mix; init artifacts. |
| 1 | Orientation Round | Broad parallel queries; identify canonical sources, naming, ecosystem boundary. |
| 2 | Primary Surface Round | Drill into core mechanics, primitives, interfaces, lifecycle. |
| 3 | Operational Round | Workflows, integrations, day-2 ops, ecosystem connections. |
| 4 | Edge Round | Gotchas, failure modes, security, limits, version skew. |
| 5 | Authoritative Source Round | Raw vendor docs, repo walks, API/registry payloads, RFCs, specs. |
| 6 | Synthesis | Write `SUMMARY.md`, citation index, validate schemas, mark coverage. |

Each fan-out phase (1–5) defaults to **4 parallel queries** per facet axis
unless the user overrides depth. Synthesis (Phase 6) is always Claude's job;
scripts only orchestrate, gather, and validate.

## Stopping Criteria

A round terminates when **any** of:

- Coverage matrix saturation: every defined facet axis has ≥3 distinct
  artifacts and ≥2 source types.
- Budget exhaustion: round count ≥ configured `depth_budget` (default 6).
- Diminishing returns signal: ≥3 duplicate findings within a single round
  (same fact surfaced from different queries).
- User stop: user issues `stop`, `wrap up`, or `synthesize now`.

If saturation occurs before the budget, jump straight to Phase 6.

## Output Contract

Every run MUST produce, all under `<workdir>/resources/`:

- `<YYYYMMDD>-run-config.json` — topic, start_date, depth_budget,
  source_allowlist, facet_axes[], operator notes.
- `<YYYYMMDD>-r{N}-manifest.json` — one per round, schema-conformant against
  `references/schemas/round-manifest.schema.json`. Minimum **6** manifests
  unless saturation triggers earlier (see Stopping Criteria); record the
  early-stop reason in the final manifest.
- `<YYYYMMDD>-r{N}{letter}-{slug}.json` (or `.md` / `.txt`) — raw fan-out
  artifacts. Aim for ≥20 raw artifacts across the run.
- `<YYYYMMDD>-SUMMARY.md` — synthesis, schema-conformant against
  `references/schemas/synthesis-spec.schema.json`.
- `<YYYYMMDD>-citation-index.md` — every claim in SUMMARY.md mapped to one
  or more raw artifact paths.

All artifacts are **append-only** and datestamped. Re-running on a later
date NEVER overwrites prior runs — the new date prefix isolates the run.

## Artifact Naming Rules

```
<YYYYMMDD>-run-config.json
<YYYYMMDD>-r{round}-manifest.json
<YYYYMMDD>-r{round}{letter}-{slug}.{json|md|txt}
<YYYYMMDD>-r{round}-auth-{host}-{slug}.{md|json|html}
<YYYYMMDD>-SUMMARY.md
<YYYYMMDD>-citation-index.md
```

- `round` is 1-indexed integer
- `letter` distinguishes parallel queries within a round (`a`, `b`, `c`, `d`…)
- `slug` is a kebab-case shortened query/topic identifier
- `host` is the source domain (e.g., `github`, `pypi`, `arxiv`)

## Task Tracking

Every run opens TaskCreate entries at round granularity:

- One task per phase (0–6).
- Mark `in_progress` when entering a phase, `completed` when its manifest is
  written and validated.
- Surfaces round-level progress to the user without flooding the transcript.

## Scripts

All under `references/scripts/`:

| Script | Role |
|--------|------|
| `dr-init.sh` | Bootstrap `resources/`, write run-config.json, seed facet axes. |
| `dr-fan-out.sh` | Fire N parallel `perplexity-cli` queries for one facet, save artifacts, emit manifest entries. |
| `dr-fetch-authoritative.sh` | Curl raw URLs (vendor docs, GitHub raw, registry APIs) into `resources/` with consistent naming. |
| `dr-validate.py` | Validate round manifests + synthesis against JSON Schemas. Exit non-zero on drift. |
| `dr-coverage.py` | Compute facet-axis coverage matrix across all manifests; print uncovered axes as TODO. |
| `dr-synthesize.sh` | Gather manifests, open `templates/SUMMARY.md`, leave placeholder for Claude to fill. Does NOT call any LLM. |

Scripts read topic + workdir from `resources/<YYYYMMDD>-run-config.json` —
NEVER hard-coded. All scripts honor `--json` for machine-readable status.

## Schemas

Both draft 2020-12. Validate before declaring done.

- `references/schemas/round-manifest.schema.json` — required fields:
  `round`, `facet_axis`, `queries[]`, `artifacts[]`, `gaps[]`,
  `next_round_hints[]`, `phase`, `started_at`, `ended_at`, `source_mix`.
- `references/schemas/synthesis-spec.schema.json` — required sections:
  `architecture`, `install_or_setup`, `surface_map`,
  `gotchas_and_limitations`, `ecosystem_alternatives`,
  `use_case_mapping`, `next_step_toolchain`. (`citation_index_path` is a
  top-level field, not a section.)

## Re-Run Discipline

If the user asks to "rerun" or "refresh" research on a topic that already
has artifacts under `resources/`:

1. Read the most recent `<YYYYMMDD>-run-config.json`.
2. Today's date prefix is fresh — DO NOT overwrite the prior date.
3. Diff facet axes: keep the prior tree; flag any axes that have decayed
   (stale > 90 days) or that the user explicitly asked to refresh.
4. Run only the phases needed; cite prior artifacts where they remain valid.

## Examples (illustrative only — not topic-coupled)

The methodology document contains a worked example using a
deliberately-chosen *illustrative* topic. The illustrative topic is flagged
inline as `EXAMPLE — replace with your topic`. Do NOT assume the example
domain is the skill's subject. The skill is neutral.

## Reference Index

Push detail to references; do not inline:

- `references/methodology.md` — chain-of-reasoning playbook, facet-axis
  taxonomy, fan-out heuristics, stopping criteria, illustrative example.
- `references/phases.md` — per-phase instructions (Phase 0 → Phase 6) with
  triggers, query construction, fan-out width, source mix, artifact naming,
  manifest fields, exit criteria, transition signals.
- `references/templates/round-manifest.json` — round-manifest skeleton.
- `references/templates/SUMMARY.md` — synthesis skeleton with section anchors.
- `references/templates/citation-index.md` — pointer table skeleton.
- `references/schemas/round-manifest.schema.json` — round manifest schema.
- `references/schemas/synthesis-spec.schema.json` — synthesis schema.
- `references/scripts/dr-init.sh`
- `references/scripts/dr-fan-out.sh`
- `references/scripts/dr-fetch-authoritative.sh`
- `references/scripts/dr-validate.py`
- `references/scripts/dr-coverage.py`
- `references/scripts/dr-synthesize.sh`

## Final Gate

Before declaring a run complete:

1. `uv run references/scripts/dr-validate.py --resources <workdir>/resources`
   exits 0.
2. `uv run references/scripts/dr-coverage.py --resources <workdir>/resources`
   reports zero uncovered axes (or each remaining axis is justified in
   `SUMMARY.md › Limitations`).
3. `<YYYYMMDD>-citation-index.md` references every raw artifact at least
   once.
4. Every claim in `<YYYYMMDD>-SUMMARY.md` traces to a row in the citation
   index.

## Subject-Neutrality Enforcement

If at any point the operator notices the playbook has been steered into a
single domain's vocabulary (web stacks, finance, biology, infra, etc.), the
operator MUST:

1. Strip domain terms from facet axis labels.
2. Re-label axes with domain-neutral generics
   (e.g., `core_mechanics`, `interfaces`, `failure_modes`,
   `ecosystem_neighbors`, `authoritative_sources`).
3. Apply the user's domain inside *queries* and *artifacts* — never inside
   the skill's structural language.

This rule keeps the skill reusable across every future topic the user picks.
