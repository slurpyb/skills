# Writing preprocessors & backends

mdBook is extended by **external programs** auto-discovered from `book.toml`.
Adding `[preprocessor.foo]` makes mdBook invoke `mdbook-foo`; adding
`[output.bar]` invokes `mdbook-bar`. Override the invoked program with a
`command` field. Because everything is stdin/stdout JSON, plugins can be written
in any language.

## Preprocessor protocol

A preprocessor runs after the book loads and before rendering, mutating the
book. mdBook calls the program **twice**:

1. **Supports check** — argv `supports <renderer>`. Exit `0` if this
   preprocessor supports that renderer, non-zero if not.
2. **Run** — JSON array `[context, book]` is piped to **stdin**, where `context`
   is `PreprocessorContext` (root, config, renderer, mdbook_version) and `book`
   holds the chapters. The program writes the modified `book` JSON to **stdout**.

### Book JSON shape (for non-Rust plugins)

```json
[
  { "root": "/path/to/book",
    "config": { "book": {...}, "preprocessor": {...} },
    "renderer": "html",
    "mdbook_version": "0.4.21" },
  { "items": [
      { "Chapter": {
          "name": "Chapter 1",
          "content": "# Chapter 1\n",
          "number": [1],
          "sub_items": [],
          "path": "chapter_1.md",
          "source_path": "chapter_1.md",
          "parent_names": [] } } ] }
]
```

`chapter.content` is the raw markdown string to read/rewrite.

### Python preprocessor (complete)

```python
import json
import sys

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == "supports":
        sys.exit(0)  # support every renderer

    context, book = json.load(sys.stdin)
    book['items'][0]['Chapter']['content'] = '# Hello'
    print(json.dumps(book))
```

`book.toml`:
```toml
[preprocessor.foo]
command = "python preproc.py"
```

### Rust preprocessor (no-op skeleton)

Pull in `mdbook-preprocessor`; implement the `Preprocessor` trait and a thin
binary that does the supports/run handshake. Use
`mdbook_preprocessor::parse_input(stdin)` to deserialize and `serde_json` to
write the result. Iterate chapters with `Book::for_each_chapter_mut`.

```rust
use mdbook_preprocessor::book::Book;
use mdbook_preprocessor::errors::Result;
use mdbook_preprocessor::{Preprocessor, PreprocessorContext};
use std::io;

struct Nop;

impl Preprocessor for Nop {
    fn name(&self) -> &str { "nop-preprocessor" }
    fn run(&self, _ctx: &PreprocessorContext, book: Book) -> Result<Book> {
        Ok(book) // mutate book.for_each_chapter_mut(...) here
    }
    fn supports_renderer(&self, renderer: &str) -> Result<bool> {
        Ok(renderer != "not-supported")
    }
}

fn main() {
    // argv "supports <renderer>" → exit 0/1 via pre.supports_renderer
    // else: parse_input(stdin) → pre.run → serde_json::to_writer(stdout)
    let pre = Nop;
    let mut args = std::env::args().skip(1);
    if let Some("supports") = args.next().as_deref() {
        let r = args.next().unwrap_or_default();
        std::process::exit(if pre.supports_renderer(&r).unwrap() { 0 } else { 1 });
    }
    let (ctx, book) = mdbook_preprocessor::parse_input(io::stdin()).unwrap();
    let out = pre.run(&ctx, book).unwrap();
    serde_json::to_writer(io::stdout(), &out).unwrap();
}
```

Read config in `run` via `ctx.config.get::<T>("preprocessor.foo.key")`. To parse
markdown structurally rather than string-munge, use the `mdbook-markdown` crate
(exposes `pulldown-cmark`) and `pulldown-cmark-to-cmark` to serialize events
back to markdown. Starting points: mdBook repo `examples/nop-preprocessor.rs`
and `examples/remove-emphasis/`.

### Ordering & version

- Control run order with `before`/`after` in `book.toml` (see book-toml.md). Run
  `after = ["links"]` if you must see `{{#include}}`d content.
- Compare `ctx.mdbook_version` against `mdbook_preprocessor::MDBOOK_VERSION` and
  warn on mismatch.

## Backends (renderers)

A backend produces output. Enable with an `[output.<name>]` table → mdBook runs
`mdbook-<name>`. Notes:

- Defining any `[output.*]` disables the default `html`; re-add `[output.html]`
  to keep it.
- Multiple backends each write to `book/<name>/` instead of `book/`.
- `command` overrides the invoked program; `optional = true` demotes a missing
  backend from error to warning.
- Backend-specific config goes as extra keys in its table (e.g. `ignores = [...]`).

For the backend authoring walkthrough (a word-count example), see the mdBook
"Alternative backends" developer chapter:
https://rust-lang.github.io/mdBook/for_developers/backends.html

Community plugins are listed on the
[Third-party plugins wiki](https://github.com/rust-lang/mdBook/wiki/Third-party-plugins).
