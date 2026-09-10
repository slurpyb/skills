---
name: writing-changelogs
description: Write or restyle changelogs and release notes as terse late-1990s to mid-2000s PC game patch notes. Use when creating or updating a changelog, update history, patch notes, or release notes.
---

# Writing changelogs

Write plain Markdown in the style of classic distributor-era game updates:

```markdown
## Month D, YYYY — Update Name Released

An update to Product has been released. The specific changes include:

### Subsystem

- Added ...
- Fixed ...
- Improved ...
- Removed ...
```

Group bullets by user-facing subsystem. Lead with direct past-tense verbs and describe observable behavior; include implementation details only when they explain compatibility, migration, or a fix. Preserve exact versions, controls, removals, and breaking changes.

Keep the tone factual, terse, slightly mechanical, and free of marketing language. Make the deployment sentence truthful; mention automatic application only when the project actually provides it. Follow an existing changelog path when present, otherwise create `CHANGELOG.md` at the project root.

The entry is complete when every user-visible addition, change, fix, removal, and compatibility effect is accounted for once.
