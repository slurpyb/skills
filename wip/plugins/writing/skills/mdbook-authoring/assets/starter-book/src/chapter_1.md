# Getting Started

This is a numbered chapter. Below are a few mdBook features to try.

## A runnable Rust example

```rust
fn main() {
    println!("Hello, mdBook!");
}
```

## An admonition

> [!NOTE]
> Admonitions are blockquotes tagged with `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`,
> `[!WARNING]`, or `[!CAUTION]`.

## Including a file

Code can be pulled from a source file so it never drifts:

```rust
{{#include example.rs}}
```
