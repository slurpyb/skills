---
name: astro-actions
description: Builds type-safe Astro server functions with `defineAction`. Use when handling an HTML form POST, calling a server mutation from client JavaScript, or choosing between an action and an API endpoint.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro actions

## Work the project

1. Read `src/actions/` and `astro.config.*`. Done when you can say whether a `server` object already exists and whether the project has an adapter.
2. Load `consult-astro-docs` for `defineAction`, the `input` validators, and each `astro:actions` helper this task calls. Done when you have the current signature for every one of them.
3. Follow `astro-conventions` for scaffold and `astro add` when the adapter is missing. Done when `astro.config.*` names an adapter and every route calling an action renders on demand — see `astro-7`.

## Actions or an endpoint

Reach for an action when the client sends data and expects a typed result: form submissions, create/update/delete mutations, anything you would otherwise hand-write a `fetch()` for.

Keep an API endpoint in `src/pages/` for responses that are not action results — files and binaries, webhook receivers, and REST surfaces consumed by third parties.

## Shape

Every action is reachable from the `server` object exported by `src/actions/index.ts`. Group related ones in nested objects, or define them in sibling modules and re-export from `index.ts`; the nesting is the call path (`actions.user.create()`).

`input` takes a Zod validator from `astro/zod` — Astro's own Zod 4, so `z.email()` rather than `z.string().email()`. Failed validation returns a `BAD_REQUEST` error and the handler never runs. Omit `input` to receive raw `unknown` (JSON) or `FormData` (form).

The handler's second argument carries `locals`, `cookies`, `request`, and `session`. Authorize inside the handler: every action is a public endpoint at `/_actions/<name>`.

## Calling

| From | Call |
|---|---|
| Client script or framework component | `actions.name(input)` → `{ data, error }`. See `astro-islands`. |
| `.astro` frontmatter or an endpoint | `Astro.callAction(actions.name, input)`, or `context.callAction(...)` |
| HTML `<form>` | `accept: 'form'` plus `action={actions.name}`. Load [forms.md](references/forms.md). |

`.orThrow()` returns `data` directly and throws instead of handing back an `error`.

## Errors

Throw `ActionError({ code, message })` for expected failures; `code` is an HTTP-aligned name such as `UNAUTHORIZED` or `NOT_FOUND`. On the client, narrow with `isActionError(error)` — one argument — then branch on `error.code`.
