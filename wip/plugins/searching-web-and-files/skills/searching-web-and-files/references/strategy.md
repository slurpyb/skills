# Search and research strategy

## Depth contract

| Mode | Use when | Minimum work | Stop |
|---|---|---|---|
| Lookup | Exact, low-risk fact or known location | One targeted query and one authoritative read | Fact verified |
| Research | Vocabulary or answer is uncertain | Two batches of 3–5 searches with a written synthesis gate | Gaps closed and claims cross-checked |
| Exhaustive | Missing an item is costly; user asks for all/deep/thorough | Cast-wide, gap-closing, and verification rounds; repeat saturation probe | Reformulated wide round adds nothing material |

Do not use exhaustive mode merely to create activity. Do not use lookup mode to make a broad negative claim.

## Round packet

Before each batch, record:

```markdown
### Round N
Goal:
Named gaps:
Queries and why they differ:
Sources/tools:
Expected stop signal:
```

After each batch, record:

```markdown
### Synthesis N
Confirmed:
New vocabulary/entities/symbols:
Contradictions:
Weak or missing evidence:
Next gaps:
Next queries derived from those gaps:
```

The synthesis is a gate. Do not launch the next batch until it changes the query plan.

## Query diversity

A useful batch varies independent dimensions instead of paraphrasing one query:

- **Vocabulary:** user terms, source-native synonyms, acronyms, predecessor names.
- **Angle:** definition, mechanism, implementation, comparison, failure, recency, criticism.
- **Source:** official docs, standards, source repositories, papers, registries, high-quality secondary sources.
- **Retrieval:** lexical search, semantic search, path/glob search, symbol/reference search, graph traversal, citation chasing.
- **Scope:** broad landscape, named gap, exact entity, date range, domain/path/file type.

## Web branch

1. Begin with landscape, terminology, and canonical-source queries.
2. Read the best primary sources, not only result snippets or AI summaries.
3. Chase citations and named authorities from strong sources.
4. Search disagreements, limitations, and counter-evidence deliberately.
5. Verify dates, versions, and whether separate pages repeat one underlying source.

Prefer primary sources in this order when applicable: specification or regulator; vendor documentation; source repository or registry; peer-reviewed paper; reputable secondary analysis; community discussion.

## Local file and code branch

1. Orient with directory, package, or project reports before guessing a file.
2. Search paths and identifiers broadly; include synonyms, symbols, imports, call sites, tests, and configuration.
3. Rank candidates, then read the smallest relevant enclosing symbols or files.
4. Follow references, imports, callers, tests, generated artifacts, and historical names.
5. Use `file:line` evidence. An outline or filename is not evidence of behavior.

For a negative claim, record the scopes, patterns, exclusions, and semantic/lexical variants searched.

## Parallelism

Parallelize independent queries inside a round. Keep rounds sequential because each synthesis determines the next batch. Give subagents non-overlapping facets and require source URLs or exact file evidence. Treat their results as claims until checked.

## Verification

- Consequential factual claims need an authoritative source or two independent sources.
- Executable examples need a test, type check, or direct inspection where practical.
- Preserve contradictions instead of averaging them away.
- Distinguish absence of evidence from evidence of absence.
- Count syndicated copies as one source when they derive from the same original.

## Saturation

A search is saturated when a deliberately reformulated batch—new terminology, source, and retrieval mode—adds no material candidates or facts. Stop earlier if the user’s bounded question is fully verified. Stop later if contradictions or high-cost gaps remain.

## Completion

Apply this reference until the selected depth contract, evidence rules, and saturation condition are all satisfied.
