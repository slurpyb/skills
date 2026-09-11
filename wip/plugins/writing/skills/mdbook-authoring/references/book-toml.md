# book.toml configuration reference

All config lives in `book.toml` at the book root. **Any relative path is taken
relative to the book root**, not the current directory.

## Table of contents
- [[book]](#book) — metadata
- [[rust]](#rust) — Rust edition for code blocks
- [[build]](#build) — build process
- [[output.html]](#outputhtml) — main HTML renderer options
- [Sub-tables](#outputhtml-sub-tables) — print, fold, playground, code, search, redirect
- [Renderers/backends](#renderers-backends) — multiple outputs, markdown renderer
- [Preprocessors](#preprocessors) — ordering, renderer binding, optional
- [Environment variable overrides](#environment-variable-overrides)

## [book]

```toml
[book]
title = "Example book"
authors = ["John Doe", "Jane Doe"]
description = "The example book covers examples."
src = "src"              # source dir (default "src"), root-relative
language = "en"          # sets <html lang>, drives text direction
text-direction = "ltr"   # ltr | rtl; derived from language if omitted
```

- **description** is injected as `<meta>` in each page's `<head>`.

## [rust]

```toml
[rust]
edition = "2015"   # default edition for code blocks: 2015|2018|2021|2024
```

Override per-block with `edition2015`/`edition2018`/`edition2021`/`edition2024`
attributes, e.g. ` ```rust,edition2021 `.

## [build]

```toml
[build]
build-dir = "book"                # output dir (override with --dest-dir)
create-missing = true             # auto-create chapter files in SUMMARY.md
use-default-preprocessors = true  # the built-in links + index preprocessors
extra-watch-dirs = []             # extra dirs watched by serve/watch
```

- **create-missing = false** → build errors if any SUMMARY.md file is missing.
- **use-default-preprocessors = false** disables built-in `links` and `index`,
  but explicitly adding `[preprocessor.links]` re-enables that one.
- **extra-watch-dirs** — rebuild when files outside `src/` change.

## [output.html]

Full set of HTML options:

```toml
[output.html]
theme = "my-theme"                 # dir of theme overrides (selective)
default-theme = "light"            # default scheme in dropdown
preferred-dark-theme = "navy"      # used when browser prefers dark
smart-punctuation = true           # -- → en-dash, --- → em-dash, ... → …, curly quotes
definition-lists = true            # enable definition list syntax
admonitions = true                 # enable > [!NOTE] callouts
mathjax-support = false            # MathJax rendering
additional-css = ["custom.css"]    # loaded after default styles
additional-js = ["custom.js"]      # loaded alongside default JS
no-section-label = false           # hide "1.", "2.1" numbering in TOC
git-repository-url = "https://github.com/me/repo"
git-repository-icon = "fab-github" # fa- regular, fas- solid, fab- brand
edit-url-template = "https://github.com/me/repo/edit/main/guide/{path}"
site-url = "/example-book/"        # REQUIRED if not hosted at domain root
cname = "myproject.rs"             # writes CNAME file for GitHub Pages
input-404 = "not-found.md"         # source for the 404 page (default 404.md)
hash-files = true                  # fingerprint asset filenames for cache-busting
sidebar-header-nav = true          # in-page header nav in sidebar
```

Key gotchas:
- **site-url** — must be set when the book is NOT at the domain root, or the 404
  page and asset links break. When set, use document-relative asset links (no
  leading `/`).
- **git-repository-icon** — non-GitHub alternative: `fas-code-fork`.
- **edit-url-template** — `{path}` is replaced with the file's repo path; adds a
  "Suggest an edit" button.

## [output.html] sub-tables

```toml
[output.html.print]
enable = true       # single-page printable output + print icon
page-break = true   # page break between chapters

[output.html.fold]
enable = false      # collapsible sidebar sections
level = 0           # depth kept open (0 = all closed)

[output.html.playground]
editable = false    # allow editing source in-page
copyable = true     # copy button on snippets
copy-js = true      # ship editor JS
line-numbers = false # needs editable + copy-js
runnable = true     # run button for Rust (set false to disable globally)

[output.html.code]
hidelines = { python = "~" }  # per-language hidden-line prefix

[output.html.search]
enable = true            # requires mdbook compiled with `search` feature
limit-results = 30
teaser-word-count = 30
use-boolean-and = false  # true = all terms must match
boost-title = 2
boost-hierarchy = 1
boost-paragraph = 1
expand = true            # "micro" matches "microwave"
heading-split-level = 3  # results link to headings up to this level
copy-js = true

[output.html.search.chapter]
# per-path search indexing overrides; deeper paths win
"appendix" = { enable = false }
"appendix/glossary.md" = { enable = true }

[output.html.redirect]
# create redirect stub at key → value (key = absolute path from build dir)
"/old-page.html" = "new-page.html"
"/moved.html#old-frag" = "new.html#new-frag"  # fragment redirects use JS
```

## Renderers (backends)

Built-in: `html` (default when no `[output]` table is defined) and `markdown`
(outputs post-preprocessor markdown, useful for debugging — disabled by default).

```toml
[output.markdown]   # enable markdown renderer (no other options)

[output.wordcount]               # runs `mdbook-wordcount` executable
command = "python wordcount.py"  # override invoked program
optional = true                  # missing backend → warning, not error
ignores = ["Example Chapter"]    # backend-specific keys allowed
```

- Defining any `[output.*]` table disables the default `html` — re-add
  `[output.html]` to keep HTML output.
- With multiple backends, each writes to `book/<name>/` instead of `book/`.

## Preprocessors

Built-in (run by default): `links` (expands `{{#include}}`, `{{#playground}}`,
`{{#rustdoc_include}}`) and `index` (`README.md` → `index.md`).

```toml
[preprocessor.example]               # runs `mdbook-example`
command = "python preproc.py"        # override invoked program
optional = true                      # missing → warning not error
renderers = ["html"]                 # only run for these renderers
some-extra-feature = true            # preprocessor-specific config
after = ["links"]                    # run after these preprocessors
before = ["other"]                   # run before these
```

- Ordering via `before`/`after`; same priority → sorted by name; loops error.
- Run `after = ["links"]` if your preprocessor must see `{{#include}}`d content.

## Environment variable overrides

Any config key is overridable via `MDBOOK_`-prefixed env vars. Build the name by
stripping `MDBOOK_`, lowercasing, `__` → key nesting, `_` → `-`. Value is parsed
as JSON, falling back to a string.

```bash
MDBOOK_BOOK__TITLE="My Title"            # → book.title
MDBOOK_BOOK__TEXT_DIRECTION=rtl          # → book.text-direction
MDBOOK_OUTPUT__HTML__SITE_URL="/book/"   # → output.html.site-url
export MDBOOK_BOOK='{"title":"X","authors":["Y"]}'  # JSON value
mdbook build
```

Useful in CI where editing `book.toml` before the build is awkward.
