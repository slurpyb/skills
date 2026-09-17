# Releases

Version history for this repository (20 releases).

## v3.9.2: v3.9.2 — Phase scope inflation hot-fix (#133)
**Published:** 2026-05-18

Hot-fix for **#133** phase scope inflation. ARS was auto-dispatching single-phase agents on ambiguous cross-phase input (e.g., abstract + literature), and those agents were then running the full pipeline autonomously without independent crosschecks.

This release ships the **prompt-discipline + advisory-verifier hot-fix layer**. The deterministic gate (PreToolUse hook + multi-phase task envelope schema + author provenance) is tracked separately as **v3.10 active conductor (#134)** — long-term architectural fix.

## Highlights

- **Routing clarification gate** in `.claude/CLAUDE.md` + new `shared/references/intent_clarification_protocol.md`. Cross-phase materials → clarify with a-d options; `[direct-mode]` escape hatch (byte-0 case-insensitive).
- **Phase Boundary block** on 22 single-phase (Bucket A) agents. 16 multi-phase / phase-orthogonal / cross-phase-meta agents intentionally NOT fenced — honest framing per design review (placebo prose creates false-enforcement illusion).
- **Advisory verifier** `scripts/check_pipeline_integrity.py` detects the #133 pattern (phase5 missing DA/EIC/Ethics attribution) post-hoc.
- **Coverage lint** `scripts/check_v3_9_2_phase_boundary.py` enforces 22 fenced + 16 not.
- **Plugin metadata bump** 3.8.2 → 3.9.2 (catches v3.9.0 + v3.9.1 plugin.json deferrals).

## Migration notes

No break expected. New behavior: dropping pre-existing materials without invoking a specific slash command may now clarify (a-d options) instead of silent dispatch. To bypass clarification, prefix first message with `[direct-mode]` or use `/ars-full`.

Bucket B multi-phase agents (`devils_advocate`, `report_compiler`, `argument_builder`, `visualization`) intentionally not fenced — recurrence possible until v3.10 envelope ships. Report to #134 if observed.

## Stats

- **1482 tests pass** (+19 from v3.9.1 baseline 1463)
- 59 files changed, +2407 / -27 lines
- 4 design rounds + Phase 6 mid-impl review absorption

Full release notes in [CHANGELOG.md](https://github.com/Imbad0202/academic-research-skills/blob/main/CHANGELOG.md).

Closes #133
Refs #134

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.9.2)

---

## v3.9.0: v3.9.0 — Cross-Index Triangulation Measurement
**Published:** 2026-05-17

Closes #102.

## What changed

Extends v3.7.3 `contamination_signals` from single-index (Semantic Scholar) to **three-index triangulation** (S2 + OpenAlex + Crossref) as advisory evidence only. Terminal gate behavior unchanged from v3.7.3.

v3.9.0 is the **measurement layer**; the policy layer (strict modes, hard-block tier, `venue_type`, `triangulation_policy`) is deferred to v3.10 per spec §2.3.

k=3 marker is `CONTAMINATED-TRIANGULATION-UNMATCHED` (describes observable, not infers cause) per codex consult R2.

## 3 new firm rules (§3.3)

- **R-L3-2-C**: k computed over present `*_unmatched` fields only; absent ≠ false.
- **R-L3-2-D**: OpenAlex `host_venue.type` / Crossref `type` MUST NOT be used to derive classification (venue_type, scope, hard-block eligibility) within v3.9.0. The k=3 case makes those classifications structurally untrusted.
- **R-L3-2-E**: Terminal gate refusal list NOT extended. Formatter pass-through allowlist MUST extend in lockstep with finalizer (otherwise v3.9.0 advisory markers route through refusal rule 4 and gate-refuse — the exact regression this rule prevents).

R-L3-2-A (advisory only, never blocks on its own) preserved verbatim.

## Schema additions

- `openalex_unmatched` + `crossref_unmatched` optional booleans on `contamination_signals`.
- Manual-entry not-rule extended to `anyOf` of 3 lookup fields.
- Pipeline finalizer: 4-tier advisory matrix (k=0/1/2/3, with k_max=1 S2-vs-non-S2 split) + audit-trail columns 4 → 10.
- Formatter pass-through allowlist 3 → 9 suffixes. Refusal rules 1-10 unchanged.

## Clients

- **OpenAlex client**: DOI cross-check, 0.70 Levenshtein threshold, 429→2s×3 retry, polite-pool `mailto=` query param.
- **Crossref client**: `/works/{doi}` raw, `query.title` search, `User-Agent` polite-pool, nested `message` response, title-as-list, `issued.date-parts` year.

Both mirror S2 contract via `contamination_signals` resolvers (`resolve_openalex_unmatched` / `resolve_crossref_unmatched`).

## Spec review trail

3 rounds of dual-track review (codex gpt-5.5 xhigh + Gemini 3.1-pro-preview):

- R1 (`d9280bf`): 15 findings (3 P0, 8 P1, 4 P2) — closed.
- R2 (`7d51215`): 12 findings (0 P0, 3 P1, 9 P2) — closed.
- R3 (`4297c27`): 4 P2 findings — closed in T1 of impl plan.
- Both tracks declared READY-FOR-IMPL after R3.

PR review: R1-R4 dual-track + coherence R1 + verify; security NO FINDINGS; simplify 3 polish; 29 commits.

## Tests

- 40 schema tests + 20 lint-script tests pass.
- OpenAlex client: 9 tests (threshold match, no-match, DOI cross-check, DOI_MISMATCH, 404 miss, 429 retry exact 4 calls + 3×2s sleeps, 5xx call_count==1, year tiebreaker, polite-pool URL encoding).
- Crossref client: 9 tests (same 9 scenarios with Crossref-specific shapes).
- Contamination resolvers: 43 tests (33 v3.7.3 baseline + 10 new).
- Migration tool: 6 tests (dry-run, full backfill, manual skip, pre-v3.7.3 skip, idempotency, partial degradation).
- Regression: v3.7.3 baseline (48 three-layer-citation + 16 migrate-to-v3.7.3) all pass.
- v3.6.7 Phase 6.6 budget test extended + passes (804 total → 626 v3.6.7-attributed < 639 budget).
- Personal-boundary PII scan: 626 files, 0 violations.

## Migration

- **v3.7.3 corpora**: `python scripts/migrate_literature_corpus_to_v3_9_0.py PATH`
- **Pre-v3.7.3 corpora**: run `migrate_literature_corpus_to_v3_7_3.py` FIRST, then v3.9.0 (daisy-chained per spec §3.7).
- **Manual entries**: untouched (per R-L3-2-A user-vouch).

## Out of v3.9.0 scope (v3.10)

`venue_type` / `venue_type_provenance` schema fields, `triangulation_policy` enum (advisory / strict / strict_articles_only), strict mode hard-block tier, `HIGH-BLOCK` marker. v3.10 acceptance criteria in spec §2.3.


[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.9.0)

---

## v3.8.2: v3.8.2 — #118 uncited audit_tool_failure surface
**Published:** 2026-05-17

Closes #118 (carry-over from #103 R3 codex P2 #5).

## What changed

The `ARS_CLAIM_AUDIT=1` uncited constraint-judging path used to silently substitute `{"judgment": "NOT_VIOLATED", "rationale": "..."}` on `JudgeInvocationError`, suppressing HIGH-WARN constraint checks on transient judge outage. A flaky judge endpoint could pass a draft with a real MUST-NOT violation. v3.8.2 routes those failures through a dedicated `uncited_audit_failures[]` aggregate at MED-WARN advisory tier, mirroring the cited-path INV-14 row but using a separate schema because `claim_audit_result.ref_slug` is required and the uncited path has no ref to bind.

## Decision rationale — option 2 over 1/3/4

#118 issue body listed four candidate paths. Option 2 (new aggregate `uncited_audit_failures[]`) ships because:

- **Symmetry** with cited-path INV-14 `audit_tool_failure` row.
- **Schema integrity preserved**: `constraint_violation.judge_verdict: const VIOLATED` stays intact.
- **Audit coverage preserved**: option 4 (re-raise and abort) would have dropped coverage for the entire run on one transient outage — bad UX for N>50 papers running against flaky judge endpoints.
- **No concept-bleed**: routing UAF through `uncited_assertions[]` (option 3) would conflate D4-c token-rule advisory signal with audit-time infrastructure failure.

## Schema (§3.6 new)

New file `shared/contracts/passport/uncited_audit_failure.schema.json` with required fields `finding_id` (`UAF-NNN`), `claim_text`, `section_path`, `scoped_manifest_id`, `fault_class` (closed enum mirroring INV-14: `judge_timeout` / `judge_api_error` / `judge_parse_error` / `cache_corruption` / `retrieval_api_error` / `retrieval_timeout` / `retrieval_network_error`), `rationale` (fault_class prefix), `judge_model`, `judge_run_at`, `rule_version: D4-c-v1-uaf-v1`. Optional nullable `manifest_claim_id` (non-null only when an NC-C constraint was active for the failed call).

## Invariants UAF-INV-1..6

- **UAF-INV-1**: finding_id uniqueness
- **UAF-INV-2**: scoped_manifest_id cross-array integrity
- **UAF-INV-3**: (scoped_manifest_id, manifest_claim_id) pair integrity when manifest_claim_id non-null
- **UAF-INV-4**: per-(sentence, manifest) dedup with key `(scoped_manifest_id, section_path, claim_text_hash)`
- **UAF-INV-5**: rationale fault_class prefix matches the row's own `fault_class` field
- **UAF-INV-6**: cross-aggregate exclusivity with `constraint_violations[]` (VIOLATED and audit_tool_failure are mutually exclusive verdict states)

## Finalizer

New MED-WARN advisory row in spec §5: annotation `[CLAIM-AUDIT-TOOL-FAILURE-UNCITED — <fault-class>]`. Gate passes — retry-next-pass remediation. Formatter REFUSE list unchanged. `apply_finalizer()` routes UAF rows via `classify_uncited_audit_failure`. Orchestrator handoff at `pipeline_orchestrator_agent.md` updated to list `uncited_audit_failures[]` alongside the other Stage 4→5 outputs.

## Pipeline change

`scripts/claim_audit_pipeline.py` removes the synthetic `NOT_VIOLATED` substitution at lines 1211-1224 (pre-v3.8.2). The `except JudgeInvocationError as judge_err:` branch now emits a UAF row via `_uncited_audit_failure_entry(...)` and `continue`s to the next (sentence, manifest) pair. `manifest_claim_id` is set only when the manifest actually owns the claim AND at least one NC constraint entered the judge call (codex R1+R2 trajectory).

## Tests

Baseline 694 (v3.8.1) → **719 (v3.8.2)**, 0 regression at every commit.

- 15 schema/lint tests `TSUAFUncitedAuditFailureInvariants` (each UAF-INV paired pos/neg + schema validation + cross-aggregate exclusivity + fault_class enum vs constants sync + 2 malformed-payload hardening tests)
- 4 pipeline integration tests `TP23UncitedJudgeOutageEmitsUAF` (judge_timeout → UAF, partial-outage coverage preservation, NC-C path carries claim_id, multi-manifest claim_id polarity, MNC-only stays null)
- 2 finalizer routing tests `TUAFFinalizerRouting` (single fault class baseline + parametric coverage across all 7 fault classes)

## Cross-model review trail

Dual-track Codex (gpt-5.5 xhigh) + Gemini 3.1-pro-preview review across 4 rounds:

| Round | Codex | Gemini | Real bugs caught |
|---|---|---|---|
| R1 | 2 P2 | 1 P1 + 2 P2 | Finalizer routing gap, multi-manifest claim_id polarity, lint loop masking |
| R2 | 3 P2 | 1 P2 + 2 P3 | MNC-only polarity (R1 fix incomplete), 2 lint TypeError crashes on malformed payloads |
| R3 | 1 P2 | (skipped, R2 SHIP) | Orchestrator handoff doc missing UAF mirror |
| R4 | 0 ✅ | — | **Clean ship signal** |

12 findings closed total. Per `feedback_codex_review_surface_loop_design_phase.md` design-phase trajectory expectation: design-phase codex P2 noise floor doesn't auto-converge; user declares ship signal when trajectory shows P0/P1 clean and P2 polish.

## What didn't change

- The cited-path INV-14 row (`claim_audit_results[]` with `ref_retrieval_method=audit_tool_failure`) — unchanged.
- The 8-row finalizer matrix — unchanged (UAF is a separate aggregate per spec §5 advisory paragraph, not a claim_audit_result row).
- Formatter REFUSE list — unchanged (UAF is MED-WARN advisory, not gate-refuse).
- Backward compatibility: passports without `uncited_audit_failures[]` remain schema-valid; the aggregate is additive.

## Spec

`docs/design/2026-05-15-issue-103-claim-alignment-audit-spec.md` §3.6 (new) + §4 step 5 stream (d) routing clause + §4 step 9 fourth bullet + §5 finalizer outputs list + advisory paragraph + §6 lint rule 4d + precedence rule 6 cross-aggregate exclusivity reference.

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.8.2)

---

## v3.8.1: v3.8.1: claim_audit lint hardening (#119 + #120 4×P2)
**Published:** 2026-05-17

Defense-in-depth patch on `ARS_CLAIM_AUDIT=1` opt-in lint paths. Eight fixes carried over from #103 R6 + R8 codex review + 3 rounds of codex round-trip review on PR #124. No schema semantic change, no behavior change for well-formed payloads — pre-fix surfaces all crashed the CLI with `TypeError` / `AttributeError` instead of returning actionable lint findings or routing through the INV-14 `audit_tool_failure` translation boundary.

### Fixed

- **#119 / #120 P2-2** — nested schema-invalid shapes no longer crash invariant walkers. New `_iter_dicts` helper + narrow `isinstance(str)` guards in 6 walkers/builders so nested string-where-list / non-string-id / mixed-type-indices surface as clean schema findings (option 2 refined, not aggregate-level skip).
- **#120 P2-1** — CV-INV-4 dedupe key extended from `(section_path, claim_text_hash, violated_constraint_id)` to `(scoped_manifest_id, section_path, claim_text_hash, violated_constraint_id)`. Two manifests with colliding `MNC-*` / `NC-*` ids no longer false-positive on the same sentence text. Spec §3.5 + §7.1 4b updated.
- **#120 P2-3** — judge `judgment` `isinstance(str)` guard before set membership. Malformed `{"judgment": [1, 2], ...}` returns route as `judge_parse_error → audit_tool_failure`.
- **#120 P2-4** — retrieve `ref_retrieval_method` `isinstance(str)` guard before set membership. Symmetric to P2-3 on the retrieval boundary.
- **Codex Round 2 P2** — M-INV-1 / M-INV-4 / U-INV-1 / D-INV-1 / CV-INV-1 uniqueness loops + CV-INV-4 dedupe key construction now skip non-string ids before hashing.
- **Codex Round 3 P2** — removed dead `mnc_ids` set comprehension in M-INV-3 (latent dead code from v3.8.0 #103 that also crashed on unhashable MNC ids).

### Tests

`scripts/test_claim_audit_schema.py`: 6 new TS9 tests + new `TSCVDedupeManifestScope` class with 2 tests. `scripts/test_claim_audit_pipeline.py`: 2 new TP12 tests + 1 new TP14 test. Regression baseline: **682 → 694 tests (+12), 0 failures.**

### Ship gate trajectory (PR #124)

- Codex R1: 0 P0/P1, 1 P2
- Codex R2: 0 P0/P1, 1 P2
- Codex R3: **0 P0/P1/P2 — CLEAN**
- Security review: 0 findings (≥8 confidence)

Closes #119. Refs #120 P2-1 / P2-2 / P2-3 / P2-4 (all four R8 findings) + R6 P2 + 2 codex round-trip catches.

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.8.1)

---

## v3.8.0: v3.8.0 — L3 Claim-Faithfulness Locator + Audit
**Published:** 2026-05-16

**v3.7.3 + v3.8 paired milestone — L3 anti-hallucination contract end-to-end.**

v3.7.3 ships the locator infrastructure (every citation carries a three-layer anchor so the audit can fetch the cited passage); v3.8 ships the audit pass that consumes those anchors, judges whether the cited source supports the claim, and gate-refuses HIGH-WARN violations at the formatter terminal hard gate.

External motivation: [Zhao et al. arXiv:2605.07723](https://arxiv.org/abs/2605.07723) (2026-05) — 146,932 hallucinated citations across arXiv / bioRxiv / SSRN / PMC in 2025, mid-2024 inflection, 85.3% preprint-to-published persistence for the bioRxiv-to-PMC pairing.

## Highlights

### v3.8 #103 — `claim_ref_alignment_audit_agent`

Opt-in (`ARS_CLAIM_AUDIT=1`, default OFF for v3.8.0) Stage 4→5 audit agent dispatched after the v3.7.1 Cite-Time Provenance Finalizer and before `formatter_agent`'s hard gate. Judges every sampled citation against retrieved excerpt; emits 5 new passport aggregates + 1 sampling-summary record.

- **5 new HIGH-WARN annotation classes** in formatter REFUSE list: `[HIGH-WARN-CLAIM-NOT-SUPPORTED]` / `[HIGH-WARN-NEGATIVE-CONSTRAINT-VIOLATION]` / `[HIGH-WARN-FABRICATED-REFERENCE]` / `[HIGH-WARN-CLAIM-AUDIT-ANCHORLESS]` / `[HIGH-WARN-CONSTRAINT-VIOLATION-UNCITED]`. Mirror v3.7.3 R-L3-1-A asymmetry — `/ars-mark-read` does NOT clear; remediation is fixing the prose.
- **8-row finalizer matrix** discriminates paywall (LOW-WARN) / fabricated (HIGH-WARN) / anchorless (HIGH-WARN) / audit_tool_failure (MED-WARN) via `ref_retrieval_method` alongside `(judgment, defect_stage)`.
- **Calibration runner** with 20-tuple gold set: T-C1 FNR<0.15 + FPR<0.10 acceptance gate, T-C2 per-class FNR/FPR, T-C3 shape integrity.
- **5 new passport schemas** under `shared/contracts/passport/`: `claim_audit_result` / `claim_intent_manifest` / `claim_drift` / `uncited_assertion` / `constraint_violation`.
- **2 new lints**: `check_claim_audit_consistency.py` (38 invariants) + `check_v3_8_annotation_literal_sync.py`.

Review trail: 8 rounds (R1 codex + Gemini 3.1-pro-preview, R2-R8 codex-only after Gemini quota exhausted); trajectory R1 4P1+2P2 → R8 0P1+4P2 ship gate.

### v3.7.3 — Three-Layer Citation Emission + contamination signals (PR #98)

`synthesis_agent` / `draft_writer_agent` / `report_compiler_agent` gain `## Three-Layer Citation Emission (v3.7.3)` H2. Every `<!--ref:slug-->` carries `<!--anchor:<kind>:<value>-->` with `<kind> ∈ {quote, page, section, paragraph, none}`. `pipeline_orchestrator_agent` finalizer becomes 5-cell with precedence-zero NO-LOCATOR check. `literature_corpus_entry.schema.json` adds optional `contamination_signals` object.

### Bundled feature PRs (audit-trail-shipped on main between v3.7.0 and v3.8.0)

- **#108** — AI disclosure policy-anchor renderer (PRISMA-trAIce / ICMJE / Nature / IEEE)
- **#111** — `slr_lineage` emission on systematic-review → academic-paper handoff
- **#104** — README motivation: Zhao et al. corpus-scale evidence anchor
- **#105** — v3.7.3 contamination_signals backfill migration tool
- **#115** — Semantic Scholar client maturity (throttle + outage latch)

## Carry-over follow-up issues (v3.8.1 candidates)

- **#118** — uncited path NOT_VIOLATED swallow on judge failure (schema-level decision)
- **#119** — nested schema-invalid shapes crash invariant helpers
- **#120** — 4 R8 P2 findings (CV-INV-4 dedupe scope / invariant walker short-circuit / judgment + retrieval-method type-check)

## Install

**Plugin (Claude Code CLI / VS Code / JetBrains, v3.7.0+):**

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

Traditional `git clone + symlink to ~/.claude/skills/` also continues to work.

## Final regression baseline

- pytest: 1356 passed, 3 skipped, 103 subtests
- #103 unittest: 194 OK (7 modules)
- v3.x lints: 7/7 PASS (v3.6.7 / v3.6.8 ×4 / v3.7.3 / v3.8)
- SHA-pinned zero-touch: `sprint_contract.schema.json` 0 lines diff, `audit_artifact_entry.schema.json` 0 lines diff against pre-#103 main

---

**Full CHANGELOG:** [CHANGELOG.md](https://github.com/Imbad0202/academic-research-skills/blob/v3.8.0/CHANGELOG.md)

**Compare:** [v3.7.0...v3.8.0](https://github.com/Imbad0202/academic-research-skills/compare/v3.7.0...v3.8.0)

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.8.0)

---

## v3.7.0: ARS v3.7.0 — Claude Code Plugin Packaging
**Published:** 2026-05-05

## Highlights

ARS now installs in **one line** on Claude Code CLI / VS Code / JetBrains:

```
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

The traditional `git clone + symlink to ~/.claude/skills/` flow continues to work — both tracks are first-class.

## What's new

### Plugin packaging surface (4 new top-level dirs)

- **`.claude-plugin/`** — `plugin.json` declares the suite; `marketplace.json` registers the GitHub-hosted endpoint as a plugin marketplace.
- **`commands/ars-*.md`** — 10 slash commands mapping `MODE_REGISTRY.md` entries to `/ars-<mode>` triggers. Model routing pinned in frontmatter: `opus` for `full` and `revision-coach`, `sonnet` for the other 8. **No Haiku.**
- **`agents/*_agent.md`** — 3 plugin-shipped agents as relative symlinks to the v3.6.7-hardened downstream agents in `deep-research/agents/` (`synthesis_agent`, `research_architect_agent`, `report_compiler_agent`). Source frontmatter gains `model: inherit` so an Opus session keeps Opus agents.
- **`hooks/hooks.json` + `scripts/announce-ars-loaded.sh`** — SessionStart announce hook that injects the slash-command list + agent list + token-budget pointer when the plugin loads. Bash 3.2 compatible.

### What didn't change

The four skill directories (`deep-research/`, `academic-paper/`, `academic-paper-reviewer/`, `academic-pipeline/`), all 25 modes, agent prompts, schema files, and lint contracts. Plugin packaging only **adds** new top-level surface — no breaking change for existing 4.3k clone-install users.

### Deferred (future release)

A `SubagentStop → run_codex_audit.sh` codex audit hook was scoped out of v3.7.0 due to a contract gap: the SubagentStop payload carries no stage/deliverable info, so the wrapper would have to half-infer required arguments. Real audit-hook integration deferred to a future release when ARS gains a stage/deliverable propagation contract. See `docs/design/2026-04-30-ars-v3.7.0-plugin-packaging-roadmap.md` Update note 2026-05-05 (Phase 2.2 scope reduction).

## Codex review chain

11 inline iterative rounds + 4 fresh PR-level rounds across the 4 PRs (#68 / #69 / #70 / #71), all converging to 0 P0/P1/P2 findings before each merge. Highlights:

- **Phase 2.1 R1** caught a P1 — three v3.6.7 source agents had no `model:` frontmatter, defaulting to Haiku via the plugin loader. Fixed by adding `model: inherit`.
- **Phase 2.2 fresh PR R1** caught a P2 the inline rounds missed — `${CLAUDE_PLUGIN_ROOT}` not quoted, breaking install paths containing spaces (e.g. `/Users/Jane Doe/...`). Fixed by quoting and using `bash "..."` invoker, matching Claude Code's bundled plugin pattern.
- **Phase 3 R2** caught a cascade — `docs/PERFORMANCE.md` still said "v3.6.8+ scope" after R1 fixed the same wording elsewhere; semver-confusing as permanent doc language.

Tests: 742 passed + 3 skipped (unchanged from v3.6.8).

## Install

### Plugin (recommended for Claude Code CLI / VS Code / JetBrains)

```
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

Open `/plugin` UI to enable auto-update.

### Manual clone + symlink (legacy, still supported)

See [`docs/SETUP.md`](docs/SETUP.md) Method 1.

## Full changelog

See [`CHANGELOG.md`](CHANGELOG.md#370---2026-05-05) for the complete `[3.7.0] - 2026-05-05` section.

## PRs in this release

- #68 — Phase 1 MVP (plugin manifest + skills/ symlinks)
- #69 — Phase 2.1 (10 slash commands + 3 hardened agent symlinks + `model: inherit`)
- #70 — Phase 2.2 (SessionStart announce hook + scope reduction)
- #71 — Phase 3 (version sweep + CHANGELOG entry)

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.7.0)

---

## v3.6.5: v3.6.5 — Material Passport literature_corpus[] Consumer Integration
**Published:** 2026-04-27

**Material Passport `literature_corpus[]` consumer integration in Phase 1.**

Two Phase 1 literature agents now read the user-curated `literature_corpus[]` field shipped in v3.6.4:

- `deep-research/agents/bibliography_agent.md`
- `academic-paper/agents/literature_strategist_agent.md`

Both consumers follow the same five-step **corpus-first, search-fills-gap** flow with the same four Iron Rules (Same criteria / No silent skip / No corpus mutation / Graceful fallback on parse failure). Search Strategy reports gain a `PRE-SCREENED FROM USER CORPUS:` reproducibility block enumerating included / excluded / skipped entries, with F3 zero-hit note and F4a–F4f provenance reporting.

Consumer integration is presence-based — auto-engages when the passport carries a non-empty `literature_corpus[]` and parses cleanly. Parse failures fall back to external-DB-only flow with a `[CORPUS PARSE FAILURE]` surface. **Schema is unchanged from v3.6.4** — existing user adapters work without modification. No new env flag.

## Pull Requests

- **PR-A** #41 — single-consumer pre-release (deep-research bibliography_agent, lint, manifest, reference doc skeleton). Merged 2026-04-26.
- **PR-B** #42 — release sweep (academic-paper literature_strategist_agent, manifest append, stub-to-full promotion, version sweep, CHANGELOG, Schema 9 caveat retirement). Merged 2026-04-27.

## Version Sweep

- `academic-pipeline` 3.6.4 → 3.6.5 (suite version invariant)
- `deep-research` 2.9.1 → 2.9.2 (also synced Version Info footer drift since v3.5.1 PR #36)
- `academic-paper` 3.1.0 → 3.1.1
- MODE_REGISTRY, .claude/CLAUDE.md, README.md, README.zh-TW.md, docs/PERFORMANCE.{md,zh-TW.md}, check_spec_consistency.py — all aligned

## Notes

- `citation_compliance_agent` corpus integration deferred to v3.6.6+.
- `source_pointer` URI dereferencing remains a future `source_verification_agent` concern.
- See [CHANGELOG.md](https://github.com/Imbad0202/academic-research-skills/blob/v3.6.5/CHANGELOG.md) for full release notes.

Spec: [`docs/design/2026-04-26-ars-v3.6.5-consumer-integration-design.md`](https://github.com/Imbad0202/academic-research-skills/blob/v3.6.5/docs/design/2026-04-26-ars-v3.6.5-consumer-integration-design.md).

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.6.5)

---

## v3.6.4: v3.6.4 — Material Passport literature_corpus[] input port
**Published:** 2026-04-25

**Material Passport `literature_corpus[]` input port + three reference Python adapters.** v3.6.4 defines the input port only; consumer-side integration (agents that READ `literature_corpus[]`) is deferred to v3.6.5+.

## Added

- **Material Passport `literature_corpus[]`** input port (Schema 9 optional). Each entry conforms to [`shared/contracts/passport/literature_corpus_entry.schema.json`](https://github.com/Imbad0202/academic-research-skills/blob/v3.6.4/shared/contracts/passport/literature_corpus_entry.schema.json) — CSL-JSON authors, year, title, source_pointer, plus PRIVATE optional `abstract` and `user_notes`.
- **Adapter contract** at [`academic-pipeline/references/adapters/overview.md`](https://github.com/Imbad0202/academic-research-skills/blob/v3.6.4/academic-pipeline/references/adapters/overview.md): language-neutral specification for producing literature_corpus entries from any user-owned corpus source. Fail-soft entry-level errors, fail-loud adapter-level errors, deterministic ordering (sort by `citation_key` / `source`).
- **Three reference Python adapters** under [`scripts/adapters/`](https://github.com/Imbad0202/academic-research-skills/tree/v3.6.4/scripts/adapters):
  - `folder_scan.py` — filesystem of PDFs with filename-derived metadata
  - `zotero.py` — Better BibTeX JSON export (NOT the Web API)
  - `obsidian.py` — vault frontmatter (Convention A: BibTeX-style; Convention B: literature notes)
  Each ships with pytest tests, fixtures, and golden expected outputs. Reference adapters only — users are expected to write their own for non-reference sources.
- **Rejection log contract** at [`shared/contracts/passport/rejection_log.schema.json`](https://github.com/Imbad0202/academic-research-skills/blob/v3.6.4/shared/contracts/passport/rejection_log.schema.json). Always emitted; closed enum of categorical reason values.
- **CI lint + pytest job**: `scripts/check_literature_corpus_schema.py` (schemas + adapter examples), `scripts/sync_adapter_docs.py --check` (schema→docs drift detector), and a new `pytest.yml` workflow on path-filtered triggers.
- **`_common.py` shared helpers**: `path_to_file_uri`, `ensure_unique_citekey`, `make_citation_key`, `parse_csl_name`, `parse_semicolon_names`, `write_passport`, `write_rejection_log`, `now_iso`.

## Changed

- `academic-pipeline/references/passport_as_reset_boundary.md`: "deferred to v3.6.4, PR-B" placeholders replaced with forward references.
- `shared/handoff_schemas.md`: Schema 9 optional fields table adds `literature_corpus`; new "Literature Corpus Input Port (v3.6.4)" subsection.
- `academic-pipeline` SKILL bumped 3.6.3 → 3.6.4 (suite version invariant). Other skills retain independent semver.

## Not changed (explicit non-goals)

- No ARS agent consumes `literature_corpus[]` yet. Consumer-side integration is deferred to v3.6.5+.
- No PDF parsing, no live API clients, no paywall bypass. Reference adapters read filenames or local export files and never make network calls.

## Stats

25 commits / 53 files / +4566 / -19. 154 adapter tests / 301 repo tests. Each schema/contract artifact passed `/codex review` in PR #40 with P1/P2/P3 fixes folded back in (see commit history). PR: #40.

## Full diff

https://github.com/Imbad0202/academic-research-skills/compare/v3.6.3...v3.6.4

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.6.4)

---

## v3.6.3: v3.6.3 — Passport Reset Boundary + resume_from_passport
**Published:** 2026-04-23

## Highlights

Opt-in cross-session context reset anchored by the Material Passport ledger.

### Added

- **`ARS_PASSPORT_RESET=1` flag** — every FULL checkpoint becomes a reset boundary when the flag is set. `systematic-review` mode with the flag ON = mandatory reset; other modes = strong-default (user `continue` overrides back to continuation for the next stage). Flag OFF = pre-v3.6.3 behavior byte-for-byte.
- **`resume_from_passport=<hash> [stage=<n>] [mode=<m>]` mode** in `academic-pipeline` — resumes a pipeline run in a fresh Claude Code session from the Material Passport ledger alone. No turn replay.
- **Schema 9 `reset_boundary[]`** append-only field with `oneOf` split over `kind: boundary` / `kind: resume`. Hash via JSON Canonical Form (RFC 8785) + SHA-256 with canonical `"000000000000"` placeholder for self-reference safety.
- **`pending_decision` field** with per-branch routing — `options[]` is `[{value, next_stage, next_mode?}]`. Matched option's `next_stage` supersedes the advisory boundary `next` field. `next` MAY be `null` when all branches terminate.
- **Concurrency contract** — exclusive advisory lock (POSIX `fcntl.flock LOCK_EX`, bounded timeout ≤ 60 s, 30 s recommended) around the resume read-check-append sequence. Non-POSIX implementations MUST refuse to resume rather than degrade silently.
- **Protocol doc** `academic-pipeline/references/passport_as_reset_boundary.md` — authoritative.
- **CI lint** `scripts/check_passport_reset_contract.py` + unittest suite (12 tests) — enforces co-location of every `ARS_PASSPORT_RESET` mention with a protocol-doc reference, and `options[].value` uniqueness within each `pending_decision` array.

### Changed

- `academic-pipeline/agents/pipeline_orchestrator_agent.md` adds §"Passport Reset Boundary" + §"Resume Mode: `resume_from_passport`" with 9 iron rules covering emission, resume, concurrency, and pending_decision routing.
- `academic-pipeline/references/pipeline_state_machine.md` documents `awaiting_resume` transitions derived from the ledger.
- `academic-pipeline/SKILL.md` adds `resume_from_passport` to the mode table; version bump 3.6.2 → 3.6.3.
- `shared/handoff_schemas.md` Schema 9 gains `reset_boundary` row + "Reset Boundary Extension (v3.6.3)" subsection with full YAML example showing both entry kinds.
- `docs/PERFORMANCE.md` + `docs/PERFORMANCE.zh-TW.md` — new long-running-session subsection covering when reset beats continuation, passport file-location convention, and three-level resume-stage resolution (CLI override > matched option > recorded next).

### Notes

- **Flag OFF is the default.** Pre-v3.6.3 behavior is preserved byte-for-byte when `ARS_PASSPORT_RESET` is unset or `=0`.
- **Out of scope (deferred to v3.6.4):** reference adapters (`examples/adapters/{folder_scan, zotero, obsidian}/`) and the `literature_corpus` entry shape on Schema 9.
- **No breaking changes.** Existing mode behavior is unchanged when the flag is OFF.

## Review pipeline

5 rounds codex audit + /simplify + per-task two-stage Claude review (spec compliance + code quality).

| Round | What it caught | Closed in |
|-------|----------------|-----------|
| R1 | 3 contract-level bugs | `60d563a` |
| R2 | 5 cascade inconsistencies | `b13a39f` |
| /simplify | 3 nits (iron-rule ref, tag placeholder, CHANGELOG) | `f3bd876` |
| R3 | 2 P1 deep semantic holes (pending_decision routing + resume race) | `99cee2c`, `bca6d27` |
| R4 | 2 P1 + 3 P2 from R3 aftermath (nullable next, value uniqueness, timeout cap) | `e61a551` |
| R5 | 2 P2 doc drift | `afe741e` |

R5 verdict: READY TO MERGE.

## Links

- **Pull request:** #38
- **Full changelog:** [CHANGELOG.md](https://github.com/Imbad0202/academic-research-skills/blob/v3.6.3/CHANGELOG.md#363---2026-04-23)
- **Protocol doc:** [passport_as_reset_boundary.md](https://github.com/Imbad0202/academic-research-skills/blob/v3.6.3/academic-pipeline/references/passport_as_reset_boundary.md)

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.6.3)

---

## v3.6.2: v3.6.2 — Reviewer Sprint Contract Hard Gate
**Published:** 2026-04-23


### Added

- **Sprint Contract (Schema 13) — reviewer hard gate.** `shared/sprint_contract.schema.json` defines machine-checkable acceptance criteria (`panel_size`, `acceptance_dimensions`, `failure_conditions` with `severity` + `cross_reviewer_quantifier`, `measurement_procedure`, optional `override_ladder`, bounded `agent_amendments`). Validator `scripts/check_sprint_contract.py` (schema validation + `check_structural_invariants()` hard check + nine soft warnings SC-1..SC-11 with SC-6 documented as dead path and SC-8 promoted to hard check). Two templates ship: `shared/contracts/reviewer/full.json` (panel 5) and `shared/contracts/reviewer/methodology_focus.json` (panel 2). Reviewer orchestration reshaped into paper-content-blind Phase 1 + paper-visible Phase 2 hard gate. Synthesizer runs three-step mechanical protocol (build matrix → evaluate with quantifier → resolve precedence). See `docs/design/2026-04-23-ars-v3.6.2-sprint-contract-design.md`.
- **Token cost note.** Reviewer total calls under sprint contract = `2 × panel_size`. For `reviewer_full`: 5 → 10 calls. Phase 1 input is metadata-only and output short, so real token bound is well below 2x.

### Changed

- **`academic-paper-reviewer` v1.8.1 → v1.9.0.** Five reviewer agent markdown files (EIC + methodology + domain + perspective + DA) gain Phase 1/2 protocol sections; `editorial_synthesizer_agent.md` gains the three-step synthesizer protocol + forbidden-operations list.
- **Harness retirement notes folded in.** The prior `[Unreleased]` harness-retirement pass (Task A per `project_ars_v3.6_execution_order.md`) ships with this release — 7 negative-framing blocks rewritten to positive / split form across 7 files, no behaviour change:
  - `academic-paper/agents/socratic_mentor_agent.md` — Core Principles items 1, 6 (F-001)
  - `deep-research/agents/socratic_mentor_agent.md` — Quality Standards items 2, 3, 4 (F-002)
  - `academic-paper/agents/draft_writer_agent.md` — quick style check, paragraph variation, colloquialisms, transition-word usage (F-003, 4 spots)
  - `academic-pipeline/agents/pipeline_orchestrator_agent.md` — **split** "Prohibited Actions" (9 items, all negative) into "Scope (delegate, don't perform)" (items 1-6, positive delegation) + "Hard boundaries (never violate)" (items 7-9, kept negative as intentional safety directives for silent-failure modes: fabrication, skipped checkpoints, skipped integrity gates) (F-004)
  - `academic-pipeline/agents/collaboration_depth_agent.md` — Agent-specific boundaries 4 bullets (F-005)
  - `academic-pipeline/SKILL.md` — single-line UX guidance (F-006)
  - `academic-paper/references/academic_writing_style.md` — §4 Formality 3 items (F-007, discovered during apply)

### Notes

- `reviewer_re_review`, `reviewer_calibration`, `reviewer_guided` are reserved in the Schema 13 `mode` enum but ship without contract templates in v3.6.2. Those modes continue pre-v3.6.2 behaviour until a follow-up patch adds their templates.
- `reviewer_quick` is intentionally excluded from the Schema 13 `mode` enum (Q3-A' boundary).
- CI gate: `validate-sprint-contracts` step in `.github/workflows/spec-consistency.yml` runs the full unit test suite and validates every template under `shared/contracts/reviewer/*.json` against the current ARS version.
- Kept-as-debt from harness retirement: ~50 anti-hallucination references across `deep-research/`, `academic-paper/references/anti_leakage_protocol.md`, `academic-pipeline/references/ai_research_failure_modes.md`, `shared/agents/compliance_agent.md`, `shared/compliance_checkpoint_protocol.md` — load-bearing integrity architecture (Lu 2026 7-mode; S2 API Tier-0; `[MATERIAL GAP]` taxonomy). Not retired under the iron rule clause for silent-failure domains.



[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.6.2)

---

## v3.4.0: v3.4.0 — Compliance Agent (PRISMA-trAIce + RAISE)
**Published:** 2026-04-20

## [3.4.0] - 2026-04-20

### Added

- `shared/agents/compliance_agent.md` — single mode-aware agent for PRISMA-trAIce + RAISE compliance. Dispatches on `compliance_mode ∈ {systematic_review, primary_research, other_evidence_synthesis}`. See design spec `docs/design/2026-04-20-v3.4-prisma-trAIce-raise-readcheck-design.md`.
- `shared/prisma_trAIce_protocol.md` — verbatim 17-item snapshot from `cqh4046/PRISMA-trAIce` (2025-12-10) + per-item ARS check procedure + 4-tier behaviour table. Citation: Holst et al. 2025, JMIR AI, doi:10.2196/80247.
- `shared/raise_framework.md` — 4 principles (human oversight / transparency / reproducibility / fit-for-purpose) + 8-role matrix + mandatory scope disclaimer. Citation: Thomas et al. 2025, NIHR ESG Best Practice Working Group, 17 July 2025.
- `shared/compliance_checkpoint_protocol.md` — Stage 2.5 / 4.5 dual-gate behaviour spec, decision precedence, override ladder, fail-loop integration, boundary behaviour for non-pipeline invocation.
- `shared/compliance_report.schema.json` — Schema 12 validator (Draft 2020-12).
- `examples/compliance/fixture_sr_full_compliant.yaml`, `fixture_sr_missing_M4.yaml`, `fixture_primary_raise_weak.yaml` — regression fixtures + user reference templates.
- `scripts/check_compliance_report.py` + tests — Schema 12 CLI validator.
- `scripts/validate_compliance_fixtures.py` + tests — YAML→JSON fixture loop used by CI.
- `scripts/check_prisma_trAIce_freshness.py` + tests — non-blocking upstream-drift warning (180-day threshold).
- `.github/workflows/freshness-check.yml` — weekly cron (Monday 09:00 UTC) + path-filtered push trigger for freshness check.
- `docs/PERFORMANCE.md` + `.zh-TW.md`: new "Long-running session management" section + v3.4.0 token-cost deltas.

### Changed

- `shared/handoff_schemas.md`: Schema 12 pointer + Material Passport `compliance_history[]` (append-only audit trail).
- `academic-pipeline/SKILL.md` (v3.2.2 → v3.3.0): Stage 2.5 / 4.5 extended with compliance payload; checkpoint dashboard gains compliance row.
- `deep-research/SKILL.md` (v2.8.1 → v2.9.0): `systematic-review` mode now triggers `compliance_agent` at both gates.
- `academic-paper/SKILL.md` (v3.0.2 → v3.1.0): `full` mode adds pre-finalize RAISE principles-only check (warn-only). `disclosure` mode unchanged and complementary.
- `.github/workflows/spec-consistency.yml`: added compliance validator + unit test runner steps.
- `scripts/check_spec_consistency.py`: version pins bumped.
- `README.md`, `README.zh-TW.md`, `.claude/CLAUDE.md`, `MODE_REGISTRY.md`: suite version → 3.4.0.

### Notes

- Calibration philosophy: compliance_agent ships with transparent reporting, **no hard FNR/FPR threshold**. This is self-consistent with ARS's v3.3.2 `task_type: open-ended` truth-in-advertising annotation — publishing a hard gate would contradict the "not a benchmark task" declaration.
- Compliance Mandatory failures in SR mode are blocking, but the 3-round override ladder preserves human-in-the-loop authority. Overrides auto-inject `disclosure_addendum` into the final manuscript — no detection evasion.
- The v3.2 Failure Mode Checklist and the v3.4.0 compliance agent run in parallel at the same gates. Their scopes are non-overlapping: failure-mode checks research validity; compliance checks reporting transparency.
- Internal numbering: compliance_report is Schema 12 (not 10). Schema 10 is Style Profile (v2.7+); Schema 11 is R&R Traceability Matrix. The plan's initial Schema 10 assignment was corrected mid-branch before Task 9.



[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.4.0)

---

## v3.3.4: v3.3.4
**Published:** 2026-04-15

## Summary
- sync the embedded changelog sections in `README.md` and `README.zh-TW.md` so they include `v3.3.3` and `v3.3.2`
- extend `scripts/check_spec_consistency.py` so future README changelog drift fails CI

## Why
The `v3.3.3` release metadata had already been published, but the changelog summaries embedded in the READMEs still stopped at `v3.3.1`.

## Validation
- `python scripts/check_spec_consistency.py`


[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.3.4)

---

## v3.3.3: v3.3.3
**Published:** 2026-04-15


### Fixed
- `scripts/_skill_lint.py` now rejects SKILL frontmatter that is missing a closing `---` fence instead of silently treating the rest of the file as YAML.
- `scripts/_skill_lint.py` now reports a readable error when frontmatter parses as valid YAML but not as a mapping object, instead of crashing with `AttributeError`.
- Broken showcase link for the post-publication audit report corrected in both `README.md` and `README.zh-TW.md`.
- `scripts/check_spec_consistency.py` now validates README relative Markdown links so future dead links fail CI.

### Changed
- DOCX generation contract aligned across README, `academic-paper/SKILL.md`, `academic-paper/agents/formatter_agent.md`, `academic-pipeline/SKILL.md`, and `academic-pipeline/agents/pipeline_orchestrator_agent.md`: direct `.docx` output is Pandoc-dependent, with Markdown + conversion instructions as the fallback.
- Added regression tests covering missing closing fences and non-mapping YAML frontmatter in both lint test suites.
- Suite version bumped to `3.3.3` across release-facing docs; `academic-paper` patch-bumped to `3.0.2` and `academic-pipeline` patch-bumped to `3.2.2`.



[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.3.3)

---

## v3.3.2: v3.3.2 — data_access_level + task_type metadata + ground-truth pattern
**Published:** 2026-04-15

# v3.3.2 — data_access_level metadata

**Release date:** 2026-04-15

## What's new

Added a declarative `data_access_level` field to every top-level SKILL.md. Values:

- `raw` — consumes unverified sources
- `redacted` — operates on sanitized material
- `verified_only` — runs only after upstream integrity gates

This is a small, additive change with no behavior impact. It gives pipelines, CI, and downstream tooling (e.g., agent-council integration) a consistent way to reason about which skills may see which kinds of data.

## Why

Inspired by the three-tier isolation pattern in Anthropic's automated-w2s-researcher (2026). ARS's integrity gates already enforce a similar separation in practice — this change makes it declarative and machine-checkable.

### `task_type`

Two-value field: `open-ended` or `outcome-gradable`. All current ARS skills are `open-ended` — explicit acknowledgment that ARS is built for domain-judgment work (humanities, QA, policy analysis), not for benchmark tasks where a scalar metric defines success.

This pairs with `data_access_level` to give callers a complete posture per skill.

## Full changelog

- `metadata.data_access_level` on `deep-research` (`raw`), `academic-paper` (`redacted`), `academic-paper-reviewer` (`verified_only`), `academic-pipeline` (`verified_only`)
- New lint: `scripts/check_data_access_level.py` with 4 unit tests (including malformed-YAML coverage)
- CI: wired into `.github/workflows/spec-consistency.yml`
- Documentation: `shared/handoff_schemas.md`, `README.md`, `README.zh-TW.md`, `.claude/CLAUDE.md`
- `metadata.task_type` on all 4 SKILL.md (all `open-ended`)
- `scripts/check_task_type.py` lint + 4 unit tests, wired into CI
- README per-skill posture table (data_access_level + task_type combined)

## Upgrade notes

None — the change is additive. External users of ARS need take no action.


[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.3.2)

---

## v3.3: v3.3 — PaperOrchestra-Inspired Enhancements
**Published:** 2026-04-09

## v3.3 — PaperOrchestra-Inspired Enhancements

Integrates techniques from [PaperOrchestra](https://arxiv.org/abs/2604.05018) (Song, Song, Pfister & Yoon, 2026, Google) — a multi-agent framework that autonomously authors LaTeX manuscripts from raw research materials.

### New Features

- **Semantic Scholar API Verification** — Tier 0 programmatic reference existence check via S2 API. Levenshtein ≥ 0.70 title matching, DOI mismatch detection (Compound Deception Pattern #5), bibliography deduplication via S2 IDs. Graceful degradation if API unavailable.
- **Anti-Leakage Protocol** — Knowledge Isolation Directive prioritizes session materials over LLM parametric memory for factual content. Flags `[MATERIAL GAP]` for missing content instead of silently filling from memory. Reduces Mode 5/6 failure risk.
- **VLM Figure Verification** (optional) — Closed-loop verification of rendered figures using a vision-capable LLM. 10-point checklist covering data accuracy, APA 7.0 compliance, and visual quality. Max 2 refinement iterations.
- **Score Trajectory Protocol** — Per-dimension rubric score delta tracking across revision rounds. Detects regressions (delta < -3) and triggers mandatory checkpoint. Extends v3.2 early-stopping with dimension-level granularity.
- **Stage 2 Parallelization Directive** — Visualization and argument building can run in parallel after outline completion.

### Schema Updates

- `semantic_scholar_id` field added to Bibliography source object (Schema 2)
- `score_trajectory` structure added to Integrity Report (Schema 5), aligned with 7 universal review dimensions

### Version Bumps

| Skill | Version |
|-------|---------|
| deep-research | v2.7 → **v2.8** |
| academic-paper | v2.9 → **v3.0** |
| academic-paper-reviewer | v1.8 (unchanged) |
| academic-pipeline | v3.1 → **v3.2** |

### New Files

- `deep-research/references/semantic_scholar_api_protocol.md`
- `academic-paper/references/anti_leakage_protocol.md`
- `academic-paper/references/vlm_figure_verification.md`
- `academic-pipeline/references/score_trajectory_protocol.md`

### Full Changelog

See [CHANGELOG.md](https://github.com/Imbad0202/academic-research-skills/blob/main/CHANGELOG.md) for details.

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.3)

---

## v3.2: v3.2 — Lu 2026 Nature Integration
**Published:** 2026-04-09

Integrates insights from Lu et al. (2026, *Nature* 651:914-919) — the first end-to-end autonomous AI research system to pass blind peer review.

### Added

- **7-mode AI Research Failure Mode Checklist** — blocks pipeline at Stage 2.5/4.5 on suspected implementation bugs, hallucinated results, shortcut reliance, bug-as-insight, methodology fabrication, frame-lock. Extends existing 5-type citation hallucination taxonomy.
- **Reviewer Calibration Mode** (v1.8) — opt-in FNR/FPR/balanced-accuracy measurement against user-supplied gold set. 5× ensembling, cross-model default-on, session-scoped confidence disclosure.
- **Disclosure Mode** (v2.9) — venue-specific AI-usage statement generator. v1 covers ICLR, NeurIPS, Nature, Science, ACL, EMNLP.
- **Early-Stopping Criterion** (pipeline v3.1) — convergence check + budget transparency at pipeline start.
- **Fidelity-Originality Mode Spectrum** — classifies all modes across 3 skills per Lu 2026 Fig 1c.
- **README positioning update** — cites Lu 2026 as external evidence for ARS's human-in-the-loop thesis (EN + zh-TW).

### Version bumps
- academic-paper: v2.8 → v2.9
- academic-paper-reviewer: v1.7 → v1.8
- academic-pipeline: v3.0 → v3.1

Full details in [CHANGELOG.md](CHANGELOG.md) and [ROADMAP_v3.2.md](ROADMAP_v3.2.md).

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.2)

---

## v3.1: v3.1 — Anti-Context-Rot + Cognitive Frameworks + Lean Size
**Published:** 2026-04-06

Inspired by patterns from [aspi6246/Claude-Code-Skills-for-Academics](https://github.com/aspi6246/Claude-Code-Skills-for-Academics).

## Wave 1: Anti-Context-Rot Anchors
- 29 explicit Anti-Patterns across all 4 skills (7-8 per skill, tabular format)
- 22 IRON RULE markers on critical rules
- Read-only constraint on academic-paper-reviewer

## Wave 2: Traceability + Cognitive Frameworks + Reinforcement
- **R&R Traceability Matrix** (Schema 11): "Author's Claim" + "Verified?" columns in re-review output
- 3 cognitive framework reference files:
  - `argumentation_reasoning_framework.md` — Toulmin model, Bradford Hill, IBE, epistemic status
  - `review_quality_thinking.md` — three lenses, reviewer traps, calibration questions
  - `writing_judgment_framework.md` — clarity test, reader's journey, discipline-specific voice
- Mid-conversation reinforcement protocol at every pipeline stage transition
- Self-check questions at every FULL checkpoint

## Wave 3: Lean Skill Size
- SKILL.md total size: **142KB → 85KB (−40%)**
- ~15 new reference files (detailed protocols extracted, loaded on demand)
- All IRON RULE markers preserved in SKILL.md

## Versions
| Skill | Version |
|-------|---------|
| deep-research | v2.7 |
| academic-paper | v2.8 |
| academic-paper-reviewer | v1.7 |
| academic-pipeline | v3.0 |

## Contributors
- **aspi6246** acknowledged as contributor for inspiring v3.1 patterns

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.1)

---

## v3.0: v3.0 — Anti-Sycophancy + Intent Detection + Cross-Model Verification
**Published:** 2026-04-03

## What's New

Three batches of optimizations addressing structural AI limitations discovered through a 4-round dialectic experiment where the DA conceded too quickly, the Socratic Mentor tried to converge prematurely, and the entire debate stayed locked in a frame the human set.

### Batch 1: Anti-Sycophancy + Intent Detection

- **Devil's Advocate Concession Threshold Protocol** (`deep-research` + `academic-paper-reviewer`): DA must score every rebuttal 1-5 before responding. Concession only at ≥4. No consecutive concessions. Concession rate tracking. Frame-lock detection after each checkpoint.
- **Attack Intensity Preservation** (`academic-paper-reviewer`): DA does not soften under pushback. Explicit deflection detection. Persistent pushback ≠ valid rebuttal.
- **Intent Detection Layer** (`deep-research` socratic): Classifies user intent as exploratory vs. goal-oriented. Exploratory mode disables auto-convergence, raises max rounds to 60, prohibits premature closure. Re-assesses every 5 turns.
- **Dialogue Health Indicator** (`deep-research` socratic): Silent self-check every 5 turns for persistent agreement, conflict avoidance, premature convergence. Auto-injects challenges when agreement pattern detected.

### Batch 2: Cross-Model Verification (Optional)

- **New `shared/cross_model_verification.md`**: Protocol for using GPT-5.4 Pro or Gemini 3.1 Pro as independent second reviewer
- Integrity verification: 30% sample cross-checked by second model (batched 5/call)
- DA agents: independent cross-model critique after each checkpoint
- Activated by `ARS_CROSS_MODEL` env var — zero overhead when not set
- Full setup guide with API patterns, cost estimates (~$0.60-1.10/pipeline), graceful degradation

### Batch 3: AI Self-Reflection

- **AI Self-Reflection Report** (`academic-pipeline` Stage 6): Post-pipeline self-assessment — DA concession rate, health alerts, sycophancy risk rating (LOW/MEDIUM/HIGH), frame-lock incidents, convergence patterns
- Includes irony caveat: the self-reflection is produced by the same AI it is assessing

### Why These Changes

> AI literacy isn't about learning to use AI as a tool, following ethics rules, or fearing AI risks. It's about engaging AI deeply enough to discover its structural limits yourself — and your own thinking limits in the process.

All changes reviewed via 3× parallel `/simplify` passes (reuse + quality + efficiency).

**Full Changelog**: https://github.com/Imbad0202/academic-research-skills/compare/v2.9...v3.0

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.0)

---

## v2.9: v2.9 — Style Calibration + Writing Quality Check
**Published:** 2026-03-27

## What's New

**Style Calibration** (academic-paper intake Step 10, optional)
- Provide 3+ past papers and the pipeline learns your writing voice (sentence rhythm, vocabulary preferences, citation integration style)
- Applied as a soft guide during drafting; discipline conventions always take priority
- Priority system: discipline norms (hard) > journal conventions (strong) > personal style (soft)
- Style Profile carried through pipeline via Material Passport (Schema 10)

**Writing Quality Check** (`academic-paper/references/writing_quality_check.md`)
- Writing quality checklist applied during draft self-review and final assembly
- 5 categories: high-frequency term warnings (25 terms), punctuation pattern control (em dash ≤3), throat-clearing opener detection, structural pattern warnings, sentence length variation checks
- Good writing rules, not detection evasion

**Versions**: academic-paper v2.5, deep-research v2.4, academic-pipeline v2.7

## Philosophy

> AI is your copilot, not the pilot. Unlike a humanizer, this tool doesn't help you hide the fact that you used AI. It helps you write better. The goal is quality, not cheating.

## Full Changelog
https://github.com/Imbad0202/academic-research-skills/compare/v2.8...v2.9

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v2.9)

---

## v2.8: v2.8 — SCR Loop Phase 1: State-Challenge-Reflect
**Published:** 2026-03-22

## SCR Loop Phase 1: State-Challenge-Reflect

- **Socratic Mentor Agent** (deep-research + academic-paper): SCR (State-Challenge-Reflect) protocol integration
  - **Commitment Gates**: Collect user predictions before presenting evidence at each layer/chapter transition
  - **Certainty-Triggered Contradiction**: Detect high-confidence language ("obviously", "clearly") and introduce counterpoints
  - **Adaptive Intensity**: Track commitment accuracy, dynamically adjust challenge frequency
  - **Self-Calibration Signal (S5)**: New convergence signal tracking user's self-calibration growth across dialogue
  - **SCR Switch**: Users can say "skip the predictions" to disable or "turn predictions back on" to re-enable mid-dialogue
- `deep-research/references/socratic_questioning_framework.md`: SCR Overlay Protocol mapping SCR phases to Socratic functions
- Added `CHANGELOG.md`

[View on GitHub](https://github.com/Imbad0202/academic-research-skills/releases/tag/v2.8)

---

