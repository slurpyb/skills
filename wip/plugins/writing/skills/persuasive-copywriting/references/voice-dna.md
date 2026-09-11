# Voice DNA — A Five-Layer Model for Measuring & Matching Voice

The question: what are the **nameable, measurable parts of a writing voice?** Treat a
paragraph the way a structured-extraction system treats source material — parse it into
named components and turn it into rows of data. Drawn from the *traditional* literature
(linguistics, rhetoric, stylistics, stylometry, ghostwriting/copywriting craft), not
LLM research.

The bottom layer is unconscious and content-independent (the authorial fingerprint); the
upper four are conscious design choices, from the clause up to the register.

| Layer | What it captures | Tradition |
| --- | --- | --- |
| **0 — Stylometric signature** | The unconscious idiolect: stable micro-features that fingerprint *who* wrote a text | Stylometry / forensic authorship attribution |
| **1 — Clause structure** | Process types, participants, mood, modality, appraisal | Systemic Functional Linguistics (Halliday) |
| **2 — Discourse coherence** | How adjacent sentences/paragraphs connect into coherent text | RST / Hobbs / SDRT / PDTB / Centering |
| **3 — Pragmatics & stance** | Speech acts, presupposition, implicature, deixis — taking a position | Pragmatics |
| **4 — Register & concealed voice** | What separates stance-minimised from stance-explicit writing — and how "neutral" prose still sells | Register analysis / plain-language tradition |

Layers 0–2 are the *structural* machinery; Layers 3–4 are where voice becomes **stance**
— and where the claim "there is no truly stance-free text" becomes testable.

## How to use it to characterize a voice
Profile a target's sample writing layer by layer:
- **Layer 0 — fingerprint.** Stable, unconscious micro-features: function-word rates, punctuation habits, sentence-length distribution, contraction use, average word length. These resist conscious imitation and identify the author. Quantify with simple counts.
- **Layer 1 — clause.** What kinds of processes (actions vs states vs relations)? Who are the participants ("we", "you", abstract nouns)? Mood (declarative/imperative/interrogative mix), modality (lots of "must/will" vs "might/could"), and inscribed appraisal.
- **Layer 2 — discourse.** How do sentences join — additive lists, causal chains, concession, contrast? Tight logical scaffolding vs associative drift is a voice signature.
- **Layer 3 — pragmatics & stance.** Speech-act mix, presupposition habits, what's implied vs stated, deixis ("here/now/you"). Use `references/stance-vocabulary.md` and the deconstruction procedure.
- **Layer 4 — register & concealed voice.** Formality, field-specific lexis, and *how stance hides inside apparently neutral description* — the "no voice" that is still a voice (brand-positive prosody smuggled in as fact).

## Quantify the markers
Run `scripts/scan_markers.py` over a representative sample of the target writing. The
**hedge:booster ratio**, the rate of **vague evidentials**, and **brand-prosody/buzzword
density** are a measurable profile — the operational implementation of Layers 3–4. To
*match* a voice, hit the same profile; to *avoid* sounding like it (or like generic AI),
move the profile the other way and clear the prose-audit detectors.

## Matching a landscape, not just an author
To adapt copy to a whole product *landscape* rather than one writer, assemble the
surrounding corpus first (competitor pages, reviews, category copy) — pull it with the
`firecrawl-shop` skill — then profile *that* corpus with the same five layers and the
scanner. The result is copy that fits the category's conventions and the language real
buyers use, while still differentiating.

## Reproducibility
A voice profile is only trustworthy if a second pass reproduces it. Apply the same
two-pass agreement check from `references/stance-vocabulary.md` to the stance layers, and
prefer the coarse, reliable features (Layer 0 counts, speech-act force, hedge/booster
ratio) over fine judgments when confidence matters.
