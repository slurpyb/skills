---
description: Take a file you're working on + a short description and produce the Plop files for it — the .hbs template(s) and the generator. Asks to clarify ambiguity. Never installs Plop or touches the project setup.
argument-hint: <file-path> <short description of what should vary>
allowed-tools: Read, Write, Glob, Grep, AskUserQuestion
---

## Task

Take a file the user is working on and produce the **Plop files** for it: the `.hbs` template(s) and a generator (prompts + actions). Parse `$ARGUMENTS` — first whitespace token = the file path (`$1`); the remainder = a free-text description of what should vary. **Read the file first.** If `$1` is missing or unreadable, ask for a valid path and stop.

**Scope — produce Plop artifacts only.** Do NOT install Plop, edit the target's `package.json`, add npm scripts, or otherwise modify the project's setup. Whether and how Plop runs is the user's concern, not this command's.

## 1. Decide what varies

From the file + description: the **primary entity** and every casing of its token; any **extra variables** the description implies; whether the **filename** encodes the entity (`Button.tsx` → `{{pascalCase name}}.tsx.hbs`); single file (`add`) vs a set (`addMany`).

## 2. Ask when ambiguous — use the `AskUserQuestion` tool

If anything below is genuinely unclear, ask with concrete options (recommended first); skip what's obvious, never produce on an unresolved ambiguity:

- which token is the variable, when several are plausible
- variable vs fixed values (is `"MIT"` a constant or a prompt?)
- the source-of-truth casing for the `name` prompt
- scope & destination path (`add` vs `addMany`)
- the full prompt set when the description is vague

## 3. Write the template(s)

Map each variable token to the helper matching its **observed casing**, keep everything else **byte-for-byte**, and templatize the filename if it carries the entity.

| Source casing | Helper |
|---|---|
| `PascalCase` | `{{pascalCase name}}` |
| `camelCase` | `{{camelCase name}}` |
| `kebab-case` | `{{dashCase name}}` |
| `snake_case` | `{{snakeCase name}}` |
| `CONSTANT_CASE` | `{{constantCase name}}` |
| `Title Case` | `{{titleCase name}}` |
| `dot.case` / `path/case` | `{{dotCase name}}` / `{{pathCase name}}` |

Save as `<name>.hbs` — into an existing templates dir if the repo has one, else `plop-templates/`; report the path.

**Escaping (Plop uses stock Handlebars — `{{ }}` HTML-escapes `& < > " '`):**
- bare identifier → `{{ }}`
- inside a string, JSX text, or next to `< > & " '` → triple `{{{ }}}`
- JSON value → `{{{ json x }}}` (free text breaks under plain double/triple); this needs a `json` helper, which **isn't built in** — register it in the generator (Step 4).

Deeper edge cases (`modify` needs `/g`; `append` silently no-ops on a missing pattern; `addMany` skips dotfiles without `globOptions:{dot:true}`): see the **plop-code-generator** skill, `references/gotchas.md`.

## 4. Produce the generator

Emit the wiring as Plop files (this is the point — not installing Plop):

- **prompts** — one per variable, with a `validate` where it obviously helps (non-empty name).
- **action** — `add`/`addMany` with the `path`/`destination` name-templatized + `templateFile` pointing at the new template (path relative to the plopfile).
- **setGenerator** — if a plopfile already exists, show/append the generator block to it; otherwise write a new plopfile (ESM `export default` by default; CJS if `package.json` says so) containing just this generator, plus the 3-line `json` helper **only if** a template above uses it:
  ```js
  plop.setHelper("json", (v) => JSON.stringify(v, null, 2));
  ```

Report every file you wrote.
