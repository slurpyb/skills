---
description: Add Bun CI, Changesets, and npm publishing through GitHub Actions trusted publishing
argument-hint: "[package-path=./] [npm-access=public] [github-owner=@fullsnacklab]"
---

Add CI and npm publishing through GitHub Actions trusted publishing to the current repository.

## Inputs

- Package path: `${1:-./}`
- npm access: `${2:-public}`
- GitHub organization or user: `${3:-@fullsnacklab}`

Treat these values as data, not shell expressions. Resolve the package path inside the repository and normalize a leading `@` off the GitHub owner only when presenting the npm trusted-publisher fields.

## Guardrails

- Read repository instructions and inspect the worktree, package manifest, lockfile, existing CI/release workflows, Changesets configuration, and Git remote before editing.
- Preserve unrelated user changes. Create a new branch named `release/npm-trusted-publishing`, adding a short unique suffix if that branch already exists.
- Keep npm publishing tokenless: use GitHub OIDC with `id-token: write`; do not add `NPM_TOKEN`, `NODE_AUTH_TOKEN`, or another long-lived publish credential.
- Ensure the published package's `repository.url` exactly matches the GitHub repository.
- If the repository or required dependencies are private, use the repository's existing Infisical CLI setup for install-only secrets. If none exists, ask for the Infisical project, environment, and secret path instead of guessing or storing plaintext secrets. Publishing must remain OIDC-only.
- Trusted publishing works only in the GitHub-hosted release job. Do not run a local command that publishes, versions packages, creates tags, or pushes unless this prompt explicitly requires it.

## 1. Prepare the package

1. Determine the repository root, package root, workspace root, Changesets root, and lockfile location. Adapt paths below to the observed layout rather than assuming a single-package repository.
2. Use Bun for dependency installation and scripts.
3. Ensure the appropriate workspace has these development tools, reusing compatible installed versions:
   - `oxfmt`
   - `oxlint`
   - `@changesets/cli`
4. Initialize or repair the minimal Changesets configuration if needed.
5. Reuse existing package scripts where they satisfy the requirement. Add only missing scripts for:
   - `build`
   - `test`
   - `format:check` using oxfmt
   - `lint` using oxlint
   - `type-check`
   - `check`
   - `release`
6. Keep `release` compatible with CI trusted publishing. If an existing `release` script publishes locally, leave it intact and report that it can run only inside the trusted GitHub workflow; do not execute it locally.
7. Add one concise Changeset for this CI/publishing change, selecting the smallest correct semver bump.

## 2. Add or update CI

Reuse an existing CI workflow when it already covers the required checks. Otherwise create `.github/workflows/ci.yml` for pull requests and pushes. It must install with `bun install --frozen-lockfile` and run these commands in order:

```sh
bun run build
bun run test
bun run format:check
bun run lint
bun run type-check
bun run check
```

Avoid duplicating a check already included by `bun run check` only when the repository's established CI intentionally uses that aggregate script; preserve the explicit commands above by default.

## 3. Add the release workflow

Create `.github/workflows/release.yml` from this baseline. Substitute the resolved static package path and npm access into the job-level `env`. Adapt only repository-layout details that inspection proved different.

```yaml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

permissions: {}

jobs:
  release:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    permissions:
      contents: write
      id-token: write
    env:
      PACKAGE_PATH: "${1:-./}"
      NPM_ACCESS: "${2:-public}"
    steps:
      - name: Check out repository
        uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6.0.2
        with:
          fetch-depth: 0
      - name: Set up Node.js
        # v6.1.0
        uses: actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38
        with:
          node-version: 24.20.0
      - name: Set up Bun
        # v2.1.3
        uses: oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6
        with:
          bun-version: 1.4.0
      - run: bun install --frozen-lockfile
      - name: Find pending changesets
        id: pending
        run: |
          if find .changeset -maxdepth 1 -type f -name '*.md' \
            ! -name README.md | grep -q .; then
            echo 'release=true' >> "$GITHUB_OUTPUT"
          else
            echo 'release=false' >> "$GITHUB_OUTPUT"
          fi
      - name: Apply changesets
        if: steps.pending.outputs.release == 'true'
        run: |
          bunx changeset version
          bun install --lockfile-only
      - name: Commit release version
        if: steps.pending.outputs.release == 'true'
        run: |
          manifest="$PACKAGE_PATH/package.json"
          package_name=$(node -p "require('./' + process.argv[1]).name" "$manifest")
          package_version=$(node -p "require('./' + process.argv[1]).version" "$manifest")
          release_tag="${package_name}@${package_version}"
          git config user.name 'github-actions[bot]'
          git config user.email \
            '41898282+github-actions[bot]@users.noreply.github.com'
          git add --all
          git commit -m "chore: release $release_tag"
          git push origin HEAD:main
      - name: Publish package
        id: publish
        if: steps.pending.outputs.release == 'true'
        env:
          NPM_CONFIG_USERCONFIG: /dev/null
        run: |
          manifest="$PACKAGE_PATH/package.json"
          package_name=$(node -p "require('./' + process.argv[1]).name" "$manifest")
          package_version=$(node -p "require('./' + process.argv[1]).version" "$manifest")
          release_tag="${package_name}@${package_version}"
          env -u NPM_TOKEN -u NODE_AUTH_TOKEN -u BUN_AUTH_TOKEN \
            -u NPM_CONFIG_TOKEN npm publish "$PACKAGE_PATH" \
            --registry=https://registry.npmjs.org/ \
            --access="$NPM_ACCESS" \
            --tag=latest \
            --provenance=false
          echo "tag=$release_tag" >> "$GITHUB_OUTPUT"
      - name: Create GitHub release
        if: steps.pending.outputs.release == 'true'
        env:
          GH_TOKEN: ${{ github.token }}
          RELEASE_TAG: ${{ steps.publish.outputs.tag }}
        run: |
          git tag -a "$RELEASE_TAG" -m "Release $RELEASE_TAG"
          git push origin "refs/tags/$RELEASE_TAG"
          gh release create "$RELEASE_TAG" \
            --repo "$GITHUB_REPOSITORY" \
            --verify-tag \
            --generate-notes \
            --title "$RELEASE_TAG"
```

Keep `.changeset` lookup at the actual Changesets root. The runner starts from a clean checkout, so `git add --all` must stage only files generated by `changeset version` and the lockfile update; verify that diff before retaining this command.

## 4. Verify without publishing

Run, in order:

```sh
bun run build
bun run test
bun run format:check
bun run lint
bun run type-check
bun run check
```

Then inspect `bun run release` without executing it. If it is strictly a non-publishing validation command, run it. If it publishes, versions, tags, commits, or pushes, defer it to the trusted release workflow.

Also validate workflow YAML, inspect the final diff, and confirm no publish token or unrelated file is present. Do not claim a check passed unless its command completed successfully.

## 5. Hand off npm configuration

After the workflow file exists, ask the user to add a GitHub Actions trusted publisher in the npm package settings with the exact observed values:

- **Organization or user:** resolved GitHub owner without a leading `@`
- **Repository:** GitHub repository name
- **Workflow filename:** `release.yml`
- **Allowed action:** `npm publish`

State that npm expects the filename only, not `.github/workflows/release.yml`. Stop and wait for the user to confirm this configuration before any merge or release intended to publish.

## Completion report

Report:

- branch and changed files
- package name, path, access, and repository URL
- Changeset filename and bump
- checks run with observed results
- any private dependency/Infisical requirement
- the exact npm trusted-publisher values the user must enter
- deferred `bun run release`, merge, or publish actions
