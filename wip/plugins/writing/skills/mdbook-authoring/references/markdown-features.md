# Markdown features

mdBook parses [CommonMark](https://commonmark.org/) (pulldown-cmark) plus the
extensions and mdBook-specific helpers below.

## CommonMark extensions

All enabled by default; toggle in `[output.html]` (see book-toml.md).

- **Strikethrough**: `~~text~~` (one or two tildes).
- **Footnotes**: reference `[^note]` in text, define `[^note]: text` anywhere.
  Auto-numbered by order of definition.
- **Tables** (GFM): pipes + dashes.
  ```
  | Header1 | Header2 |
  |---------|---------|
  | abc     | def     |
  ```
- **Task lists**: `- [x] done` / `- [ ] todo`.
- **Smart punctuation**: `--`→en-dash, `---`→em-dash, `...`→…, `"`/`'`→curly.
  Disable with `smart-punctuation = false`.
- **Heading attributes**: `# Heading { #custom-id .class1 .class2 }` — stable IDs
  across text edits; space-separated.
- **Definition lists** (good for glossaries):
  ```
  term A
    : Definition, can span
      multiple lines.
  term B
    : First definition.
    : Second definition.
  ```
- **Admonitions** — blockquote with a tag on the first line:
  ```
  > [!NOTE]
  > General info.
  ```
  Tags: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`.

## Links

- `.md` links → `.html` automatically; prefer `.md` so files also work on
  GitHub/GitLab. `README.md` → `index.html`.
- Heading fragments: `mdbook.md#text-and-paragraphs` (lowercase, spaces→dashes).

## Hiding code lines

Prefix lines to collapse them behind an expand toggle. For Rust, `# ` (hash +
space) hides a line; `##` escapes a literal leading `#` (rustdoc convention).

````
```rust
# fn main() {
    let x = 5;
    println!("{x}");
# }
```
````

Custom prefixes for other languages via `[output.html.code] hidelines`, or
per-block: ` ```python,hidelines=!!! ` then prefix lines with `!!!`.

## Including files (links preprocessor)

Path is relative to the current source file. Wrap in a code fence to show
contents verbatim (otherwise mdBook interprets the include as markdown).

````
```
{{#include file.rs}}
```
````

Partial includes:
```
{{#include file.rs:2}}      line 2 only
{{#include file.rs::10}}     lines 1–10
{{#include file.rs:2:}}      line 2 → end
{{#include file.rs:2:10}}    lines 2–10
```

### Anchors (robust against edits)

Mark a region in the source file with comment lines matching
`ANCHOR: name` / `ANCHOR_END: name`, then include by name. Anchor comment lines
inside the region are stripped from output.

```rust
// ANCHOR: component
struct Paddle { hello: f32 }
// ANCHOR_END: component
```
````
```rust,no_run,noplayground
{{#include file.rs:component}}
```
````

### rustdoc_include

Like `include`, but lines outside the selected range/anchor are kept yet
hidden with `#` — so the reader can expand to the full example and `mdbook test`
compiles the whole file.

```
{{#rustdoc_include file.rs:2}}
```

## Runnable Rust + playground

` ```rust ` blocks get a play button (sends code to play.rust-lang.org). If
there's no `main`, the code is auto-wrapped in one.

Insert a whole runnable file: `{{#playground file.rs}}` (extra words become code
block attributes, e.g. `{{#playground example.rs editable}}`).

### Rust code block attributes

Comma/space/tab-separated after `rust`. Shared with rustdoc, used by `mdbook test`:

- `editable` — enable the in-page editor.
- `noplayground` — hide play button, still tested.
- `mdbook-runnable` — force play button (pair with `ignore` for runnable-but-untested).
- `ignore` — not tested, no play button, still syntax-highlighted.
- `should_panic` — must panic when run.
- `no_run` — compiled but not run; no play button.
- `compile_fail` — must fail to compile.
- `edition2015`/`edition2018`/`edition2021`/`edition2024` — force an edition.

## Other helpers

- **Per-page `<title>`**: `{{#title My Title}}` near the top of a chapter (lets
  the browser title differ from the sidebar entry).
- **Floating images**: `<img class="right" src="...">` (also `class="left"`).
- **Hidden HTML**: `<div class="hidden">...</div>` is not shown.
- **Font Awesome 6 icons** (regular/solid/brands, free set): `<i class="fa-solid fa-print"></i>`.
- **MathJax**: set `[output.html] mathjax-support = true`, then use `\\(`…`\\)`
  inline and `\\[`…`\\]` block math.
