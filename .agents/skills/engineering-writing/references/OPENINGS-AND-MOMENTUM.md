# Openings and Momentum

How to start a piece, and how to keep someone reading past the first paragraph. Every pattern here is confirmed against real, working engineering writing, not invented.

## Pick one opening, on purpose

Don't default to the same opening every time. Match the pattern to what you actually have.

**Cold scene, no preamble.** Drop the reader into a concrete moment before any explanation. One well-known post opens: _"It was a late evening. My colleague has just checked in the code that they've been writing all week."_ A company engineering blog opens the same way: _"At 2 a.m. on a Tuesday, an on-call engineer's pager fires."_ Use this when you have a real incident or a real before/after story to tell, and the story itself is the argument.

**The concrete problem, stated flat.** _"I haven't used a desktop email client in years. None of them could handle the volume of email I get without at least occasionally corrupting my mailbox."_ No throat-clearing, no "in this post we'll explore," just the fact. Use this when the problem itself is surprising enough to carry the opening on its own.

**Disarming confession.** _"People often assume that I know far more than I actually do."_ Or: _"So, I'll be honest. I had been working professionally with React for years without really understanding how React's re-rendering process worked."_ Use this when the whole post exists to correct a misconception you yourself used to hold, it earns trust before you've made a single technical claim.

**Flat declarative, undercut immediately.** One plain, almost boring statement, own paragraph, then a caveat that complicates it in the very next line. Works when the honest answer to "did this work" is a real "mostly, but," and you want the reader to trust the nuance rather than the headline.

**Start small, let the essay widen.** Describe one specific feature or feeling before the piece expands into the larger point. Fits a shorter, more reflective piece where the small detail is doing real work, not a technical deep-dive that needs to earn a wide claim with evidence.

**Rhetorical question over a concrete artifact.** _"What's wrong with this test?"_ followed immediately by a code block. Or open by naming exactly what you're about to explain and admitting it might already be familiar: _"You might already know about this, but some people don't, and I was surprised when I learned it a few years back!"_ Use this when you have one crisp, checkable example that makes the abstract problem real in one glance.

**Myth, stated in the reader's own voice, then dismantled.** _"Let's retire the 'virtual DOM is fast' myth once and for all. If you've used JavaScript frameworks in the last few years, you've probably heard the phrase..."_ State the wrong belief exactly as the reader currently holds it, don't strawman it, then take it apart piece by piece. This only works if you actually deliver a more precise correct claim by the end, not just a flattened opposite.

**Reframe the vocabulary.** Cloud computing becomes _"renting computers."_ One reframed phrase does more work than a paragraph of argument, because it exposes the hidden assumption the industry's own euphemism was hiding. Use this when the real fight is about what to call something, not about the underlying facts.

**Credentials, then the grenade.** _"I was at one company for about six and a half years, and now I've been at the next one that long."_ Then, a paragraph later, the outrageous claim. Establish standing to judge before you judge. Works when your argument needs earned authority to land, not when you're writing about something you just learned.

**TL;DR up front.** _"TL;DR: I have founded a new company..."_ the verdict before the reasoning, so a busy reader gets the outcome even if they never read past line one. Use this for announcements specifically, where the reader's first question is "what actually happened," not "convince me to care."

**Tension.** State the gap between what people assume and what's actually true, before resolving it. _"Everyone assumes caching fixes this. It doesn't, and here's why."_ This is the core mechanism behind why marketing writing works at all, named plainly: naming and resolving a real tension. It only works honestly if the tension is real, not manufactured.

**Two-sentence tradeoff.** _"Building on a canvas unlocks performance that a traditional HTML web app can't touch. It also strips away any accessibility the browser gives you for free."_ Gift and cost, back to back, in the first two sentences. The whole rest of the post can just be resolving that tension.

**Raw enthusiasm, no throat-clearing.** For a release you're genuinely excited about, the honest emotional reaction can be the entire first line, not a fact you'll get to eventually. Earns its place only when the excitement is real and gets backed with specifics immediately after, otherwise it reads as hype.

## What never earns an opening

"In this post, we'll explore..." "Let's dive in." Any sentence whose entire job is to announce that the real content is coming later. If you wrote one of these, delete it and look at what's actually in the next sentence, that's your real opening.

## Momentum: what keeps someone reading past paragraph one

**The slippery slide.** The classic copywriting mechanic, and it's universal, not sales-specific: the only job of any sentence is to get the next one read. Every paragraph should end with a reason to keep going, not a period that reads like a stopping point.

**Seeds of curiosity.** Short forward-pulling lines at the end of a section: "But that's not the real problem." "Here's where it gets interesting." Use sparingly, once every few sections, not every paragraph, or it starts to feel like clickbait instead of momentum.

**Steelman before you correct.** State the wrong intuition precisely and fairly before showing what's actually true. The reader who used to believe the wrong thing feels understood, not condescended to, which keeps them reading the correction instead of getting defensive.

**Iterative reveal over dump-everything-at-once.** Build one running code example, mutating it step by step, each fix a direct rebuttal to the previous version's flaw. Or narrate a diagram evolving frame by frame instead of presenting the finished version. Readers stay with a problem that unfolds; they skim a problem that's fully pre-solved on arrival.

**Gold coins along the path.** A writing-craft term for it: reward the reader periodically with a good detail, a joke, a small payoff, spaced through a long piece, so a 2000-word post doesn't feel like a slog even though it's long.

**Name the thing.** Coining a short, memorable label for a nuanced idea, "the slippery slide," "the curse of knowledge," "AHA programming", is itself a momentum technique: once the reader has the name, they want to see you use it, which pulls them through the rest of the piece looking for it. One well-known technique pairs a vivid homemade analogy (an abstract system stands in as a fictional car service) with a short, quotable maxim at the end, "all non-trivial abstractions, to some degree, are leaky", so the reader remembers the name long after they've forgotten the analogy that built it.

**Labeled sections, borrowed authority, one takeaway each.** For a long, evidence-heavy piece: break the argument into named sub-sections, bring in a named outside framework or practitioner to back a claim instead of just asserting it, and close every section with its one-sentence takeaway before moving on, so a reader skimming a long piece still gets the argument.

**One sustained metaphor as the structural spine.** Rather than scattering separate analogies through a piece, pick a single governing metaphor and build the entire structure around it, each section a different facet of the same comparison. Done well, it holds a long, otherwise abstract piece together better than headings alone.

## Closing

End with the one thing the reader should do or remember, not a summary of everything you already said. A working link, a command to run, a repo to read, or the single sentence you'd want quoted if this post got shared once and never read in full.

**Advanced option: let the form make the point.** If a piece's structure itself demonstrates its argument (each heading answers its own question before you read the section, say), it's fair game to point that out in the closing line. Use this rarely, once discovered it can't be reused as a trick without feeling gimmicky.
