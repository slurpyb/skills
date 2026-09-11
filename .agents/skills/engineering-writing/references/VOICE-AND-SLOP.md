# Voice and Slop

The sentence-level rules. Read this before you write a word, and run the checklist before you ship. Grounded in this repo's own established tone of voice (Panda's `TONE_OF_VOICE.md`), Strunk's _Elements of Style_, Zinsser's _On Writing Well_, Pinker's _The Sense of Style_, and confirmed against how real, well-regarded engineering writing actually reads.

## The one-sentence version

Write like you're explaining it to one sharp person, out loud, with no time to waste.

## The five things this reference exists to kill

**Em dashes.** One thought per sentence. A period beats a dash almost every time; when you want a pause, use a comma, a colon, or just start a new sentence. If you catch yourself reaching for "—", stop and ask what you're actually trying to say, then say that instead.

**Emoji as decoration.** A single purposeful one, rarely, is fine. Rows of them dressing up every bullet or heading are not. If you'd cut it from a printed page, cut it here too.

**Hype words.** Powerful, seamless, robust, blazing-fast, cutting-edge, effortless, unlock, elevate, leverage, delve, supercharge, next-level, game-changing, revolutionary, groundbreaking. Hopkins called this exactly right a hundred years ago: _"Platitudes and generalities roll off the human understanding like water from a duck. They leave no impression whatever."_ Worse, a superlative without a number behind it signals you didn't test the claim, which makes a technical reader trust the rest of the piece less, not more. Delete the adjective or replace it with the fact behind it: not "blazing-fast," but "40ms p99, down from 400ms."

**AI-tell constructions.** These specifically read as machine-generated to anyone who's read enough of it: "It's not just X, it's Y." "Whether you're a beginner or an expert." "In today's fast-paced world of X." "Let's dive in." Any sentence structured as a list of exactly three adjectives or exactly three examples, every time, for no reason (rule of three used mechanically instead of when it's actually the right count). Closing a piece with "In conclusion" or a summary paragraph that just restates what you already said. Reaching for "boundaries," "landscape," "realm," "tapestry," or "testament to." These are almost never the right word for a technical fact.

**Filler openers, padding transitions, and over-hedging.** "In today's...", "When it comes to...", "It's important to note that...", "Let's dive in", all throat-clearing, cut them, the point should be the first sentence. "Additionally," "Moreover," "Furthermore," "That said," used to connect two ideas that don't actually need connecting, cut them, or replace with the one word that actually shows the relationship (because, so, but). "Arguably," "in many cases," "generally speaking" when you could just state the thing, state the thing.

## The principles behind the rules

**Write to one person.** Second person, "you." Talk to the reader like a colleague standing next to you, not a crowd or a brand issuing a press release.

**Write like you talk.** A simple test, worth using literally: read the sentence back and ask, is this how I'd say it to a friend? If not, rewrite it. Contractions are fine. Formal language is what happens when people stop thinking about the reader and start performing for one.

**Omit needless words.** Strunk's rule, stated once and never improved on: _"A sentence should contain no unnecessary words, a paragraph no unnecessary sentences, for the same reason that a drawing should have no unnecessary lines and a machine no unnecessary parts."_ His own cuts, verbatim: "the question as to whether" becomes "whether." "He is a man who" becomes "he." Apply the same test to your own draft, on the second pass, not the first, cutting is editing, not drafting.

**Fight the curse of knowledge.** Pinker's diagnosis of nearly all bad technical writing: _"The better you know something, the less you remember about how hard it was to learn."_ You already know why the thing you're explaining matters. Your reader doesn't, yet. Every technical term you use without a plain-English gloss the first time costs you readers who would otherwise have stayed. Pinker's own math on this is worth remembering: _"A writer who explains technical terms can multiply her readership a thousandfold at the cost of a handful of characters."_

**Be specific, always.** Names, numbers, exact commands, real examples. This is the single rule that shows up independently across every source researched for this skill, Strunk's "definite, specific, concrete language," Hopkins's entire theory of advertising, Ogilvy's "fact density," plain reframes over vague ones. A vague claim ("significantly faster") is worth nothing next to a specific one ("3.2x faster on the p99, measured across 40M requests"). If you can't make a claim specific, that's a sign you haven't actually verified it yet, go find the number before you publish.

**Lead with the point.** The first sentence is the point, not a runway to the point. Zinsser's science-writing method applies directly here: state the one fact the reader needs first, then widen out to significance and implication, never the other way around.

**Every sentence earns the next one.** Sugarman's "slippery slide": the only job of the first sentence is to get the second one read. Every following sentence has the same job. If a sentence doesn't pull the reader forward, either cut it or fix it. This is the actual mechanism behind "keep them moving," not a metaphor.

**Show, don't sell.** A code block, a real before/after, a concrete number beats any adjective. If you're tempted to describe something as impressive, show the thing that makes it impressive and let the reader conclude that themselves.

**Be honest about what's rough.** Say what's unfinished, experimental, or still being figured out, plainly. Candor reads as more credible than polish, and it's true, the announcement posts that do this explicitly read as trustworthy rather than promotional precisely because of it.

**Undersell the frame, oversupply the number.** Pairing a deliberately modest description ("it's a small thing, but") with a hard, specific magnitude right after is more convincing than either alone, the modesty signals you're not spinning it, the number proves it was worth mentioning anyway.

**Humor, if any, targets a specific shared frustration.** A joke about a real, exact annoyance the reader has personally hit lands as camaraderie. A generic joke or a broad quip lands as filler. If you're not sure a joke is specific enough, cut it, an unfunny generic joke costs more credibility than it's worth.

## Before / after

- Hype: _"Our new engine unlocks blazing-fast, seamless performance across the board."_
  Specific: _"The new engine cuts p99 build time from 4.1s to 0.3s on a 500-file project."_
- Filler: _"It's worth noting that, in many cases, you may want to consider pinning your version."_
  Direct: _"Want reproducible installs? Pin an exact version."_
- Dash pile-up: _"The bug was subtle — it only showed up under load — and took three days to track down."_
  One thought at a time: _"The bug was subtle. It only showed up under load. It took three days to track down."_
- AI-tell: _"This isn't just a performance improvement, it's a fundamental rethinking of how the compiler works."_
  Plain: _"The compiler's hot path is rewritten in Rust. One parse per file, no TypeScript program sitting in the middle."_

## Checklist before you ship

- Read it aloud. Did you wince anywhere?
- Is the first sentence the point?
- Any em dash? Replace it with a period or cut the aside entirely.
- Any hype word or AI-tell phrase from the lists above? Cut it or replace it with the fact behind it.
- Any claim without a specific number, name, or example behind it? Add the specific, or cut the claim.
- Any word you could delete without losing meaning? Delete it.
- Did you say what's still rough or unfinished, if anything is?
- Would a sharp engineer reading this at 11pm, tired, keep reading past the first paragraph?
