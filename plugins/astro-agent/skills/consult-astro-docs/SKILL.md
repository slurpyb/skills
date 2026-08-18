---
name: consult-astro-docs
description: Look up current Astro documentation before writing Astro, Starlight, or Content Collections code. Use when working on .astro files, astro.config, islands, adapters, integrations, sessions, actions, or Astro APIs.
---

# Consult Astro docs

Astro APIs move. Do not trust training data for current signatures, config keys, or "experimental" status.

## Do this first

Query the bundled **astro-docs** MCP (`search_astro_docs`) before generating or changing Astro code.

Use it when any of these are true:

- The task touches `.astro` files, `astro.config.*`, adapters, or integrations
- The feature shipped or changed recently (sessions, actions, Content Collections, view transitions)
- You are unsure whether a flag is still experimental
- A user reports the generated API does not match their installed Astro version

## After the lookup

- Quote the current pattern, not an older one
- Prefer `astro add <integration>` for official integrations
- Prefer `npm create astro@latest` (or the project's package manager) over a from-scratch scaffold
