# Registers

Three different occasions for engineering writing. Same voice throughout (see [VOICE-AND-SLOP.md](VOICE-AND-SLOP.md)), different shape, because they answer different questions for different readers. Figure out which one you're actually writing before you draft a word, the shape below only works if it matches the occasion.

## Announcement post

**Reader's real question:** should I still bet on this project, and what actually shipped.

**Shape, confirmed against real, well-regarded announcement posts:**

1. **Lead with the fact, not the buildup.** A TL;DR or a one-paragraph plain statement of what happened. _"TL;DR: I have founded a new company..."_ Not a story, not a scene, the actual news, first.
2. **Preempt the reader's biggest fear immediately.** Whatever the community will worry about first, licensing, breaking changes, whether this is still maintained, answer it in the first few sentences, not buried in an FAQ. A well-known founder-transition announcement answers "will this go closed-source" in sentence two.
3. **Establish standing before the vision.** A short, honest statement of the track record behind this, not credentialism, just enough that the vision in step 4 reads as earned rather than invented on the spot.
4. **Argue for a worldview, not a feature list.** The strongest announcement posts aren't lists of what's new, they're an argument, the release is the proof, not the point. State the belief the work is a bet on ("reactivity belongs in the language, not the library"), then let the feature list demonstrate it.
5. **Proof via named, shipped things.** Ground the vision in specific, verifiable artifacts, not promises. Naming the actual shipped projects is proof; "a unified toolchain" alone is vaporware language.
6. **Be candid about constraints or difficulty.** If something didn't work, or a tradeoff was forced, say so plainly. Real candor about a business model not scaling makes a pivot announcement more credible, not less.
7. **Close with what's next and a real next action.** A roadmap pointer, a migration guide link, a way to get involved, not a generic "stay tuned."

**Don't:** open with a feature list, bury the license/compatibility question past paragraph three, or write the vision section before you've earned it with track record.

## How-we-built-X deep-dive

**Reader's real question:** what was actually hard here, and what would I do differently if I hit the same problem.

**Shape, confirmed against real, well-regarded engineering deep-dives:**

1. **Open on the concrete problem, not the abstract topic.** Not "let's talk about distributed consensus," but the actual 2am page, the actual bug report, the actual number that looked wrong.
2. **Show why the obvious fix doesn't work, specifically.** Name the naive approach a reader would reach for first, then show exactly where it breaks, with a real example, not a hand-wave.
3. **Reveal the solution iteratively, not all at once.** One technique: build one running example, and let each fix directly rebut the previous version's specific flaw. Another: show the two or three alternative API designs you actually considered and rejected, and why, this single move builds more trust than presenting the final design as if it were obvious from the start.
4. **Use real numbers, not adjectives.** "75K requests/second, single-digit millisecond latencies" beats "fast and scalable" every time. If you don't have the number, that's a sign to go get it before publishing, not to reach for an adjective instead.
5. **Interactive or runnable beats static where you can manage it.** Draggable, editable demos do explanatory work prose alone can't, if a reader can manipulate the actual mechanism, they build the mental model faster than from any diagram.
6. **Say what's still unsolved.** The best deep-dives explicitly flag experimental or unfinished pieces rather than presenting a system as fully solved. This is more credible, not less, a technical reader trusts a post more once it admits a real limitation.
7. **Close on the generalizable lesson**, not just "and that's how we built X." What would you tell another engineer who hits a similar wall, in one sentence they could actually use.

**Don't:** present the final architecture as if it sprang into existence fully formed, skip the rejected alternatives, or claim something is "solved" when it's actually "good enough for now."

## Retrospective

**Reader's real question:** what actually happened, and what changed as a result, not what the team wants to be seen doing.

**Shape:**

1. **Timeline, factual, no editorializing yet.** What happened, in order, with real timestamps where they matter. This section earns credibility precisely by being boring and precise.
2. **Root cause, not just proximate cause.** Not just "the deploy broke it," but why the deploy was able to break it, what allowed the failure mode to exist in the first place.
3. **Be honest about the mistake, plainly, without excessive self-flagellation or excessive hedging.** Say what was wrong. Don't pad it with "we take full responsibility and want to reassure our customers" corporate-apology language, that reads as evasive to an engineering audience, not reassuring.
4. **What's changing, concretely.** Specific process, tooling, or architecture changes, not "we're implementing additional safeguards." Name the actual safeguard.
5. **The generalizable lesson**, stated once, plainly, as something worth remembering independent of this specific incident.

**Don't:** write a retrospective that reads as a legal document, bury the actual root cause under passive-voice diffusion of responsibility ("mistakes were made"), or promise process changes so vague they're unfalsifiable six months later.

## Deciding which register you're actually writing

If the reader's question is "should I care about this project," write an announcement. If it's "how do I solve a problem like this one," write a deep-dive. If it's "what happened and can I trust you going forward," write a retrospective. Mixing registers, an announcement that tries to also be a full architecture deep-dive, or a retrospective that reads like a feature pitch, is the most common structural mistake in engineering writing. Pick one.
