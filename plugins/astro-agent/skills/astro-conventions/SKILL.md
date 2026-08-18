---
name: astro-conventions
description: Project rules for building Astro sites with coding agents. Use when scaffolding, adding integrations, running astro dev, or choosing how to install packages in an Astro repo.
---

# Astro conventions

These are the rules. Follow them unless the project already does otherwise.

## Scaffold

Start from an Astro template. Use `npm create astro@latest` (or the repo's package manager) with a template. Do not invent a from-scratch app layout.

## Integrations

Official integrations go through `astro add` (`astro add tailwind`, `astro add react`). For everything else, install with the project's package manager. Do not hand-edit `package.json` to add dependencies.

## APIs

Verify against current docs (skill `consult-astro-docs`) before using sessions, actions, Content Collections, or anything that used to be experimental.

## Dev server

`astro dev` and `astro preview` start in the background when an AI coding agent is detected (`astro@7`). A lock file is written under `.astro/`. Check `/_astro/status` for `{ "ok": true }` before assuming the server is ready. Opt out with `ASTRO_DEV_BACKGROUND=0` or `ASTRO_PREVIEW_BACKGROUND=0` only if the user asks.
