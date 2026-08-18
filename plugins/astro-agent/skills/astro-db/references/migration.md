# Migrating off `@astrojs/db`

The [Upgrade to Astro v7](https://docs.astro.build/en/guides/upgrade-to/v7/) guide is the authority on the removal. There is no codemod: this is a port to a different library, not a version bump. Confirm the target library's current API through its own docs before writing schema or queries.

## Inventory

| Site | Action |
|---|---|
| `@astrojs/db` in `package.json` | Remove. Nothing installs in its place unless the replacement needs a client. |
| `db()` in `astro.config.*` integrations | Delete the entry and the import. |
| `db/config.ts` | Port the schema to the target, then delete. |
| `db/seed.ts` | Becomes an explicit script — see [Seeding](#seeding). |
| `astro:db` imports under `src/` | Rewrite against the target client. These are the ones that break the build. |
| `ASTRO_DB_*` in `.env`, CI secrets, host dashboard | Rename — see [Environment](#environment). |
| `astro db push` / `astro db execute` in scripts and workflows | Replace with the target's migration command. |
| Local dev database file under `.astro/` | Disposable. Delete it. |

## Schema

`@astrojs/db` column types papered over what SQLite actually stores. Each one needs a decision now:

| Was | Port note |
|---|---|
| `column.text()` | Direct. |
| `column.number({ primaryKey: true })` | The auto-increment behaviour was implicit. Declare it explicitly in the target. |
| `column.boolean()` | SQLite has no boolean type. The target column is an integer with a boolean mode, or you convert at the call site. |
| `column.date()` | Stored as text or epoch depending on the target's mode. Without a mode, reads come back as strings, not `Date`. |
| `column.json()` | No native JSON column. Use text plus parse, or a real JSON column if the platform has one. |
| `references: () => T.columns.id` | The target's foreign key syntax. SQLite needs foreign key enforcement turned on per connection. |

`optional: true` meant nullable, and the default was NOT NULL. Most libraries default the other way, so the polarity flips: the columns *without* `optional` are the ones needing an explicit not-null.

## Environment

`ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN` were `@astrojs/db`-specific and nothing reads them now. The current Astro Turso guide uses `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` with `@libsql/client`. Rename in `.env`, CI secrets, and the host dashboard together — a half-renamed pair fails at runtime, not at build.

## Seeding

`db/seed.ts` auto-ran on `astro dev` against a database that reset every start. Nothing does either half of that now. Seeding becomes a script you run, against a database that persists between runs. Seed code that assumed empty tables needs a reset step or upserts.

## Queries

- Table types came from the generated `astro:db` module. Drizzle infers them from the schema object instead; raw drivers give you no types, so declare row shapes yourself.
- `.returning()` after an insert worked everywhere under `@astrojs/db`. On other drivers it depends on the database — SQLite and Postgres support `RETURNING`, MySQL does not.
- The `db.select().from(T)` builder shape survives on Drizzle. `node:sqlite` and `@libsql/client` are string SQL with bound parameters.

## Done when

- Searching the repo for `astro:db`, `@astrojs/db`, and `ASTRO_DB_` returns nothing.
- The build passes.
- Migrations and seed run against a fresh database.
- Mutations go through `astro-actions`.
