---
name: searching-thoroughly
description: Use for any search that must not miss things — finding code/files/symbols, prior art, docs, or researching a topic where one keyword and a quick read is not good enough. Runs an explicit three-round protocol (cast wide → close gaps → verify & saturate) with parallel searches inside each round and a mandatory synthesis gate between them. Triggers - "find everything", "is there anything that", "thoroughly search", "make sure nothing's missed", "research deeply", "where could X be", or any locate-task where a false "not found" is costly.
---

# Searching Thoroughly

A step-gated protocol for searches that have to be complete. It exists because the default failure is mechanical: one keyword → one read → "not found" → wrong. This skill removes the option to stop early by making the rounds and the gates explicit.

**This skill is a checklist. Create one TodoWrite item per numbered step below and work them in order. Do not skip a gate.**

## The two rules under everything

1. **Recall before precision.** Generate candidates wide and cheap *first*; rank and read *second*. You cannot read your way to a result that never entered the candidate set — the first round sets a ceiling nothing later can raise.
2. **Search the source's words, not yours.** `car` vs `automobile`, "kit" vs "bundle", "auth" vs "JWT middleware". A single guessed term silently misses on vocabulary mismatch. Expanding terms before searching is mandatory, not optional.

## Round structure

```
Round 1: Cast Wide      ──┐  parallel searches, different angles
   ↓ GATE: synthesize     │  → candidate set + harvested vocabulary
Round 2: Close Gaps     ──┤  parallel searches, reformulated from Round 1
   ↓ GATE: synthesize     │  → filled gaps + new candidates
Round 3: Verify & Saturate┘  confirm hits, prove the negatives, re-run until dry
   ↓ GATE: saturation met
Result
```
**Parallel within a round. Sequential (with a synthesis gate) between rounds.**

## Step-by-step

### 1. Split the need
One request often hides several needs. List them separately; each runs the protocol on its own.
```
"docker sandboxes and making kits for writing tasks"
  → N1 = docker sandboxes
  → N2 = writing kits
```

### 2. Reduce + expand each need
Tokenize → drop stopwords → stem. Then expand: synonyms, the words the source likely uses, and sharpeners your tool exposes.
```
sandbox → container, isolation, jail, vm, gvisor, firecracker, rootless, seccomp
kit     → bundle, skill, template, scaffold, starter, generator
sharpeners → exact phrase "..." · exclude -term · scope site:/path/filetype: · recency · intent
```
**GATE 2 — do not proceed until** you have ≥5 expansion terms per need. Can't think of the source's word? That's the reason to expand, not to skip.

### 3. Round 1 — Cast Wide (parallel)
Fire 3-5 searches at once from different angles. Over-generate on purpose. Same move in whatever idiom your tool speaks:
```
"docker sandbox isolation"  "gvisor vs firecracker"  "rootless container security 2025"
grep -rilE "docker|sandbox|gvisor|firecracker|rootless|seccomp|container.?isolat" <scope>
glob "**/*{docker,sandbox,container,isolation}*"
```
Never a lone keyword — one alternation or one fan-out.

### 4. GATE — Synthesize Round 1 (mandatory, write it down)
Before any more searching, answer in the open:
- **New vocabulary surfaced?** (terms/authors/paths/symbols you didn't have)
- **What's confirmed?** (candidates worth keeping)
- **What's still missing?** (named gaps)
Reformulate the next round's queries from the new vocabulary. If you cannot name a gap, you have not searched wide enough — widen and re-run Round 1.

### 5. Round 2 — Close Gaps (parallel)
Launch 3-5 new searches, each aimed at a specific gap from Gate 4, using the harvested vocabulary. Follow what Round 1 gave you — a found hit's citations/links, a found file's imports/symbols — into queries the first round couldn't reach.

### 6. GATE — Synthesize Round 2
Same three questions. Rank the full candidate set now by relevance to the **original need** plus trust signal (authority / recency / canonical location):
```
[high] direct hit + authoritative/recent/canonical   → read
[med ] adjacent / supporting / dated but useful       → skim
[low ] shares a word, wrong intent or stale           → drop
```

### 7. Round 3 — Verify & Saturate
- **Verify** the high band: read/cross-reference; one source confirming your hope is not confirmation.
- **Prove the negatives:** for each "doesn't exist" claim, show the wide query that justifies it — a negative is only valid if recall was wide.
- **Saturate:** re-run a reformulated round. If it surfaces something new, you are not done — loop back to step 5.

### 8. GATE — Stop condition
The universal stop is **saturation**: a fresh, reformulated wide round surfaces **nothing new**. Until that holds, you are not done — returning *something* in round 1 is not a stop condition, it's the trap.

Then confirm according to what you found:
- **A located thing** (where X lives, whether Y exists) — proven by coverage: the wide round that found it plus the wide round that found nothing else. No second source to consult; the saturated search *is* the proof.
- **A claim or fact** (X causes Y, version Z added W) — needs a second **independent** source. One source agreeing with your hope is not confirmation.

## Worked example — need: "where is rate limiting enforced in this service?"
The obvious word fails — code rarely says "rate limit," it says `throttle`, `tokenBucket`, `429` — so the search has to recover the real term before it can find anything.
```
R1  expand → {rate limit, throttle, quota, token bucket, 429, retry-after}
    naive "rate limit" alone → 0 hits            ← vocabulary mismatch, live
    wide  → grep -rilE "throttl|quota|token.?bucket|429|retry.after" src/
            (peer angle) "express rate limit middleware pattern"
  ─ GATE: harvested {TokenBucket, X-RateLimit, app.use(}   ← terms a found file handed you = round-2 fuel
          confirmed: src/middleware/throttle.ts
          missing:   applied globally, or per-route?
R2  gaps → grep -rn "throttle(" src/routes/  ·  grep -rn "X-RateLimit" src/
  ─ GATE: confirmed global app.use + 2 per-route overrides
          rank: throttle.ts [high] · route decorators [high] · throttle.bak stale [low→drop]
R3  verify → cross-check registration against throttle.test.ts   ← one file isn't proof
    prove the negative → "websocket routes have none": grep across ws/ handlers = 0, and the grep was wide
    saturate → reformulated round surfaces nothing new → STOP
```

## Red flags — you are about to break the protocol

| Thought | Reality |
|---|---|
| "One search was enough" | One round rarely reaches it. Synthesize, run the next. |
| "Nothing came back, so it doesn't exist" | Invalid negative — recall was too narrow. Widen, prove it. |
| "I'll read these 10 files to check" | That's N reads where one wide parallel pass belongs. |
| "Found one, good enough" | You skipped saturation. One hit ≠ the set. |
| "I'll narrow down first" | Backwards. Wide then narrow — narrowing first caps the ceiling. |
| "I'll skip the synthesis, I remember it" | The gate is written down on purpose. Write it. |

## In one line
**split → expand → wide round → SYNTHESIZE → gap round → SYNTHESIZE → verify & saturate → stop only when dry and confirmed.** The gates are the skill; the searches are just what happens between them.
