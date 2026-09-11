---
name: mdbook-authoring
description: |
  Create, configure, build, and deploy documentation books with mdBook (Rust
  Markdown book generator). Use when: (1) starting/structuring an mdBook book
  (SUMMARY.md, chapters, parts), (2) configuring book.toml (themes, search,
  playground, renderers, preprocessors), (3) using mdBook markdown features
  (file includes, anchors, runnable Rust, admonitions, hidelines), (4) running
  the mdbook CLI (init/build/serve/test), (5) setting up CI/CD deployment to
  GitHub Pages, or (6) writing custom preprocessors/backends.
---

# mdBook authoring

mdBook builds an HTML book from a tree of CommonMark `.md` files. A book is
defined by two things: `book.toml` (config) at the root and `src/SUMMARY.md`
(table of contents) which lists every chapter. **Without `SUMMARY.md` there is
no book** — it drives structure, order, hierarchy, and which files exist.

## Project layout

```
my-book/
├── book.toml          # config (root-relative paths)
├── src/
│   ├── SUMMARY.md      # table of contents — REQUIRED
│   ├── README.md       # rendered as index.html (prefix/intro chapter)
│   └── chapter_1.md
└── book/               # generated output (gitignore this)
```

## Quick start

```bash
mdbook init my-book          # scaffold (--theme for editable theme, --ignore git for .gitignore)
cd my-book
mdbook serve --open          # live-reload preview at localhost:3000
mdbook build                 # render to ./book
mdbook test                  # compile + run Rust code blocks
```

To start fast, copy `assets/starter-book/` instead of `mdbook init` — it has a
working `book.toml`, `SUMMARY.md`, and two chapters ready to edit.

## Core workflow

1. **Structure first** — edit `src/SUMMARY.md`. Missing chapter files are
   auto-created on build (unless `build.create-missing = false`). See
   [references/cli.md](references/cli.md) for SUMMARY.md syntax rules.
2. **Write chapters** — plain CommonMark plus mdBook extensions (admonitions,
   includes, runnable Rust). See [references/markdown-features.md](references/markdown-features.md).
3. **Configure** — tune `book.toml` (theme, search, git links, redirects). See
   [references/book-toml.md](references/book-toml.md).
4. **Preview** — `mdbook serve` watches `src/` and rebuilds on change.
5. **Deploy** — `mdbook build` then publish `book/`. CI recipe in
   `assets/deploy-github-pages.yml`.

## SUMMARY.md essentials

Format is **strict** — anything not matching the spec is ignored or errors.

```markdown
# Summary

[Introduction](README.md)          <!-- prefix chapter: unnumbered, no nesting -->

# Part Title                        <!-- h1 = part header, unclickable text -->

- [First Chapter](first.md)         <!-- numbered; use - OR * consistently -->
  - [Sub Chapter](sub.md)           <!-- nest with indentation -->
- [Draft Chapter]()                 <!-- no path = draft, disabled link -->

---                                 <!-- 3+ dashes = separator line -->

[Suffix Chapter](appendix.md)       <!-- unnumbered, after numbered chapters -->
```

Rules: prefix chapters come before numbered ones and can't nest; suffix chapters
come after. Links to `README.md` → `index.html`; `.md` links → `.html`.

## book.toml minimal

```toml
[book]
title = "My Book"
authors = ["Jane Doe"]
language = "en"

[output.html]
git-repository-url = "https://github.com/me/my-book"
```

Defining any `[output.*]` table disables the default HTML output — re-add
`[output.html]` to keep it. Full option reference:
[references/book-toml.md](references/book-toml.md).

## Common tasks

- **Include a code file**: `` {{#include file.rs}} `` (also `:2:10` line ranges
  or `:anchor` named regions). See [references/markdown-features.md](references/markdown-features.md).
- **Runnable Rust**: ` ```rust ` blocks auto-get a play button (Rust Playground).
  Disable with `noplayground` or globally via `[output.html.playground] runnable = false`.
- **Callouts**: `> [!NOTE]` / `[!TIP]` / `[!IMPORTANT]` / `[!WARNING]` / `[!CAUTION]`.
- **Per-page title**: `` {{#title My Title}} `` near top of chapter.
- **Override config from CI/env**: `MDBOOK_OUTPUT__HTML__SITE_URL=/book/` —
  `__` nests, `_` → `-`, value parsed as JSON then string.

## Extending mdBook

- **Preprocessors** mutate markdown before rendering; **backends/renderers**
  produce output. Both are external programs auto-discovered via `book.toml`
  tables (`[preprocessor.foo]` → runs `mdbook-foo`). They speak a simple
  stdin/stdout JSON protocol — implementable in any language. Protocol, Rust,
  and Python examples: [references/plugins.md](references/plugins.md).

## When you need depth

- All `book.toml` tables/options → [references/book-toml.md](references/book-toml.md)
- Markdown extensions + includes/anchors/playground → [references/markdown-features.md](references/markdown-features.md)
- Every CLI command + flags + SUMMARY.md spec → [references/cli.md](references/cli.md)
- Writing preprocessors/backends → [references/plugins.md](references/plugins.md)
