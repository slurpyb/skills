# CLI commands & SUMMARY.md

Run `mdbook help` or `mdbook <cmd> --help` for the authoritative flag list. Most
commands accept a directory argument to use as the book root instead of the cwd.

## SUMMARY.md specification

`src/SUMMARY.md` is the table of contents and is **required** — it defines which
chapters exist, their order, and hierarchy. Formatting is strict; non-conforming
lines are ignored or cause build errors.

Element types (in order they may appear):

1. **Title** — optional `# Summary` h1, ignored by the parser.
2. **Prefix chapters** — unnumbered links before numbered chapters. Cannot nest;
   must be root-level; can't appear after numbered chapters.
   `[Introduction](README.md)`
3. **Part title** — an h1 (`# Part Name`) between chapter groups; rendered as
   unclickable section label. Only h1 works; other heading levels are ignored.
4. **Numbered chapters** — list items, nestable by indentation. Use `-` OR `*`
   consistently (don't mix). A `[Title]()` with no path is a **draft** (disabled
   link, no file).
5. **Suffix chapters** — unnumbered links after numbered chapters.
6. **Separators** — a line of 3+ dashes (`---`) renders a divider.

Full example:
```markdown
# Summary

[Introduction](README.md)

# User Guide

- [Installation](guide/installation.md)
- [Reading Books](guide/reading.md)
  - [Sub Topic](guide/sub.md)
- [Draft Chapter]()

# Reference

- [Config](format/config.md)

---

[Contributors](misc/contributors.md)
```

## init

Scaffold a new book with minimal boilerplate.

```bash
mdbook init [dir]
mdbook init --theme        # copy the default theme into theme/ for customizing
mdbook init --ignore git   # also create a .gitignore (ignores build-dir)
```

Prompts to create a `.gitignore` and set a title if not given.

## build

Render the book once.

```bash
mdbook build [dir]
mdbook build -d, --dest-dir <path>   # override output dir (default build.build-dir)
mdbook build -o, --open              # open in browser after building
```

## watch

Rebuild on any source change (no server).

```bash
mdbook watch [dir]
mdbook watch -o, --open
mdbook watch -d, --dest-dir <path>
```

## serve

Preview over HTTP with live reload (websocket-triggered). For testing HTML
output only — not a production server. Watches `src/`, including re-creating
deleted files still listed in `SUMMARY.md`.

```bash
mdbook serve [dir]
mdbook serve -p, --port <3000>       # default 3000
mdbook serve -n, --hostname <host>   # default localhost
mdbook serve -o, --open
mdbook serve -d, --dest-dir <path>
mdbook serve --watcher <poll|native> # poll (default, scans every 1s) or OS-native
```

`serve`/`watch` skip files matching the book root's `.gitignore` (only that one
file — not `$HOME/.gitignore` or parent dirs).

## test

Compile and run Rust code blocks (validates examples don't rot). Only Rust is
supported. rustdoc rules: blocks with `ignore` or a non-Rust language are
skipped; a block with **no language** IS tested (common surprise).

```bash
mdbook test [dir]
mdbook test -L, --library-path <dir>   # rustdoc dependency search path
                                       # e.g. target/debug/deps/ ; repeat or comma-list
mdbook test -c, --chapter <name|path>  # test a single chapter
```

Example with a project's built dependencies:
```bash
mdbook test my-book -L target/debug/deps/
```

## clean

Delete the rendered output directory.

```bash
mdbook clean [dir]
mdbook clean -d, --dest-dir <path>
```

## completions

Generate shell completion scripts.

```bash
mdbook completions <bash|zsh|fish|powershell|elvish>
# e.g. mdbook completions zsh > ~/.zfunc/_mdbook
```
