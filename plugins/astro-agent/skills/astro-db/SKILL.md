---
name: astro-db
description: Migrates Astro projects off the removed `@astrojs/db` package and wires up a replacement SQL database. Use when a project still imports `astro:db`, or when choosing and querying a SQL database on Astro 7 — node:sqlite, Drizzle, or a platform database.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro DB

Astro 7 ships no database. `@astrojs/db` was removed and nothing in core replaced it — `astro:db`, `defineDb`, `defineTable`, and the `astro db` CLI do not exist in Astro 7, so a project that still imports them fails to build.

Reading files and remote APIs is skill `astro-content`. This skill is SQL.

## Work the project

1. Search the repo for `astro:db`, `@astrojs/db`, `ASTRO_DB_`, and `astro db`. On a hit, load [migration.md](references/migration.md) and walk its inventory table. Done when each site is listed, or the search comes back empty.
2. Read `package.json` for the installed Astro version and the adapter. Done when you can name both.
3. Load `consult-astro-docs` for the current v7 upgrade guide and the backend guide for the database you land on. Done when you have that database's current client setup.
4. Port every site from step 1. Done when those searches return nothing and the build passes.

## Choosing a replacement

Pick by where the app runs, not by preference:

| Replacement | When |
|---|---|
| `node:sqlite` | Node adapter with a local SQLite file. Built into Node 22.5+, so no dependency. |
| Drizzle ORM | Keeps the schema-plus-typed-query shape `@astrojs/db` had. Closest port for a large existing schema. |
| Platform database | The host provides it — Turso, D1, Neon, PlanetScale, Supabase. Follow `astro-deployment` for the binding. |

Astro docs carry a backend guide per platform. Query it through `consult-astro-docs` rather than writing a client from memory.

## Reading and writing

Query from server-rendered pages and endpoints. A database call in a prerendered route runs once at build time, not per request.

Route mutations through `astro-actions` so validation and typed errors stay in one place.
