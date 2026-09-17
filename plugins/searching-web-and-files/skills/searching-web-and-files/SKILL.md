---
name: searching-web-and-files
description: Runs wide parallel discovery, written synthesis gates, gap-driven deeper rounds, verification, and saturation across web and local sources. Use when a task requires finding information across the web, documentation, repositories, code, or local files—especially when vocabulary is uncertain, one search may miss results, multiple sources must be synthesized, or a defensible “not found” conclusion is required.
---

# Searching Web and Files

Search is a learning loop, not a lookup. Each round changes the next round.

## Workflow

1. **Define the need and surfaces.** Split compound questions. Name what must be found, the acceptable source types, recency constraints, and the cost of a false negative. **Complete when:** every independent need and allowed search surface is explicit.
2. **Choose depth.** Select lookup for one low-risk fact, research for two synthesis-gated rounds, or exhaustive for three or more rounds plus saturation. **Complete when:** the mode matches the cost of missing or misreporting an answer.
3. **Expand vocabulary before searching.** Generate source-native synonyms, related entities, authors, symbols, file patterns, exact phrases, and exclusions. **Complete when:** each need has several materially different search formulations.
4. **Round 1 — cast wide.** Run 3–5 independent searches in parallel. Vary angle, terminology, source, and retrieval method. Collect candidates before reading deeply. **Complete when:** the batch covers independent routes into the need.
5. **Synthesis gate.** Write down confirmed findings, new vocabulary, contradictions, source-quality issues, and named gaps. The next round must come from this synthesis. **Complete when:** each next query maps to a named gap or discovered lead.
6. **Round 2+ — close gaps.** Run another 3–5 parallel searches targeted at the gaps, citations, imports, symbols, authors, and terminology surfaced by the previous round. Narrow only after recall is broad. **Complete when:** the named gaps are answered, disproved, or explicitly carried forward.
7. **Verify and saturate.** Read primary sources or exact files, cross-check consequential claims independently, and run one reformulated search. A negative result is defensible only after a wide search returns dry. **Complete when:** verification passes and a fresh round adds nothing material.
8. **Report provenance.** Separate fact, inference, and recommendation. Cite URLs or `file:line` evidence. State coverage, unresolved gaps, and why the search stopped. **Complete when:** every consequential claim is traceable and every limitation is visible.

## Completion criterion

Finish when the requested facts are supported, contradictions are resolved or exposed, every named gap is answered or declared, and a fresh reformulated round adds nothing material. Returning one plausible hit is not completion.

## Branches

- For exact round templates, query expansion, source selection, and stop rules, read [`references/strategy.md`](references/strategy.md).
- To choose among the bundled methods, search engines, crawlers, code/file tools, RAG systems, and specialized research packs, read [`references/catalog.md`](references/catalog.md).
- Machine-readable provenance and the wider candidate pool live in [`../../inventory/`](../../inventory/).
