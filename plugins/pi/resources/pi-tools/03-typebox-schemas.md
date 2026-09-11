# Parameter schemas — a TypeBox cookbook

The `parameters` field is a TypeBox schema. TypeBox is both a runtime JSON-Schema builder *and* a static type source: pi validates the model's arguments against the schema at call time, and `Static<typeof schema>` gives you the matching TypeScript type for `params` inside `execute`. One definition, both guarantees.

**Import:** `import { Type } from "typebox";` — the package is `typebox`, not `@sinclair/typebox`. Static type helper: `import { type Static } from "typebox";`.

Every tool's top-level `parameters` should be a `Type.Object({...})` (or `Type.Object({})` for no args), because tool calls are keyed argument objects.

## The building blocks

```ts
Type.String()                 // string
Type.Number()                 // number
Type.Integer()                // integer
Type.Boolean()                // boolean
Type.Null()                   // null
Type.Literal("get")           // the exact string "get"
Type.Array(Type.String())     // string[]
Type.Object({ ... })          // an object with named fields
Type.Record(Type.String(), Type.Number())  // { [k: string]: number }
Type.Any()                    // avoid — see pitfalls
Type.Unknown()                // prefer this over Any at a boundary
```

## Descriptions are not optional in practice

The model reads field descriptions to fill arguments correctly. Always describe non-obvious fields:

```ts
Type.Object({
  query: Type.String({ description: "Free-text search query. Natural language is fine." }),
  limit: Type.Integer({ description: "Max results to return.", default: 10, minimum: 1, maximum: 50 }),
});
```

`default`, `minimum`, `maximum`, `minLength`, `maxLength`, `pattern` are all accepted as schema options and are surfaced to the model as JSON-Schema constraints.

## Optional vs. required fields

By default every key in `Type.Object` is **required**. Wrap a value in `Type.Optional(...)` to make it optional:

```ts
Type.Object({
  path: Type.String(),                                  // required
  pretty: Type.Optional(Type.Boolean()),                // optional -> boolean | undefined
});
```

Prefer a real optional over "required but allow empty string". Push absence to the perimeter — model it once, here, and let the rest of `execute` trust the type.

## Enumerated choices — `Type.Union` of literals

When a field has a fixed set of valid values, use a union of literals. This both constrains the model and narrows the type:

```ts
parameters: Type.Object({
  action: Type.Union([Type.Literal("get"), Type.Literal("list"), Type.Literal("search")], {
    description: "Which operation to perform.",
  }),
});
// params.action is "get" | "list" | "search"
```

Inside `execute`, switch on it exhaustively (see [12-patterns-and-pitfalls.md](12-patterns-and-pitfalls.md) for the `never` check).

> Prefer literal unions over a free `Type.String()` *only when the set really is fixed and known at author time*. If valid values are derived at runtime (e.g. token names that depend on the project), keep it `Type.String()` and describe the space in words — don't bake a stale enum into the schema.

## Arrays and nested objects

```ts
parameters: Type.Object({
  files: Type.Array(Type.String(), { description: "Paths to process.", minItems: 1 }),
  options: Type.Optional(
    Type.Object({
      recursive: Type.Boolean({ default: false }),
      exclude: Type.Array(Type.String(), { default: [] }),
    }),
  ),
});
```

## Records / open maps

When keys aren't known ahead of time:

```ts
Type.Record(Type.String(), Type.String(), { description: "Header name to value." });
// { [key: string]: string }
```

## Deriving the static type

Pull the TS type out of a schema with `Static`, so you can share it with tests and helpers:

```ts
import { Type, type Static } from "typebox";

const Params = Type.Object({
  query: Type.String(),
  limit: Type.Optional(Type.Integer({ default: 10 })),
});
type Params = Static<typeof Params>;   // { query: string; limit?: number }

defineTool({
  name: "search",
  label: "Search",
  description: "...",
  parameters: Params,
  async execute(_id, params: Params) {
    // params.query: string, params.limit: number | undefined
  },
});
```

Defining the schema as a named `const` (rather than inline) is the recommended habit: you get a reusable `Static` type for your tests, and `defineTool`'s generics infer cleanly. The `defineTool` helper exists precisely to preserve this inference when a tool is assigned to a variable or pushed into an array — without it, contextual typing widens params to `unknown`.

## A no-argument tool

```ts
parameters: Type.Object({}),
async execute() { /* params is {} */ }
```

## Pitfalls

- **Don't use `Type.Any()`** for a parameter. It tells the model nothing and gives you no type safety. If a value is genuinely freeform, `Type.Unknown()` plus a runtime narrow inside `execute`, or model the real shape.
- **Don't over-constrain.** If you set `pattern`/`enum` too tightly, the model's reasonable arguments get rejected at validation and the call fails. Start permissive, tighten once you see real misuse.
- **Keep top-level flat where you can.** Deeply nested required objects are harder for the model to fill correctly than a few flat fields.
