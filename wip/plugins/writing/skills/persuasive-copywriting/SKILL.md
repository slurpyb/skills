---
name: persuasive-copywriting
description: |
  Write, audit, and analyze persuasive marketing copy using an evidence-based tactics
  library (framing, scarcity, social proof, CTAs, numeric framing), sentence craft
  (AIDCA structure, benefits-vs-features, power words, readability gates), and a
  linguistics-of-voice toolkit (stance/appraisal vocabulary, five-layer Voice DNA model,
  marker lexicons). Use when: (1) writing or improving landing pages, product
  descriptions, CTAs, emails, headlines, or ad copy; (2) auditing/critiquing copy —
  detecting buzzwords/AI-slop, weak framing, hedging, or poor readability and proposing
  fixes; (3) characterizing or reproducing a writer's voice; (4) researching a product's
  competitive landscape and adapting copy to win in it (pairs with firecrawl-shop).
  Triggers: "write copy", "make this more persuasive", "improve this CTA/headline",
  "critique this copy", "is this on-brand", "match this voice", "does this sound like AI".
---

# Persuasive Copywriting

A knowledge base distilled from Nick Kolenda's psychology tactics, Andy Maslen's
*Write to Sell* craft, a high-intent SEO playbook, and an academic linguistics-of-voice
toolkit. Every tactic is empirically grounded; cite the mechanism, not just the rule.

**Core stance:** benefits make the sale; features let the reader rationalize it.
Lead with what the product *does for the reader*, then supply the fact as proof.
The reader cares about WIIFM ("What's In It For Me?"), not about you.

## Pick the workflow

- **Writing or improving copy** → Workflow 1
- **Auditing / critiquing copy** (slop, hedging, readability) → Workflow 2
- **Analyzing or reproducing a voice** → Workflow 3

Reference files load on demand — open them when the workflow points you there.

| File | What it holds |
| --- | --- |
| `references/craft.md` | KFC planning, AIDCA, benefits-vs-features, power words, tone, punctuation, what works/doesn't, headlines, readability gate |
| `references/tactics.md` | 35 psychology tactics: framing (16), linguistics (7), CTAs (8), dates & numbers (4) |
| `references/seo-openings.md` | High-intent opening lines — TOFU vs BOFU, checklist, red flags |
| `references/stance-vocabulary.md` | 17 stance/appraisal concepts + the reproducible deconstruction procedure |
| `references/voice-dna.md` | Five-layer model for measuring & matching a writer's voice |
| `scripts/readability.py` | Flesch RE + FK grade + words/sentence + passive gate |
| `scripts/scan_markers.py` | Flags hedges, boosters, vague evidentials, buzzwords, AI-slop (uses `scripts/lexicons.json`) |
| `assets/aidca-template.md` | Fill-in AIDCA copy skeleton |
| `assets/audit-report-template.md` | Standard audit output format |

---

## Workflow 1 — Write persuasive copy

1. **Plan with KFC before writing a word.** What must the reader **K**now (facts that
   justify the buy), **F**eel (the emotional state where the decision is actually made —
   "worried they're missing out," "reassured we're trustworthy"), and **C**ommit to
   (the exact action)? The F is where the craft lives and where most copy fails. See
   `references/craft.md`.
2. **Know the landscape.** If the product competes in a market, research it first — the
   competitors, the category's conventions, and the *words real buyers use* in reviews.
   Use the `firecrawl-shop` skill to sweep the surrounding product landscape, then
   position against it (differentiate, pre-empt objections, mirror buyer language).
3. **Structure with AIDCA:** Attention (headline) → Interest (WIIFM, lead with benefit
   via the Feature→Advantage→Benefit ladder) → Desire (make them picture owning it;
   restrict supply) → Conviction (attributed testimonials, guarantees, specifics) →
   Action (a short, direct command). Use `assets/aidca-template.md`.
4. **Apply tactics deliberately** from `references/tactics.md` — choose the right
   scarcity type, frame numbers as digits, write CTA text that mirrors the reader's
   inner speech, etc. Each is a documented effect, not a style preference.
5. **For a page opening that must rank** (SEO/search traffic), follow
   `references/seo-openings.md`: classify intent, answer in the first sentence, and —
   critically — never explain the category to a bottom-of-funnel buyer who already knows it.
6. **Edit for craft** (`references/craft.md`): swap weak words for power words, kill
   nominalizations ("nounitis"), prefer Anglo-Saxon over Latinate, use "you", use
   contractions, full stops early and often.
7. **Gate it.** Run `python scripts/readability.py <file>` (target: Flesch ≥ 60,
   ~16 words/sentence) and `python scripts/scan_markers.py <file>` to catch buzzwords,
   hedging, and AI-slop before delivery. Revise until both pass.

**Avoid (Maslen's "what doesn't work"):** showy writing, jargon, talking about
yourself, boilerplate ("As a valued client…"), over-excitement ("exciting", "amazing",
"revolutionary" — *emoting, not evoking*), humour ("people don't buy from clowns"),
and judging copy by taste instead of likely efficacy. Be specific — specificity beats
scepticism: not "you'll save money" but "saves this office manager $3,250 a month."

## Workflow 2 — Audit & critique copy

1. **Run the scanners first** — they are fast and objective:
   - `python scripts/scan_markers.py <file>` → hedges (weak claims), boosters (hollow
     in bulk), vague evidentials ("studies show"), buzzwords/puffery, and the AI-slop
     detector bank (throat-clearing openers, "it is important to note", em-dash hedges,
     "not just X — it's Y", generic closes, copula avoidance, etc.).
   - `python scripts/readability.py <file>` → the pass/fail readability gate.
2. **Read for craft failures** the scanners can't see: feature-led copy that should be
   benefit-led, a missing or buried CTA, no clear "you", a headline ending in a full
   stop, an abstract subject where a person should be. Checklist in `references/craft.md`
   ("What works / what doesn't").
3. **Diagnose stance** for anything subtle (is the persuasion honest? where is authority
   smuggled in?) using `references/stance-vocabulary.md`.
4. **Report** using `assets/audit-report-template.md`: lead with the highest-leverage
   fixes, quote the offending span, give the rewrite. Density is the signal — one
   booster is fine, ten is a tell.

## Workflow 3 — Analyze or reproduce a voice

1. **Characterize the target voice** with the five-layer Voice DNA model
   (`references/voice-dna.md`): stylometric fingerprint → clause structure → discourse
   coherence → pragmatics/stance → register. Layers 3–4 are where voice becomes stance.
2. **Quantify the markers** by running `scripts/scan_markers.py` over a sample of the
   target's writing — its hedge/booster ratio, evidential habits, and buzzword density
   are a measurable profile to match (or to deliberately avoid).
3. **Deconstruct a representative paragraph** with the reproducible procedure in
   `references/stance-vocabulary.md` (segment → speech-act → marker scan → attitude →
   graduation → engagement), then run the two-pass agreement check so the profile is
   reproducible, not an opinion.
4. **Reproduce or adapt:** write new copy that hits the same layer-by-layer profile, or
   adapt existing copy toward it. To match a whole product *landscape* rather than one
   author, pull the surrounding corpus with `firecrawl-shop` and profile that.

## Compose with firecrawl-shop

`firecrawl-shop` researches a product across the web — competitors, comparisons,
reviews, the full surrounding landscape. Use it as the **research front-end** to this
skill: it supplies the market context and real buyer language; this skill turns that
into persuasive, landscape-aware, on-voice copy (Workflows 1 and 3).
