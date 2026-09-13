# Examples

Real entries, quoted verbatim, not paraphrased into something tidier than the original. Generic bad examples are invented for contrast; every good example is a real, shipped changelog entry, drawn from widely-used developer tools and platforms.

## Vague vs. specific

| Generic                                | Specific, real                                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| "Fixed a bug."                         | "Ensure `@tailwindcss/postcss` rebuilds when a preprocessor like Sass changes the input CSS without changing the input file on disk." |
| "Improved performance."                | "Actions workflow pages now successfully render workflows with more than 300 jobs... users can now filter jobs based on status."      |
| "Various fixes and improvements."      | "Fixed delay showing Calculator results for operators that matched Flight designators (e.g. `bin 3` or `hex 50`)."                    |
| "Refactored internal type extraction." | "Fix toast `parent` prop type (fixes #2983)"                                                                                          |

The generic column names an area. The specific column names an exact symbol, file, config option, or reproducible case. If your draft reads like the left column, you haven't found the actual fact yet, go find it before you write the entry.

## Naming the mechanism, not just the symptom

A good fix entry explains _why_ it was broken, not only that it's fixed now:

> "Ensure `@tailwindcss/postcss` rebuilds when a preprocessor like Sass changes the input CSS without changing the input file on disk."

That's naming a real caching/mtime mechanism. Compare to "fixed a rebuild issue," which tells the reader nothing they can use to recognize whether this fix actually covers their situation.

## Pairing what with why

Some changelogs rarely state a capability without also stating what it unlocks, in the same sentence:

> "Local models allow you to run nearly any open source LLM locally, on your machine." followed immediately by what that unlocks: dozens of models, no subscription cost, full privacy.

The same move works from a different angle, justifying a config change by naming what the old format literally couldn't do:

> "`vercel.ts` lets you express configuration as code by defining advanced routing, request transforms, caching rules, and cron jobs, going beyond what static JSON can express. In addition to full type safety, this also allows access to environment variables, shared logic, and conditional behavior."

Neither stops at the noun. Both finish the sentence with the concrete thing a consumer can now do that they couldn't before.

## A real breaking-change entry, full shape

A real changelog entry for replacing a field on a versioned API, all four parts present and in order:

> **What broke:** "Replaces `swift_code` with `bic` on the `credentials.us_bank_account` hash of the Financial Address object."
> **Why:** "BIC (Bank Identifier Code) is the standard term for what was previously labeled as a SWIFT code."
> **Impact:** "If your code reads `swift_code` from Financial Address responses, it will no longer receive this property... If your code passes `swift_code` in requests, those requests will fail."
> **Migrate:** "You must update it to read `bic` instead."

See [BREAKING-CHANGES.md](BREAKING-CHANGES.md) for the full template this comes from.

## A real changeset, dogfooded by a maintainer

From a widely-used tool's own `.changeset/` folder, a major-bump entry written by its own maintainers:

> Removed `execWithOutput` and `spawnWithOutput`.
>
> They were never intended to be used externally, but are now removed either way.
>
> If you used them, we recommend using `tinyexec` or `node:child_process#exec` directly.

Three sentences. What, a one-line aside on why it's safe to remove, then the exact migration. Nothing else.

## How entries read once aggregated

A changeset is written in isolation but read next to five or ten others in the same release. Stack three real, differently-scoped entries the way a reader actually encounters them:

> - **Breaking:** Replaced the `prettier` config option with `format`. `format` supports `"auto"`, `"prettier"`, `"oxfmt"`, `"deno"`, `"dprint"`, and `false`. If you previously used `prettier: false`, migrate to `format: false`.
> - Added new `--major`, `--minor`, `--patch` flags to the `add` command.
> - Fixed resolution of changelog and commit generator modules so built-in modules can still be loaded when they are not installed in the target project.

Notice none of them re-explain what "the `add` command" or "changelog generator modules" are, they assume the reader has the same context as anyone else reading this file, and they don't repeat a shared preamble ("in this release, we...") before each bullet. Each line stands on its own and stays the same length as its neighbors unless it genuinely needs more (the breaking entry earns its extra sentence, the other two don't need one). That's the actual test from [SKILL.md](../SKILL.md)'s step 5: read your draft in this kind of stack, not alone, before you're done.
