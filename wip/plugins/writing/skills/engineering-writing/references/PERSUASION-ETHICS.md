# Persuasion, Honestly

Marketing and copywriting have spent a century studying what makes writing get read and remembered. Some of that is genuinely universal writing craft. Some of it is sales-specific manipulation that reads as exactly that to a technical audience trained to be skeptical of it. This reference draws the line explicitly, technique by technique, naming exactly which book or framework each one comes from, so you can use the first kind on purpose and never reach for the second.

## Borrow these

**Know your reader's awareness stage before you write a word.** Eugene Schwartz's core diagnostic: is the reader unaware they have this problem, aware of the problem but not the solution, aware solutions exist but not yours, aware of yours but undecided, or already sold and just needs the details? A post about a new caching layer needs a completely different opening for a reader who doesn't know they have a cache-invalidation problem than for one already comparing three solutions. Diagnose this before you draft the opening, not after.

**Write for the smallest viable audience.** Seth Godin's frame: a post that deeply serves the one engineer with the exact problem travels further, via word of mouth in that specific community, than a watered-down post trying to be relevant to everyone. Don't soften a post to be broadly applicable at the cost of being specifically useful to anyone.

**Be remarkable, or don't bother.** Godin's _Purple Cow_ test, applied as an editorial gate before you publish: does this say something a reader would actually remark on, or is it the same generic "we migrated to X and it's great" post everyone already wrote? If the honest answer is the latter, find the actual surprising finding and lead with that instead, or don't publish.

**Social proof, used honestly.** Robert Cialdini's _Influence_ names this as one of the strongest levers in his own research: "three other teams adopted this and cut latency 40%," when true and specific, is just evidence. The line is truth and specificity, not the technique itself.

**Authority, earned by showing your work.** Cialdini names authority as a lever too, but the honest version of it isn't asserted, it's earned: Ogilvy's fact density, and the habit some deep-dives have of showing the rejected alternatives, both do this, authority comes from demonstrated depth (real benchmarks, real design tradeoffs considered), not from credentials or confident-sounding words.

**Shared identity, used honestly.** Cialdini's newest addition to his own framework, unity, "if you've ever hit this bug, you're not alone" invokes real community, not a sales trick, as long as it's true.

**Practical value, stated up front.** Jonah Berger's _Contagious_ research on what actually gets shared: tell the reader early what they'll walk away able to do. This sets honest expectations rather than manufacturing suspense about the payoff.

**A narrative wrapper, when there's a real story.** A debugging journey, an incident, a before-and-after, makes technical content memorable in a way a list of facts doesn't. The story has to be real; it's the sequencing device, not the content.

**A simple structural skeleton.** Robert Bly's 4 Ps, Promise, Picture, Proof, Push, works honestly for a technical post: state the payoff up front, help the reader picture the outcome (a code sample, a benchmark), back it with evidence, then give a clear next action. His 3 Cs, clear, compelling, credible, is really just a restatement of good technical-writing values, credible especially, which is what a skeptical engineering reader actually rewards.

**Document the process, not just the finished result.** Austin Kleon's whole thesis in _Show Your Work!_: sharing how something was actually built, including the parts that didn't work, is what makes a deep-dive worth reading over a press release. His flow-versus-stock distinction is a useful editorial check too, a quick process note is fine as a one-off, but the pieces meant to hold up over years need to actually hold up, not just be timely.

**Name the category, if you're genuinely the one naming it.** A well-known move in career-and-industry essays: compress a real, emerging pattern into a short, memorable label, then justify why it's happening now. This only works honestly when the pattern is real and you're not inventing significance that isn't there yet.

**The reader as the hero, the post as the guide.** Donald Miller's StoryBrand framework, inverted from how it's meant to be used in sales: the reader's team has the problem (an outage, a scaling wall), the post offers a plan (the technical approach), the call to action is concrete (try this, here's the repo). Where this breaks down if used wrong: don't let the post's author become the all-knowing guide dispensing wisdom to a customer, that posture reads as marketing voice. Write as a peer who solved a problem, not a guru with a plan for you.

**Study the market, not the product.** Gary Halbert's foundational instinct, direct from the Boron Letters: understand what your reader actually wants before you write anything about what you built. A post explaining a feature nobody asked for, however well written, has no "starving crowd" behind it.

**Benefits, not features.** Halbert's version of Strunk's concreteness: describe what the reader gets to do differently, not a list of what changed internally. "You can now debug a failed deploy in one command" beats "added a new CLI subcommand."

**Reason-why.** Every claim needs an explicit justification or it isn't believable. If you're asserting something is better, faster, or safer, say why, mechanistically, not just that it is.

**Read it aloud before you ship it.** Halbert's actual training method for his own son: read your draft aloud and you'll verbally stumble over every place that isn't smooth. This is the same technique as a well-known essayist's own "friend test" and this repo's own tone-of-voice checklist, independently arrived at by a copywriter, an essayist, and a docs team. When three unrelated sources converge on the same rule, that's a signal, not a coincidence.

**Mirror the reader's own language back to them.** Adapted from Leil Lowndes's conversational rapport techniques: use the vocabulary the reader already uses for their problem (their error message, their term for the pain point) before introducing yours. This is Halbert's market-first instinct approached from the other direction.

## Leave these at the door

**Scarcity.** "Only a few spots left in the beta" is manufactured urgency built for closing a sale. It has no honest place in a technical post and reads as exactly what it is.

**Reciprocity as a deliberate play.** Giving something away specifically to trigger a sense of obligation is transactional. Giving real value away because it's genuinely useful, good open source, good docs, is not the same thing, keep the motive honest.

**Engineered liking, via charm or flattery.** Technical readers are trained to distrust overt likability tactics. Genuine voice and honesty about what's still rough reads better than charm.

**Chasing social currency directly.** Content that's engineered to make the sharer look smart or in-the-know is the mechanic behind clickbait and humblebragging. Good writing earns social currency as a side effect of being genuinely good; chasing it directly corrupts the writing.

**Status and superiority framing.** Positioning a reader as falling behind, or a competitor as behind, to create anxiety is FUD marketing, not engineering writing. This includes softer versions like implying the reader is missing out by not adopting something.

**Fear, urgency, and guilt as primary motivators.** Drew Whitman's "Life-Force 8" names these as the strongest biological triggers in direct-response sales precisely because they bypass a reader's critical judgment. That's the opposite of what respects a technical reader. Use efficiency, clarity, and being genuinely informed instead, these are real motivators for engineers and don't require manipulation.

**Amplified or exaggerated claims.** Schwartz's own model shows why this fails: as a market gets more sophisticated (more competing claims), the instinct is to escalate superlatives. That escalation is exactly what erodes credibility with a technical audience that's already skeptical of hype. Channel a maturing claim into more precision and better evidence, never into a bigger adjective.

**The guide-as-guru posture.** A company or author presenting itself as the wise, all-knowing solution-giver, rather than a peer who solved a real problem, reads as corporate marketing voice the moment a technical reader notices it.

**Anything physical or conversational with no written equivalent.** Lowndes's book is full of techniques, eye contact timing, posture, vocal warmth, that depend on physical presence and don't meaningfully transfer to a page. Don't force an analogy where none exists.

## The test, in one line

Before using any technique from this reference, ask: would this still be honest if the reader could see exactly why I wrote it this way? If yes, use it. If the technique only works because the reader doesn't notice it's a technique, it doesn't belong in engineering writing.
