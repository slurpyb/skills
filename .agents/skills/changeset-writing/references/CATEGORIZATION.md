# Categorization

Three real schemes exist for grouping changelog entries. They disagree with each other on purpose, each optimizes for something different. Don't invent a fourth, and don't apply one you haven't checked against what the target repo already does, per [SKILL.md](../SKILL.md)'s step 0.

## Keep a Changelog: six categories

The oldest, most widely adopted scheme. Six categories, used as needed, not all six every release:

- **Added** for new features.
- **Changed** for changes in existing functionality.
- **Deprecated** for soon-to-be removed features.
- **Removed** for now removed features.
- **Fixed** for any bug fixes.
- **Security** in case of vulnerabilities.

It also keeps an **Unreleased** section at the top of the file, tracking changes that haven't shipped in a numbered release yet, and asks you to state, once, whether the project follows Semantic Versioning. Its guiding principles are worth repeating verbatim, since they're the reasoning behind every other convention in this file: "Changelogs are for humans, not machines." "There should be an entry for every single version." "The same types of changes should be grouped." "The latest version comes first."

Use this scheme when the target repo already declares it (a line at the top of `CHANGELOG.md` like "the format is based on Keep a Changelog"), or when you want maximum recognizability to anyone who's read a changelog before.

## Common Changelog: four categories, fixed order

A tighter refinement, purpose-built for software packages rather than general projects. It cuts Keep a Changelog's six down to four, in a fixed order that doesn't change per release: **Changed, Added, Removed, Fixed**. Deprecated and Security aren't separate categories, a deprecation notice or security fix gets folded into prose within one of the four. It also drops the Unreleased section entirely, an entry only exists once it's actually shipped.

What it adds that Keep a Changelog leaves unspecified: every entry should be traceable to a commit, PR, or issue, and optionally a named author, placed at the end of the line: `Description ([#123](link)) ([@author](link))`. Breaking changes get a bold `**Breaking:**` prefix and sort to the front of their category, see [BREAKING-CHANGES.md](BREAKING-CHANGES.md). Its five stated principles: "Changelogs are for humans." "Communicate the impact of changes." "Sort content by importance." "Skip content that isn't important." "Link each change to further information."

Use this scheme when the repo wants tighter, more scannable entries and doesn't need Keep a Changelog's Unreleased-section workflow, or when consistent PR/author linking matters more than category granularity.

## The minimal scheme: three buckets by impact

The simplest real pattern, used by teams that optimize for a reader scanning a release in a few seconds: group by **Breaking changes** first, then **New features**, then **Fixes**. No Deprecated or Security category at all, a deprecation is just a Changed-style note inline, a security fix is just a Fixed entry that happens to matter more.

This works well for a single-package or small-monorepo project shipping frequently, where most releases have zero breaking changes and the reader mainly wants to know "did anything get added, did anything break." It works less well for a project that needs an audit trail of security fixes specifically, or one where Keep a Changelog's Unreleased section is doing real work coordinating an in-progress release across contributors.

## Deciding which one to use

Check, in order: does `CHANGELOG.md` already declare a format at the top. Does it already have consistent category headers you can pattern-match against. Does the project's changeset config customize the changelog generator (a `changelog` field in `.changeset/config.json` pointing at a custom `getReleaseLine`/`getDependencyReleaseLine` implementation) that implies a house style. If none of these exist yet, default to the three-bucket scheme for a small or new project, Keep a Changelog for anything that wants maximum external recognizability, and Common Changelog when consistent commit/PR/author linking is a real priority.
