# Deep Research — Phases

Detailed per-phase instructions. SKILL.md gives one-paragraph summaries;
this file is the operational manual. Subject-neutral throughout.

Each phase section follows the same shape:

- **Trigger conditions** — when to enter the phase.
- **Goal** — what the phase produces.
- **Query construction heuristics** — how to derive queries.
- **Fan-out width** — default 4, override criteria.
- **Source mix** — required minimum source-type count.
- **Artifact naming** — file naming convention used.
- **Manifest fields to populate** — which `round-manifest.json` keys.
- **Exit criteria** — when the phase is done.
- **Transition signal** — what triggers the next phase.

---

## Phase 0 — Scope & Topic Decomposition

### Trigger conditions

- User has invoked `/research-deep "<topic>"`.
- No prior `<YYYYMMDD>-run-config.json` exists for today's date in the
  working directory's `resources/`.

### Goal

- Pin down the user's topic.
- Choose the source allowlist (mandatory user gate).
- Decompose the topic into a facet-axis tree.
- Initialize artifacts: `resources/<YYYYMMDD>-run-config.json` and
  TaskCreate entries for Phases 0–6.

### Query construction heuristics

- No external queries in this phase (one optional terminology lookup is
  allowed if the topic name is ambiguous).
- Internally: derive 6–10 facet axes from the default set in
  `methodology.md › Facet Axes`. Rename axes only with domain-neutral
  labels.

### Fan-out width

- N/A. Single decomposition pass.

### Source mix

- N/A. One optional disambiguation lookup permitted.

### Artifact naming

- `<YYYYMMDD>-run-config.json` — required.
- `<YYYYMMDD>-r0-manifest.json` — Phase 0 manifest (round 0).

### Manifest fields to populate

- `round`: `0`
- `phase`: `"scope"`
- `facet_axis`: `"meta"`
- `queries`: `[]` (empty unless disambiguation lookup happened)
- `artifacts`: at minimum the run-config.json path
- `gaps`: list of axes the operator is least confident about
- `next_round_hints`: 4 candidate Round 1 queries
- `source_mix`: source allowlist agreed with user
- `started_at`, `ended_at`: ISO 8601 UTC timestamps

### Exit criteria

- run-config.json written and schema-valid.
- ≥6 facet axes seeded.
- User has confirmed source allowlist.

### Transition signal

- Operator announces "Phase 0 complete; proceeding to Orientation Round."

---

## Phase 1 — Orientation Round

### Trigger conditions

- Phase 0 complete.
- User has not requested an early-skip.

### Goal

- Establish baseline understanding of the topic across all axes.
- Identify canonical sources, naming conventions, ecosystem boundaries.
- Surface the rough shape of the surface area.

### Query construction heuristics

Mix angles per the methodology:

- Definitional ("what is X")
- Landscape / boundary ("where does X sit", "X vs neighbors")
- Canonical authorities ("X official documentation", "X spec")
- Recency ("X 2025 changes", "X latest release")

Each query must target a *single* facet axis.

### Fan-out width

- Default 4 parallel queries.
- Override to 6+ only if the topic is genuinely cross-domain (user
  signals "this spans X and Y").

### Source mix

- At minimum 2 source types from the allowlist.
- At minimum 1 query targeting an authoritative-source angle.

### Artifact naming

- `<YYYYMMDD>-r1{a,b,c,d}-{slug}.{json|md}` — fan-out artifacts.
- `<YYYYMMDD>-r1-manifest.json` — round manifest.

### Manifest fields to populate

- `round`: `1`
- `phase`: `"orientation"`
- `facet_axis`: `"orientation"`
- `queries`: 4 query entries with id, prompt, source_type
- `artifacts`: paths to all saved fan-out outputs
- `gaps`: things still unknown after Round 1
- `next_round_hints`: candidate Phase 2 queries

### Exit criteria

- All 4 fan-out queries succeeded OR partial success documented in `gaps`.
- Manifest schema-validates.
- At least one canonical source identified (vendor doc URL, repo URL,
  spec URL).

### Transition signal

- Operator: "Orientation complete; canonical sources identified at
  [paths]; advancing to Primary Surface Round."

---

## Phase 2 — Primary Surface Round

### Trigger conditions

- Phase 1 complete.
- Canonical sources from Phase 1 are recorded.

### Goal

- Drill into core mechanics: primitives, interfaces, lifecycle stages,
  data shapes, control flow.

### Query construction heuristics

- Mechanism queries ("how does X work internally").
- Primitive queries ("X core types", "X primary interfaces").
- Lifecycle queries ("X bootstrap → steady-state → teardown").
- One per facet axis: `core_mechanics`, `interfaces`, `lifecycle`.

### Fan-out width

- Default 4 (one per primary axis: core_mechanics × 2,
  interfaces × 1, lifecycle × 1).

### Source mix

- ≥2 source types.
- Prefer authoritative source over secondary summaries here.

### Artifact naming

- `<YYYYMMDD>-r2{a,b,c,d}-{slug}.{json|md}`

### Manifest fields to populate

- `round`: `2`
- `phase`: `"primary_surface"`
- `facet_axis`: name the dominant axis covered (e.g., `core_mechanics`)
- standard fields as in Phase 1

### Exit criteria

- Every primary axis has ≥1 artifact.
- A working mental model of how the topic *works* is captured in
  `next_round_hints` to seed Phase 3.

### Transition signal

- Operator: "Primary mechanics captured; advancing to Operational Round."

---

## Phase 3 — Operational Round

### Trigger conditions

- Phase 2 complete.
- Core mechanics documented.

### Goal

- Cover day-2 ops, integrations, scale behavior, ecosystem connections,
  workflows, real-world deployment patterns.

### Query construction heuristics

- Operational ("running X in production", "X at scale").
- Integration ("X with Y", "X plugins / extensions").
- Workflow ("X day-to-day workflow", "X CI/CD integration", "X
  monitoring hooks").
- Ecosystem ("X ecosystem map", "X tooling").

### Fan-out width

- Default 4. Increase to 6 if the topic has a wide tooling ecosystem.

### Source mix

- ≥2 source types.
- Mix one community / blog source with one vendor source.

### Artifact naming

- `<YYYYMMDD>-r3{a,b,c,d,…}-{slug}.{json|md}`

### Manifest fields to populate

- `round`: `3`
- `phase`: `"operational"`
- `facet_axis`: `"operational"` or `"ecosystem_neighbors"`
- standard fields as above

### Exit criteria

- Operational and ecosystem axes each have ≥2 artifacts.
- A workflow-level mental model is captured.

### Transition signal

- Operator: "Operational picture captured; advancing to Edge Round."

---

## Phase 4 — Edge Round

### Trigger conditions

- Phase 3 complete.
- The "happy path" is well-understood.

### Goal

- Map the edges: gotchas, failure modes, security issues, version skew,
  deprecations, undocumented constraints.

### Query construction heuristics

- Failure ("X bugs / issues", "X CVEs", "X horror stories").
- Limit ("X limits", "X scaling cliffs", "X rate limits").
- Skew ("X version migration", "X breaking changes 2024 → 2025").
- Gotcha ("X surprising behavior", "X footguns", "X anti-patterns").

### Fan-out width

- Default 4. Increase to 6 if the topic has known security history.

### Source mix

- ≥2 source types.
- Strongly prefer authoritative sources (CVE feeds, issue trackers,
  release notes) over secondary summaries.

### Artifact naming

- `<YYYYMMDD>-r4{a,b,c,d}-{slug}.{json|md}`

### Manifest fields to populate

- `round`: `4`
- `phase`: `"edge"`
- `facet_axis`: `"failure_modes"` or `"gotchas"` or `"version_skew"`
- standard fields as above

### Exit criteria

- ≥3 distinct gotchas / limits / failure modes documented.
- All known major version skews logged in `next_round_hints` if
  authoritative coverage is incomplete.

### Transition signal

- Operator: "Edges mapped; advancing to Authoritative Source Round."

---

## Phase 5 — Authoritative Source Round

### Trigger conditions

- Phase 4 complete.
- Operator has a list of canonical URLs / repos / specs queued.

### Goal

- Fetch raw authoritative content directly. No summarization layer.
- Walk source repos for structural truth.
- Pull registry / API metadata.
- Save raw payloads with consistent naming.

### Query construction heuristics

- No general queries. This phase uses `dr-fetch-authoritative.sh` and
  `octocode githubViewRepoStructure` / `githubGetFileContent`.
- The operator builds a URL list from prior rounds' `next_round_hints`
  and from canonical sources surfaced in Round 1.

### Fan-out width

- N/A in the query sense. Aim for ≥6 raw fetches.

### Source mix

- 100% authoritative. No secondary blogs / news / forum threads.

### Artifact naming

- `<YYYYMMDD>-r5-auth-{host}-{slug}.{md|json|html}`

### Manifest fields to populate

- `round`: `5`
- `phase`: `"authoritative"`
- `facet_axis`: `"authoritative_sources"`
- `queries`: each entry represents a raw URL fetch (id, url, source_type)
- `artifacts`: paths to all saved raw content
- standard fields as above

### Exit criteria

- ≥6 authoritative artifacts captured.
- Repo structures (where applicable) walked and saved.
- No remaining axis lacks at least one authoritative anchor.

### Transition signal

- Operator: "Authoritative sources captured; advancing to Synthesis."

---

## Phase 6 — Synthesis

### Trigger conditions

- Phases 1–5 complete OR stopping criteria triggered.
- Coverage matrix shows all axes met threshold OR justified gaps.

### Goal

- Write `<YYYYMMDD>-SUMMARY.md`.
- Write `<YYYYMMDD>-citation-index.md`.
- Validate both against schemas.
- Produce an operator's-eye view of the topic, ready for hand-off.

### Query construction heuristics

- N/A. Synthesis reads existing artifacts; no new external queries.
- If during synthesis the operator finds a critical missing fact, fire a
  *single* targeted query and record it as a Phase 6 manifest entry.

### Fan-out width

- N/A.

### Source mix

- All sources already captured. Cite from raw artifacts only.

### Artifact naming

- `<YYYYMMDD>-SUMMARY.md`
- `<YYYYMMDD>-citation-index.md`
- `<YYYYMMDD>-r6-manifest.json`

### Manifest fields to populate

- `round`: `6`
- `phase`: `"synthesis"`
- `facet_axis`: `"meta"`
- `queries`: only any back-fill queries fired during synthesis
- `artifacts`: paths to SUMMARY.md and citation-index.md (and any
  back-fill artifacts)
- `gaps`: justified uncovered axes (must equal `Limitations` section)
- `next_round_hints`: suggestions for a future re-run
- `source_mix`: aggregate of all rounds

### Exit criteria

- `dr-validate.py` passes against all manifests + synthesis.
- `dr-coverage.py` reports all axes covered or justified.
- Citation index has one row per claim in SUMMARY.md.
- Final SUMMARY.md contains every section required by
  `synthesis-spec.schema.json`.

### Transition signal

- Operator: "Synthesis complete and validated. Run summary at
  `resources/<YYYYMMDD>-SUMMARY.md`."

---

## Cross-Phase Conventions

### Timestamps

All `started_at` / `ended_at` are ISO 8601 UTC, e.g.,
`2026-04-27T08:50:12Z`.

### Slugs

Slugs are kebab-case, ≤40 chars, ASCII only. Derive from the query or
URL path; do not include topic-specific stop words.

### Letter suffixes for parallel queries

Round-letter suffixes:

- 4 queries → `a, b, c, d`
- 5 queries → `a, b, c, d, e`
- 6 queries → `a, b, c, d, e, f`

If a query is retried, increment the letter (`d` → `d2`); never
overwrite.

### Manifest update discipline

- Manifests are written once per round, atomically.
- If a round needs back-fill (e.g., one query failed), append a
  `back_fill` block to the existing manifest rather than rewriting.

### TaskCreate hooks

- One task per phase; mark `in_progress` on entry, `completed` on
  manifest validation.
- If a phase is skipped due to saturation, mark its task `completed`
  with a note in `metadata`.
