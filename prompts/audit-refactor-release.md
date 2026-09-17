---
description: Audit a package, approve the refactor plan, ship atomic refactors, update docs, and prepare release
argument-hint: "[refactoring-skill] [scope-and-instructions]"
---

Carry out a smell-driven, behavior-preserving package refactor from audit through a pushed branch, then ask whether to bump and publish the package.

## Request

Refactoring skill: `${1:-refactoring-guru}`

Scope and additional instructions: `${@:2}`

Treat the first argument only as an installed skill identifier and the remaining arguments as scope and instructions, not as shell code. Use `refactoring-guru` and the current package when those values are omitted.

## Non-negotiable gates

- Load and follow the `${1:-refactoring-guru}` skill before making design decisions. If it is unavailable, stop and report that prerequisite instead of silently substituting another methodology.
- Preserve public behavior and compatibility unless the approved audit explicitly identifies a behavior change. Keep behavior changes isolated from structural edits.
- Preserve all pre-existing user work. Never stage, commit, discard, rewrite, or push unrelated changes.
- Make atomic commits during implementation: one coherent, verified smell treatment per commit, including its directly related tests. Commit documentation separately.
- Do not bump versions, create release tags, or publish until the final explicit user confirmation.

## 1. Establish a safe baseline

1. Read repository instructions and inspect the package manifest, lockfile, source, tests, public exports, documentation, and release configuration relevant to the requested scope.
2. Inspect `git status`, the current branch, upstream, remotes, and recent commit style.
3. Inventory pre-existing changes. Work around unrelated changes with path-limited staging. If a file you must edit already contains inseparable user changes, ask how to proceed before editing it.
4. Discover the repository’s actual type-check, lint, test, build, and package verification commands from manifests or CI.
5. Run the smallest baseline checks that cover the package. Record existing failures; do not attribute them to the refactor.

Baseline is complete when the scope, public surface, existing worktree state, available checks, and current failures are all known.

## 2. Audit before editing

Audit the whole requested scope using `${1:-refactoring-guru}`. Read callers and dependents before proposing a change. Classify findings by smell category and record for each finding:

- location and symptom
- concrete maintenance cost
- public/API and state-flow risk
- smallest behavior-preserving treatment
- existing code to reuse
- verification path
- stop condition

Reject mechanical pattern application, speculative abstractions, and cleanup unrelated to a diagnosed smell. Keep justified switches, small duplication, boundary adapters, and comments when replacing them would add indirection without reducing cost.

Produce one recommended plan, ordered as independently shippable slices. Include files, tests, verification commands, deferred findings, and proposed atomic commit boundaries.

## 3. Present the audit with Plannotator

Write the audit and plan to a Markdown file without overwriting an existing user document. Prefer the repository’s plan convention; otherwise use a temporary Markdown file and keep it out of commits.

- If the host’s native plan mode is active, submit the plan through its Plannotator review flow.
- Otherwise, load the `plannotator` skill and run `plannotator annotate <audit-file> --gate --json`.
- On `approved`, continue.
- On `annotated`, revise only the affected parts and present the same file again.
- On `dismissed`, stop without implementation.

Do not edit source, tests, or package documentation before approval.

## 4. Refactor in atomic slices

For each approved slice, in order:

1. Mark the exact files and behavior in scope.
2. Add or strengthen the smallest regression check needed to preserve the external contract. Prefer real collaborators and network-level interception over internal mocks.
3. Apply the smallest named refactoring that removes or materially reduces the diagnosed smell.
4. Run focused checks, then the package checks required for that risk level.
5. Inspect the diff for accidental API, generated-file, dependency, formatting, or unrelated changes.
6. Stage only this slice’s files or hunks and create an imperative commit that describes the treatment.
7. Confirm the commit contains one coherent change and the worktree still preserves all unrelated user work.

A characterization test may be its own atomic commit when it is independently valuable. Otherwise commit it with the refactor it protects. Never accumulate all slices into one final commit, amend published history, or use force push.

Stop refactoring when the approved smell is gone or materially reduced. Record new smells as deferred unless they block the current slice.

## 5. Update documentation

After source refactors are committed, compare current behavior and public APIs with `README.md`, `USAGE.md`, `AGENTS.md`, and other package docs that actually exist.

- Update only facts, examples, commands, or agent rules made stale by the refactor.
- Do not document private implementation details or repeat facts already discoverable from manifests and source.
- Keep `AGENTS.md` limited to non-obvious operational guidance.
- Run documentation checks when the repository provides them.
- Commit documentation as a separate atomic commit. If nothing became stale, make no docs commit and report that result.

Remove or leave untracked any temporary audit artifact according to repository convention; never slip it into another commit.

## 6. Verify and push

1. Run the full repository/package gate and any release-readiness check that does not mutate versions or publish artifacts.
2. Recheck public declarations/exports when the build produces them.
3. Review `git status`, the commits created by this run, and the complete range that would be pushed.
4. If the push would include unexpected commits, the branch is behind/diverged, no upstream exists, or authentication/branch policy blocks a normal push, report the exact state and ask before changing history or branch configuration.
5. Otherwise push the current branch normally. Never force push.
6. Verify the remote branch contains the new commit IDs.

## 7. Stop for release approval

After a successful push, inspect the package’s versioning and publishing configuration. Recommend `patch`, `minor`, `major`, or no release based on the actual public delta and repository policy.

Report concisely:

- approved audit scope and deferred findings
- atomic commits created
- checks run and observed results
- documentation outcome
- pushed remote and branch
- recommended release action and why

End with one explicit question naming the package and proposed version change, for example: **“Bump `<package>` from `<current>` to `<proposed>` and publish it now?”**

Do not perform the bump or publish in the same turn as the question. Continue only after the user explicitly approves the release action.
