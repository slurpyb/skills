---
name: changeset-writing
description: Use when writing a changeset for a change to a published package. Picking the semver bump, writing the summary, flagging breaking changes, and making sure the entry still reads well once aggregated into CHANGELOG.md.
---

# Changeset Writing

A changeset is a written intent to change, created while the change is fresh, versioned and merged into `CHANGELOG.md` later. Write it for the consumer reading the changelog after an upgrade, not for yourself reading the diff today.

## 0. Check what this repo already does

Look for an existing convention before applying this skill's defaults: a header in `CHANGELOG.md` declaring a format (`Keep a Changelog`, `Common Changelog`), an internal style guide, or just the shape of recent real entries. Match it. Only fall back to this skill's own defaults, described in [references/CATEGORIZATION.md](references/CATEGORIZATION.md), if nothing exists yet.

## 1. Decide if this needs a changeset at all

Not every change does. Internal refactors, CI tweaks, dependency bumps with no observable effect, and doc-only changes don't need one. If a consumer would never notice or care, skip it. If you're unsure whether it's user-facing, that uncertainty is itself a sign to go check, not to default to writing one anyway.

## 2. Pick the semver bump

Patch, minor, or major, this is a judgment call with real edge cases: dependency-only bumps, experimental APIs, deprecations that don't remove anything yet, monorepo packages that only re-export another package's change. Full decision tree in [references/BUMP-DECISIONS.md](references/BUMP-DECISIONS.md).

## 3. Write WHAT, WHY, and HOW

Three things, in order, every time: what changed, why a consumer should care, and (if it's not obvious) how they should react. Lead with a verb, imperative mood (`Add`, `Fix`, `Remove`, not `Added`, `Fixed`, `Removed`), name the exact API in backticks. Skip WHY and HOW when the WHAT is self-evident, don't pad a one-line fix into three sentences it doesn't need.

## 4. Flag breaking changes on purpose

A breaking change is not a bigger version of a normal entry, it's a different shape: what broke, why, and the exact migration step, not just a warning that something changed. Full template and real examples in [references/BREAKING-CHANGES.md](references/BREAKING-CHANGES.md).

## 5. Check how it reads next to its neighbors

A changeset gets concatenated with every other changeset in the release. Read it once as if it's sitting between two other entries: does it repeat context they already established, does it use the same component/module name consistently, does it stay one line where the others are one line. Concrete before/after examples in [references/EXAMPLES.md](references/EXAMPLES.md).

---

Sentence-level rules (no hype words, no em dashes, be specific, say what's rough) are the same ones [engineering-writing](../engineering-writing/references/VOICE-AND-SLOP.md) uses. But there's no audience-diagnosis or narrative structure here, a changeset is a fact, stated precisely, not a story. The narrative writing, announcements, deep-dives, retrospectives, is `engineering-writing`'s job, not this one.
