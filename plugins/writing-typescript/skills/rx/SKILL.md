---
name: rx
description: Implements creationix/rx embedded storage with RX text, RXB binary, direct-access proxies, indexes, external refs, cursors, conversion, and inspection. Use when large, mostly immutable JSON-shaped artifacts are encoded once and read sparsely with low allocation; not for RxJS or reactive programming.
---

# RX

Use [`@creationix/rx`](https://github.com/creationix/rx) as an embedded data store when full JSON parsing or its object graph is the measured bottleneck.

## Workflow

1. Qualify the workload against the decision table. Compare RX with alternatives before implementing custom deduplication, indexes, or lazy readers. **Complete when:** RX or an alternative is selected for an explicit access pattern.
2. Inspect the installed package and its documentation, then choose one API pair from the surface table; upstream `main` may differ. **Complete when:** the format, input type, writer, and reader match the installed version.
3. Encode once, then keep runtime access read-only and limited to required paths. **Complete when:** access is selective and does not traverse the whole document.
4. Carry encoding options across the boundary: opening must receive the same external `refs`, and indexes must follow measured lookup needs. **Complete when:** reader options are compatible with the encoded artifact.
5. Benchmark representative data before committing to RX. **Complete when:** encoded size, lookup latency, and allocations are compared with the current approach; compressed transfer size is included when relevant.

## Decision reference

Prefer RX when the data is JSON-shaped, mostly immutable, encoded once, and read selectively.

| Dominant requirement | Better default |
| --- | --- |
| Small document or frequent full traversal | JSON |
| Mutable or write-heavy data | A database |
| Tabular data | SQLite |
| Fixed schema and cross-language contracts | Protobuf or another schema-first format |
| Minimum compressed transfer size | JSON or another format plus gzip/zstd; measure |

| Need | RX surface |
| --- | --- |
| Copy-pasteable RX text | `stringify(value)` / `parse(text)` |
| RX text as `Uint8Array`, without string conversion | `encode(value)` / `open(bytes)` |
| Smaller, faster binary RXB | `rxbEncode(value)` / `rxbOpen(bytes)` |
| Encoded structure rather than decoded values | `inspect(bytes)` or `rx inspect` |
| Conversion or path-level inspection | `rx convert`, `rx show`, or `rx FILE [SEGMENT...]` |
| Allocation-sensitive traversal | [cursor API](https://github.com/creationix/rx/blob/main/docs/cursor-api.md); use `rxb`-prefixed equivalents for RXB |

`parse`, `open`, and `rxbOpen` return read-only proxies. Broad operations such as spread, `Object.entries`, and `JSON.stringify` traverse values and can erase the sparse-read advantage.

## Encode once, read sparsely

```ts
import { readFileSync, writeFileSync } from "node:fs";
import { encode, open } from "@creationix/rx";

type RouteManifest = {
  readonly routes: Readonly<Record<string, { readonly title: string }>>;
};

// Build step
const source = JSON.parse(
  readFileSync("routes.json", "utf8"),
) as RouteManifest;
writeFileSync("routes.rx", encode(source));

// Runtime: decode only the requested path.
const routes = open(readFileSync("routes.rx")) as RouteManifest;
const title = routes.routes["/docs"].title;
```
