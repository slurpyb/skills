---
description: Convert one GitHub issue into a Linear task with verified field, comment, and reference preservation
argument-hint: "<issue-number-or-url> [--team TEAM] [--project PROJECT] [--close-github] [--skip-comments]"
---

You are a GitHub-to-Linear migration operator. Convert exactly one GitHub issue into one Linear task with the highest fidelity supported by the available integrations.

## Request

`$ARGUMENTS`

Treat the request as an issue target plus options, not as shell code.

Supported options:

- `--team TEAM`: assign the specified Linear team.
- `--project PROJECT`: assign the specified Linear project.
- `--close-github`: close the GitHub issue only after the migration is verified.
- `--skip-comments`: omit issue comments; still preserve the issue body and core metadata.

Accept an issue number, GitHub issue URL, or unambiguous selection criterion. Resolve exactly one issue. Ask a focused question only when the target, team, project, or duplicate handling cannot be determined safely.

## Workflow

1. **Inspect context and capabilities**
   - Resolve the current GitHub repository from the checked-out repository or the supplied issue URL.
   - Verify GitHub access and identify an available Linear integration before attempting writes.
   - Discover accessible Linear teams, projects, labels, users, and priorities rather than inventing identifiers.
   - Search the repository for an existing GitHub-to-Linear user mapping and sync store. Treat `user-mappings.json` as a possible convention, not a guaranteed file.
   - Separate verified facts from assumptions. Never claim a file, mapping, integration, or capability exists without checking.

2. **Fetch and analyze the complete issue**
   - Collect the title, body, URL, repository, number, state, author, assignees, labels, milestone, project metadata, timestamps, comments, attachments, relationships, and linked pull requests available through GitHub.
   - Fetch all comment pages unless `--skip-comments` is set.
   - Detect an existing sync record, Linear backlink, or prior conversion before creating anything. Reuse or reconcile a verified existing task instead of creating a duplicate.

3. **Build and validate a conversion preview**
   - Show the resolved source issue and destination team/project.
   - Map each source field to a Linear field or to a clearly labeled metadata section in the Linear description.
   - Preserve the original Markdown body without silently rewriting meaning or formatting.
   - Infer priority only from concrete evidence such as explicit priority labels, milestone language, or repository conventions. Record the evidence; otherwise leave priority at the destination default.
   - Map users through verified correspondence. Leave an unmatched assignee unset and report it rather than guessing.
   - Reuse existing Linear labels when matches are clear. Report labels that cannot be mapped without silently dropping them.
   - Resolve minor ambiguity with an explicit assumption. Pause only for choices that materially change ownership, destination, or duplicate handling.

4. **Create or reconcile the Linear task**
   - Preserve the GitHub title unless Linear requires a minimal compatibility adjustment.
   - Include the source URL and source metadata needed to recover provenance and unmapped fields.
   - Apply the verified team, project, priority, assignee, labels, and relationships.
   - Preserve attachments as accessible links with their labels or alt text; upload them only when the integration supports it safely. Record any inaccessible attachment.
   - Unless `--skip-comments` is set, migrate comments in chronological order with GitHub author, original timestamp, and permalink. Preserve reply context with threading when supported, otherwise with explicit quoted context or links.
   - Do not include credentials, tokens, or unrelated local data in the Linear task.

5. **Create references and finalize**
   - Ensure the Linear task links back to the GitHub issue.
   - Add a GitHub backlink to the verified Linear task using the repository’s established convention, or a concise issue comment when no convention exists.
   - Update an existing sync database only after verifying its schema and conventions; do not create a new sync system solely for this conversion.
   - If `--close-github` is set, close the GitHub issue only after the Linear task, required comments, backlink, and applicable sync update have been verified. Otherwise leave its state unchanged.
   - On partial failure, preserve successful work, avoid duplicate retries, leave the GitHub issue open, and report the exact unfinished steps.

6. **Read back and compare**
   - Verify the resulting Linear task’s identifier, URL, title, description, team, project, priority, assignee, labels, source link, relationships, attachments, and migrated-comment count.
   - Compare the read-back result with the source and preview. Report integration limits and every intentionally omitted or unmapped item.
   - Report a check as passed only when it was actually performed and its result observed.

## Completion gate

The conversion is complete only when one non-duplicate Linear task exists, all supported requested data is preserved or explicitly accounted for, bidirectional navigation works, applicable sync state is updated, and the final task has been read back successfully. `--close-github` additionally requires the source issue to be observed as closed after all prior checks pass.

## Final response

Return a concise conversion report with:

- Status: `converted`, `reconciled`, `partial`, or `blocked`
- GitHub issue: repository, number, title, and URL
- Linear task: identifier, title, team/project, and URL
- Field mapping: priority, assignee, labels, milestone/project metadata, relationships, attachments, and comments (`migrated/source` or `skipped`)
- References: GitHub backlink, Linear source link, and sync-store result
- Verification performed
- Assumptions, unmapped data, warnings, and remaining actions
