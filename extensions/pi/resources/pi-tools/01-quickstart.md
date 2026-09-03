# Quickstart — your first pi tool

Goal: write a tool, load it, watch the agent call it. No project scaffolding, no build step.

## 1. Write the file

Create `wordcount.ts` anywhere:

```ts
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const wordcount = defineTool({
  name: "wordcount",
  label: "Word count",
  description:
    "Count words, lines, and characters in a string. Use when the user asks how long a piece of text is.",
  parameters: Type.Object({
    text: Type.String({ description: "The text to measure." }),
  }),
  async execute(_toolCallId, params) {
    const words = params.text.trim().split(/\s+/).filter(Boolean).length;
    const lines = params.text.split("\n").length;
    const chars = params.text.length;
    return {
      content: [
        { type: "text", text: `${words} words, ${lines} lines, ${chars} characters.` },
      ],
      details: { words, lines, chars },
    };
  },
});

export default (pi: ExtensionAPI) => {
  pi.registerTool(wordcount);
};
```

Three required pieces are visible here: a **tool** (`defineTool`), a **schema** (`Type.Object`), and an **extension factory** (the default export that calls `pi.registerTool`).

## 2. Load it

```bash
pi -e ./wordcount.ts
```

`-e` (alias `--extension`) is repeatable — pass it once per file. Once loaded, the tool is in the agent's toolset for that session.

## 3. Use it

Inside the session, ask something that should trigger it:

> How many words are in "the quick brown fox jumps"?

The model calls `wordcount` with `{ text: "the quick brown fox jumps" }`, and your `execute` returns the count. The `content` array is what the model reads back; `details` is structured data kept for logs and UI rendering, not shown to the model as prose.

## What each return field does (preview)

- `content` — the text (or images) the **model** sees. This is the answer.
- `details` — arbitrary structured data for **your** logs / custom renderers. The model does not read it as text.

Full treatment in [04-results.md](04-results.md).

## If it doesn't load

- **`Cannot find module 'typebox'` or `'@earendil-works/pi-coding-agent'`** — your editor's typecheck can't resolve pi's nested deps. The tool may still *run* (pi resolves them at load time), but to get types and a clean `tsc`, set up a local workspace with those deps. See [10-loading-and-distribution.md](10-loading-and-distribution.md).
- **Tool never gets called** — sharpen the `description`. It's the only thing the model uses to decide. Say *when* to use the tool, not just what it does.
- **Schema validation error at call time** — the model sent arguments that don't match `parameters`. Loosen the schema or add `description`s so the model fills it correctly. See [03-typebox-schemas.md](03-typebox-schemas.md).

## Next

- Understand every field of a tool → [02-anatomy.md](02-anatomy.md)
- Test this without launching pi → [09-testing.md](09-testing.md)
