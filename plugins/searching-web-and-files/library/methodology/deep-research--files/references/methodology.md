# Deep Research — Methodology

Subject-neutral chain-of-reasoning playbook. Read this before running the
phase loop. The phases (`phases.md`) operationalize this document.

## 1. First Principles

1. **Code/Doc/Source is truth.** Always triangulate from primary sources;
   never let a single secondary summary become canonical.
2. **Append, never overwrite.** Datestamped artifacts mean a future session
   can reload context; mutated artifacts erase history.
3. **Facets, not topics.** Decompose any topic into a fixed-shape facet
   tree so the same skill works for any domain.
4. **Parallel, not sequential.** Each fan-out round fires N queries at
   once; sequential search wastes budget.
5. **Schema-validated synthesis.** The final report is only "done" when
   schema validation passes; structure must survive context loss.

## 2. Facet Axes (subject-neutral)

A facet axis is a question type, not a topic. The same axes apply whether
the topic is a programming language, a regulatory regime, or a biological
process.

The default axis set:

| Axis | Question it answers |
|------|---------------------|
| `orientation` | What is this? Where does it sit in the larger landscape? |
| `core_mechanics` | How does it actually work at the primitive level? |
| `interfaces` | How do humans / systems interact with it? |
| `lifecycle` | What is the day-1 → day-N timeline? |
| `operational` | How does it behave under load, scale, drift, ops? |
| `failure_modes` | How does it break, get attacked, leak, mis-spec? |
| `ecosystem_neighbors` | What competes, complements, or replaces it? |
| `authoritative_sources` | Where do the canonical specs / repos / RFCs live? |
| `version_skew` | How has it changed over releases / years / regulators? |
| `gotchas` | Surprises, footguns, undocumented constraints. |

You may rename axes per topic, but every renamed axis must still be
domain-neutral. Bad: `kubernetes_pods`. Good: `core_mechanics`.

You may add custom axes if the topic genuinely demands them (e.g.,
`hardware_dependencies` for a hardware-coupled topic), but flag them in the
run-config so coverage tooling tracks them.

## 3. Source Mix

Within the user's allowlist (chosen at Phase 0), prefer the following
primary-source ladder when the user enables them:

1. **Vendor / authoritative docs** — fetch raw via `dr-fetch-authoritative.sh`.
2. **Source repos** — walk via `octocode githubViewRepoStructure`,
   then targeted file reads.
3. **Package / registry metadata** — pypi / npm / crates / pkg.go.dev / etc.
4. **RFCs / standards / specs** — IETF, W3C, ISO, regulatory bodies.
5. **Curated secondary** — high-quality blogs, conference talks, books.
6. **General web summarization** — `perplexity-cli`, `firecrawl_search`,
   `web_search_exa`.
7. **Local materials** — user-supplied PDFs, ebooks, logs.
8. **Sibling LLMs** — Gemini CLI, Codex CLI, GLM, Chutes (cross-check only).

Each fan-out round should mix at least **two source types**. Pure web-only
rounds are a code smell — flag them in the round manifest.

## 4. Query Construction Heuristics

Per round, derive a query batch by varying *axis* and *angle*:

- **Definitional**: "what is X", "X overview"
- **Mechanism**: "how does X work internally", "X architecture"
- **Comparative**: "X vs Y", "alternatives to X"
- **Operational**: "running X in production", "scaling X"
- **Failure**: "X bugs", "X CVEs", "X gotchas", "X limitations"
- **Authoritative**: "X official documentation", "X source code", "X spec"
- **Recency**: "X 2025 changes", "X latest release"

Rules:

- 4 parallel queries per facet axis is the default fan-out width.
- At least one query per round must target an *authoritative* angle.
- Do not repeat queries from prior rounds within the same run; coverage
  tooling will flag duplicates.

## 5. Stopping Criteria

A run terminates when **any** of:

- **Saturation**: every defined facet axis has ≥3 distinct artifacts AND
  ≥2 source types.
- **Budget**: round count ≥ `depth_budget` (default 6).
- **Diminishing returns**: ≥3 duplicate findings within a single round.
- **User stop**: explicit `stop` / `wrap up` / `synthesize now`.

Per round, also stop if:

- New artifacts contain ≥80% facts already cited in prior manifests.
- Authoritative sources for the round's axis have all been fetched raw.

## 6. Round-Level Quality Bar

A round manifest is "good" when:

- Each query has at least one cited artifact path.
- Each artifact path resolves to a real file under `resources/`.
- `gaps[]` is non-empty (or explicitly marked `[]` with reason — every
  topic has unknowns at every depth).
- `next_round_hints[]` proposes 2-4 specific follow-up queries or sources.

If a round's manifest fails any of these checks, the operator must rerun
the round with corrected fan-out before advancing.

## 7. Synthesis Quality Bar

Synthesis (`<YYYYMMDD>-SUMMARY.md`) must:

- Address every required section in the schema (no skipped headers).
- Cite every non-trivial claim with a citation tag (e.g., `[r2c]`)
  resolvable in the citation index.
- Distinguish between **fact** (cited), **inference** (labelled), and
  **recommendation** (labelled).
- Include a `Limitations` section listing uncovered axes, source gaps,
  recency caveats.
- Include a `Suggested Next-Step Toolchain` section that names concrete
  CLIs, libraries, vendors, or processes the user should reach for next.

## 8. Re-Run Behavior

When the user reruns research on the same topic:

1. The new datestamp prefix isolates the new run.
2. Read prior `SUMMARY.md` and `citation-index.md` first; the new run's
   Phase 0 should reuse the prior facet axis tree unless the user requests
   a re-decomposition.
3. Mark each prior axis as `inherit`, `refresh`, or `expand`.
4. Only `refresh` and `expand` axes need new fan-out rounds.
5. The new SUMMARY.md may transclude prior sections via citation, but
   must be self-contained when read in isolation.

## 9. Subject-Neutrality Rules (CRITICAL)

The skill must be reusable across any domain. To enforce neutrality:

- **Never** name a facet axis after a topic-specific concept.
- **Never** hard-code a domain glossary into the skill, methodology,
  phases, or schemas.
- **Always** keep topic-specific terminology inside the *queries* and the
  *artifacts* — those are the per-run payload, not the structural language.
- If you find yourself writing a subject term in the playbook, replace it
  with a generic placeholder.

## 10. Illustrative Example (NOT the skill's subject)

> **EXAMPLE — replace with your topic.**
>
> Pretend the user runs `/research-deep "the history of windmills"`.
>
> Phase 0 produces:
> ```json
> {
>   "topic": "the history of windmills",
>   "facet_axes": [
>     "orientation",
>     "core_mechanics",
>     "lifecycle",
>     "operational",
>     "failure_modes",
>     "ecosystem_neighbors",
>     "authoritative_sources",
>     "version_skew",
>     "gotchas"
>   ],
>   "depth_budget": 6,
>   "source_allowlist": ["perplexity-cli", "exa", "octocode"]
> }
> ```
>
> Round 1 (Orientation) fan-out queries (illustrative, not topic-coupled):
> - "windmill historical overview canonical references"
> - "windmill earliest documented evidence regions"
> - "windmill terminology disambiguation watermill vs windmill"
> - "windmill authoritative academic sources"
>
> Round 2 (Core Mechanics) might pivot to mechanism queries.
>
> The same skeleton applies to *any* topic — replace "windmill" with the
> user's actual topic and the structure does not change.
>
> **End of illustrative example. The skill is not coupled to windmills.**

## 11. Anti-Patterns

- ❌ Hard-coding a domain into facet axes ("kubernetes_pods" instead of
  "core_mechanics").
- ❌ Single-source rounds (web-only without raw authoritative fetch).
- ❌ Overwriting artifacts on re-run (always datestamp).
- ❌ Inlining synthesis logic into bash scripts (synthesis is Claude's
  job; scripts only orchestrate).
- ❌ Skipping schema validation before declaring done.
- ❌ Burying gaps; every round MUST surface what it did not learn.

## 12. Heuristics for Pivoting Mid-Run

If a round reveals the topic has hidden subtopics (e.g., the user asked
about "X" but the canonical literature treats X as part of "X-family"):

- Update `facet_axes` in run-config (append, never delete).
- Note the pivot in `next_round_hints[]` of the current round.
- The next round may add a fan-out batch on the new sub-axis.

If a round reveals the topic is materially smaller than expected
(saturation by Round 2):

- Skip directly to Phase 5 (Authoritative) and Phase 6 (Synthesis).
- Record the early-termination reason in the final manifest.

## 13. Failure Recovery

If a script fails mid-run:

- Artifacts already written stay; don't roll back.
- Re-run only the failing fan-out batch; the manifest writer is
  idempotent on `(round, query_letter)` tuples.
- The validator should be the last gate — never the first.
