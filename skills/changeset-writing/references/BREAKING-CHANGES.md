# Breaking Changes

A breaking change is not a normal entry with scarier words. It needs a different shape: what broke, why it had to, and the exact step to react, in that order, every time. A reader deciding whether to upgrade needs to answer one question fast: does this touch my code, and if so, what do I do. Bury that under a wall of context and they'll upgrade blind, or not at all.

## The shape

**What broke.** One sentence, naming the exact thing, not the area around it. Not "changes to how financial addresses work," but the exact field, method, or parameter: "Replaces `swift_code` with `bic` on the `credentials.us_bank_account` hash of the Financial Address object."

**Why.** One sentence, the real reason, not a justification for its own sake. "BIC (Bank Identifier Code) is the standard term for what was previously labeled as a SWIFT code." If there's no real reason beyond "we wanted to," that's worth pausing on before you ship the break at all.

**Impact.** State plainly what happens to code that does nothing: "If your code reads `swift_code` from Financial Address responses, it will no longer receive this property... If your code passes `swift_code` in requests, those requests will fail." Say what breaks, not just that something might.

**Migrate.** The exact step, not a pointer to go figure it out. "You must update it to read `bic` instead." If there's a temporary escape hatch, an old behavior still reachable through a flag or a pinned version, say so and say how long it'll last. A real API changelog handles this by explicitly stating a rollback window after an upgrade, telling the reader exactly how much slack they have if the migration doesn't go cleanly the first time. That candor is worth copying even outside an API context: if you can offer a way back, say so plainly instead of making the upgrade feel like a one-way door.

## Marking it in the aggregated changelog

Once changesets are merged into `CHANGELOG.md`, a breaking entry needs to stand out from the rest of that release's list without needing its own separate section. The convention worth adopting: prefix the line in bold, `**Breaking:**`, and sort it to the front of whatever category it lives in. A monorepo entry extends this by naming the affected package first: `**auth (breaking):** ...`. This keeps one flat, scannable list per release instead of forcing a reader to hunt through a separate "Breaking Changes" heading that may or may not exist depending on whether this release happened to have any.

The alternative, real convention is to not flag breaking-ness inline at all, and instead reserve it for a dedicated major-version upgrade guide, written once per major bump rather than once per entry. This works when breaking changes are rare and clustered at major releases, and when the aggregated changelog is read by people who already know a major bump means "go read the guide." It doesn't work if breaking changes can land in a minor-adjacent release or a monorepo package that isn't the one someone's watching. Pick based on which is actually true for the target repo, don't default to one without checking, per [SKILL.md](../SKILL.md)'s step 0.

## Writing the changeset file itself

The changeset file is where the What/Why/Impact/Migrate shape actually gets written, before any aggregation happens. Two real, dogfooded examples from a widely-used tool's own `.changeset/` folder show the pattern at different sizes:

A small one, one migration line, no separate impact section needed because the impact is obvious from the WHAT:

> Removed `execWithOutput` and `spawnWithOutput`.
>
> They were never intended to be used externally, but are now removed either way.
>
> If you used them, we recommend using `tinyexec` or `node:child_process#exec` directly.

A slightly larger one, where the migration itself has a conditional branch worth spelling out:

> Replaced the `prettier` config option with `format`. `format` supports `"auto"`, `"prettier"`, `"oxfmt"`, `"deno"`, `"dprint"`, and `false`.
> If you previously used `prettier: false`, migrate to `format: false`.

Notice what's absent from both: no apology, no "we're sorry for the inconvenience," no hedging about whether the change was necessary. State it, explain it, tell the reader exactly what to type instead. That's the whole job.

## What not to do

Don't soften a breaking change with a vague verb ("updated," "improved," "refactored") to make it sound smaller than it is, a reader who trusts your patch notes and gets bitten by a "minor" release that actually broke something loses that trust permanently. Don't bury the migration step at the end of a long paragraph of backstory, lead with what broke, explain after. Don't write "this may affect some users" when you know exactly which code path is affected, say the exact path.
