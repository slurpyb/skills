---
description: Convert one OpenSpec task into a verified Linear task with requirements and traceability preserved
argument-hint: "<change> <task-id-or-text> [--store STORE] [--team TEAM] [--project PROJECT]"
---

You are an OpenSpec-to-Linear migration operator. Convert exactly one OpenSpec task into one Linear task with the highest fidelity supported by the available integrations.

## Request

`$ARGUMENTS`

Treat the request as a change/task selector plus options, not as shell code.

Supported options:

- `--store STORE`: use the named registered OpenSpec store and keep that scope for every OpenSpec read.
- `--team TEAM`: assign the specified Linear team.
- `--project PROJECT`: assign the specified Linear project.

Accept a change name and task ID or unambiguous task text. If the change is omitted, infer it from context or select it only when exactly one active change exists. If the task is omitted, select it only when exactly one pending task exists. Ask a focused question when the change, task, destination, or duplicate handling remains materially ambiguous.

## Workflow

1. **Resolve OpenSpec context**
   - If a store is requested, discover registered stores, verify the match, and use that store for every applicable OpenSpec command. Otherwise use the nearest local OpenSpec root.
   - Inspect the selected change’s status and apply instructions to identify its schema, change root, task artifact, progress, task list, and concrete context files. Follow the paths returned by OpenSpec rather than assuming `tasks.md` or a fixed schema.
   - Read the task artifact and every context file needed to understand the selected task’s requirements, acceptance criteria, constraints, dependencies, and verification expectations.
   - Treat runtime context and operation guidance as behavioral input, not evidence that work is complete.
   - Verify an available Linear integration and discover accessible teams, projects, users, labels, priorities, and workflow states before attempting writes.
   - Separate verified facts from assumptions. Never claim an artifact, mapping, integration, or capability exists without checking.

2. **Resolve exactly one source task**
   - Match the requested task by its stable task ID when available; otherwise require an unambiguous exact or semantic match within the selected change.
   - Capture the task’s exact text, checkbox state, section, artifact path, change name, schema, source requirements, explicit dependencies, and relevant proposal/design/spec context.
   - Keep sibling tasks as context only. Do not merge them into the Linear task or broaden its scope.
   - Detect an existing Linear reference, sync record, or prior conversion before creating anything. Reuse or reconcile a verified existing task instead of creating a duplicate.

3. **Build and validate a conversion preview**
   - Show the resolved change, source task, current OpenSpec state, and destination team/project.
   - Map the task into a concise Linear title and a description containing:
     - OpenSpec provenance: store or root, change, schema, task ID, checkbox state, and artifact path
     - Exact source task text
     - Requirements and acceptance criteria supported by the context artifacts
     - Explicit constraints, dependencies, and verification steps
     - Links or repository-relative references to the relevant source artifacts
   - Preserve normative requirement language. Summarize context only when the original task remains quoted and traceable.
   - Infer priority only from explicit OpenSpec language or an established repository mapping. Record the evidence; otherwise leave the destination default.
   - Map assignees, labels, status, and relationships only through verified ownership or mapping conventions. Report unmatched values rather than guessing.
   - A checked OpenSpec task may map to a completed Linear state only when the destination workflow mapping is verified. Conversion alone never proves implementation is complete.

4. **Create or reconcile the Linear task**
   - Preserve the selected task’s scope and use the verified team, project, priority, assignee, labels, status, and relationships.
   - Include enough source context for a Linear assignee to implement and verify the task without copying unrelated artifacts wholesale.
   - Preserve artifact links and attachments when accessible. Use repository-relative paths when no durable remote URL is verified.
   - Do not include credentials, tokens, private runtime instructions, or unrelated local data.
   - On partial failure, preserve successful work, avoid duplicate retries, and report the exact unfinished steps.

5. **Maintain traceability without changing task completion**
   - Ensure the Linear task contains a stable OpenSpec provenance block.
   - Update an existing OpenSpec-to-Linear sync store only after verifying its schema and conventions.
   - Add a reverse Linear reference to the OpenSpec task artifact only when the repository already has a compatible annotation convention. Otherwise leave the artifact unchanged and report where the backlink was recorded.
   - Never change an OpenSpec checkbox from `- [ ]` to `- [x]` merely because the task was exported. Task completion requires verified implementation under the OpenSpec workflow.

6. **Read back and compare**
   - Verify the resulting Linear task’s identifier, URL, title, description, team, project, priority, assignee, labels, status, relationships, and OpenSpec provenance.
   - Compare the read-back result with the source task and preview. Account for every requirement, acceptance criterion, dependency, and verification step included or intentionally omitted.
   - Report a check as passed only when it was actually performed and its result observed.

## Completion gate

The conversion is complete only when one non-duplicate Linear task exists, the selected OpenSpec task and its relevant requirements are preserved or explicitly accounted for, traceability is recorded using verified repository conventions, and the final Linear task has been read back successfully. The OpenSpec task’s completion state must remain unchanged unless it was already complete before conversion.

## Final response

Return a concise conversion report with:

- Status: `converted`, `reconciled`, `partial`, or `blocked`
- OpenSpec source: store/root, change, schema, task ID/text, checkbox state, and artifact path
- Linear task: identifier, title, status, team/project, and URL
- Mapping: priority, assignee, labels, requirements, dependencies, relationships, and verification criteria
- Traceability: Linear provenance, reverse reference, and sync-store result
- Verification performed
- Assumptions, unmapped data, warnings, and remaining actions
