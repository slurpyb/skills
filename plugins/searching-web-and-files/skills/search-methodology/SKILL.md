---
name: search-methodology
description: Use BEFORE any search — locating code, files, symbols, docs, prior art, or researching a topic — whenever you need to find something and don't already know its exact location. Casts wide in parallel, learns from each round, and keeps iterating instead of grepping one guessed keyword and quitting. Triggers - "find X", "where is Y", "is there a Z", "search for", "look for", "research", "does this exist", or any task that starts by locating things.
---

# Search Methodology

Find what exists instead of concluding it doesn't after one narrow guess. The default failure is mechanical, not a matter of effort: search for one keyword you'd use, get nothing, stop. The corpus rarely uses your word, and one round rarely reaches the answer.

## The law you cannot violate

**Two stages: recall then precision. The recall stage sets a ceiling nothing downstream can raise.**

```
generate candidates (cheap, WIDE, parallel)  →  rank / select / read (expensive, NARROW)
```

You cannot rank, read, or refine your way to something that never entered the candidate set. A narrow first pass caps your ceiling at your first guess. **Cast wide first, narrow second — never the reverse.**

The most common way to break this is searching for the word *you* would use instead of the word the *source* uses — `car` vs `automobile`, "kit" vs "bundle", "auth" vs "JWT middleware". That mismatch silently returns nothing. Expanding your terms before you search is what prevents it, and it is the step that gets skipped.

## The loop — every stage, in order, and never just once

### 0. Split the need
One instruction often hides several. Separate them; search each on its own.
```
"docker sandboxes and making kits for writing tasks"
  → N1 = docker sandboxes
  → N2 = writing kits
```

### 1. Reduce to terms
Tokenize → drop stopwords → stem. Apply the same reduction your source applied to its content, or the two won't line up.
```
N1 → docker, sandbox
N2 → kit, writ(e/ing), task
```

### 2. Expand before searching — widen the net
For each term list synonyms, the words the source is likely to use instead, and the operators that sharpen a hit — whatever your tool exposes.
```
sandbox → container, isolation, jail, vm, gvisor, firecracker, rootless, seccomp
kit     → bundle, skill, template, scaffold, starter, generator
sharpeners → exact phrase "..."  ·  exclude -term  ·  scope site:/path/filetype:
             recency "2024 2025"  ·  intent "tutorial"/"production"/"example"
```
Can't think of the source's word? That's the reason to expand, not the reason to skip.

### 3. Recall — launch wide, cheap, in parallel
Fire several searches at once from different angles, not one term sequentially. Over-generate on purpose — filtering down is cheap, recovering a missed candidate is impossible. The same move in whatever idiom your tool speaks:
```
"docker sandbox isolation"   "gvisor vs firecracker sandbox"   "rootless container security 2025"
grep -rilE "docker|sandbox|gvisor|firecracker|rootless|seccomp|container.?isolat" <scope>
glob "**/*{docker,sandbox,container,isolation}*"   ·   list/query the index with the alternation, not one term
```
One alternation or one fan-out of parallel queries — never a lone keyword.

### 4. Precision — rank, then read only the top
Score candidates by relevance to the **original need**, not to the query string — and by whatever trust signal the surface carries (source authority, recency, where it sits). Read the high band, skim the middle, drop keyword-only matches with the wrong intent.
```
[high] direct hit + authoritative / recent / canonical path   → read
[med ] adjacent / supporting / dated but useful               → skim
[low ] shares a word, wrong intent or stale                   → drop
```

### 5. Matching mode — per need
```
exact / Boolean:  docker AND (sandbox OR isolation)   — strict, high-precision needs
best-match rank:  "kit for writing tasks" ~ score      — fuzzy, when the vocabulary is uncertain
```

### 6. Feedback — iterate until dry, don't stop at the first hit
The best query terms are sitting in the results you already have. After each round: what new terminology, sources, or authors surfaced? What's still missing? Harvest the new words — from a result's snippet and title, its citations and outbound links, or a found file's symbols and imports — reformulate, and relaunch another parallel round.
```
found: sandbox-sdk → surfaces {e2b, microvm, code-interpreter}
re-query those      → candidates the first pass could not reach
```
Switch tactics when a round stalls: different keywords, broaden or narrow scope, split the question, change tool or source. **Stop only when a fresh round adds nothing new and multiple sources agree** — not when the first round returns something.

## Validate before concluding
Cross-reference across sources, prefer recent and authoritative ones, and test anything executable. One source confirming your hope is not confirmation.

## Red flags — you are about to break the method

| Thought | What it means |
|---|---|
| "I'll grep the one word and see" | No expansion → vocabulary-mismatch miss. Expand and fan out first. |
| "Nothing came back, so it doesn't exist" | Recall was too narrow. Widen, reformulate, retry before concluding. |
| "I'll read these 10 files to check" | That's N reads where one wide parallel pass belongs. |
| "Found one, good enough" | You skipped feedback. One hit ≠ the set. Iterate until dry. |
| "Let me narrow it down first" | Backwards. Wide then narrow — narrowing first caps the ceiling. |
| "One search was enough" | One round rarely reaches it. Learn from the round, launch the next. |

## In one line
**split → reduce → expand → recall wide & parallel → rank precise → feedback until dry, then validate.** Everything else — vector search, agents, web tools, code intelligence — is a swappable engine bolted onto this skeleton. The skeleton is the method.
