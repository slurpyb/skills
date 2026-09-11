# Stance / Appraisal Vocabulary + Deconstruction Procedure

A domain-neutral controlled vocabulary for **labelling** persuasive prose — the analytic
side of the tactics. Use it to audit *how* a text persuades (and where authority is
smuggled in), and to profile a voice. Grounded in Appraisal (Martin & White 2005),
metadiscourse (Hyland 2005), and speech-act theory (Searle 1976).

The point is not "the one true parse." It's **operational neutrality**: a closed label
set + an explicit procedure → agreement you can *measure*. A span can carry labels from
several sub-systems at once — tag all that apply.

## The 17 concepts, by sub-system

**Attitude — evaluation of feelings, people, things**
- `affect` — emotion ascribed to a participant ("customers *love* it").
- `judgement` — evaluation of human behaviour/character against social norms ("a *brilliant engineer*", "*rightful* owner").
- `appreciation` — evaluation of things/processes/outputs ("a *brilliant strategy*", "*good* fortune").
  - *Test (the key disambiguator):* what is appraised? a feeling → affect; a person's conduct → judgement; a thing/output → appreciation.

**Graduation — scaling strength/sharpness of evaluation**
- `force` — raise/lower intensity or quantity ("*extremely*", "*countless*", "*somewhat*").
- `focus` — sharpen/soften a category boundary ("*a real* leader", "*kind of*").

**Engagement — how the text positions itself among other voices**
- `entertain` — open dialogic space; one possibility among others ("*perhaps*", "*may*"). *Expands.*
- `attribute` — source a position in an external voice ("*considered*", "experts *say*").
- `proclaim` — contract space by affirming/endorsing ("*of course*", "*make no mistake*", "data *proves*"). *Contracts.*
- `disclaim` — contract space by denying/countering ("*never*", "no…"). *Contracts.*

**Epistemic stance — the writer's commitment to a claim**
- `hedge` — qualified, tentative commitment ("*might*", "*roughly*", "*I think*").
- `booster` — amplified, certain commitment ("*clearly*", "*must*", "*prove*").
- `vague-evidential` — authority gestured at without an accountable source ("*studies show*", "*universally acknowledged*"). The dishonesty tell.

**Speech-act force — what the utterance *does*** (assign exactly one primary force per clause)
- `assertive` — commits the writer to a proposition's truth (declaratives default here).
- `directive` — tries to get the reader to act (imperatives; a CTA is a directive).
- `commissive` — commits the writer to future action (brand promises, guarantees).
- `expressive` — expresses a psychological state ("we're thrilled to…").

**Presupposition — backgrounded position-taking (cross-link)**
- `presupposition-trigger` — content smuggled in as already-settled (definite reference "*this* truth"; factives; "*finally*", "*even*", "*again*"; possessives).

## Double-coding rules (apply these — they're where audits go wrong)
- A **booster** usually also **proclaims**; a **hedge** usually also **entertains**. Tag both.
- The endorse sense of proclaim ("data proves") shades into **assertive** force.
- A number/intensifier is **graduation**; a CTA is a **directive**, often softened by a **commissive** guarantee.

## Deconstruction procedure (reproducible annotation)
Run this to label a paragraph's stance, then check it's reproducible.

1. **Segment.** Split into clauses, number c1, c2, … so spans have stable addresses.
2. **Mark the clause-level speech act.** One primary force per clause (declarative→assertive, imperative→directive, promise→commissive). Note implied secondary force.
3. **Scan for markers (mechanical pass).** Sweep each clause — certainty→booster, tentativeness→hedge, unnamed authority→vague-evidential, evaluative adjective→an Attitude concept, explicit speech-act verb→its concept, factive/"finally"/"even"/"again"→presupposition-trigger. (`scripts/scan_markers.py` automates most of this.)
4. **Classify Attitude** by *what is appraised* (affect / judgement / appreciation).
5. **Classify Graduation** — force (on a scale) vs focus (category membership); record direction.
6. **Classify Engagement** — entertain / attribute / proclaim / disclaim; apply double-coding.
7. **Resolve and record.** Write each span once with the *set* of concept ids it carries; don't drop a layer because another covers the span.

## Check your work — two-pass agreement
A single pass is an opinion; reproducibility is the bar.
1. Two independent passes (two annotators, or two blind model runs), each a span→id table.
2. Align spans; two passes agree on a span when they assign the **same set** of ids (order-independent). A span one pass missed counts as a disagreement.
3. `percent agreement = (spans labelled identically) / (total distinct spans either labelled) × 100`.
4. Triage each mismatch against the relevant scope note — most are a *layering* miss (tag both), an Attitude sub-system call (use the "what is appraised?" test), or a span-boundary difference.
5. Aim for **≥80%** on the concept set before trusting the annotation; expect high agreement on speech-act force, lower on fine Attitude axes (treat those as lower-confidence).

## Worked example (the irony lives in the stacking)
*Pride and Prejudice* opening — "It is a truth universally acknowledged, that a single
man in possession of a good fortune must be in want of a wife."
- "It is a truth" → `assertive` + `booster`.
- "universally acknowledged" → `vague-evidential` + `attribute` + `proclaim` (a bald assertion dressed as universal consensus).
- "must" → `booster` + `proclaim` (high epistemic modality).
- "good fortune" → `appreciation`; "in possession of…" → `presupposition-trigger`.

The persuasive force is entirely in the stance layer, not the propositional content —
which is exactly what an audit surfaces.
