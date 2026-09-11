---
name: write-clearly
description: Write or revise prose for humans. Use for documentation, code comments and API references in any language, UI and error text, reports, explanations, and project communication. Preserve exact meaning while replacing vague, metaphorical, anthropomorphic, hedged, or inflated language with literal statements.
---

# Write clearly

Preserve meaning before shortening prose. A shorter sentence is worse when it removes a condition, changes certainty, or replaces a precise distinction with a broad summary.

## Establish the meaning

Before drafting or revising:

1. Read the source material, surrounding implementation, and local writing conventions.
2. Identify the audience and the decision or action the text must support.
3. List the facts the reader needs: actors, inputs, operations, results, conditions, units, chronology, ownership, and failure behavior.
4. Separate verified facts from inference and genuine uncertainty.

Do not improve the sound of a sentence until its factual content is clear.

## Write literal statements

- Give each sentence a concrete subject and an operation that subject literally performs.
- State what changes, what remains true, and the condition under which each result occurs.
- Use technical abstractions only when they have a defined meaning in the surrounding work.
- Use active voice when the actor matters and is known. Use passive voice when the result matters more or the actor is unknown.
- Prefer positive statements for ordinary description. Keep negative statements that define exclusions, safety properties, or non-behavior.
- Replace a hedge with its exact condition when evidence provides one. Preserve uncertainty when the source is uncertain.
- Use one term for each concept. Do not vary terminology for style.
- Keep one main claim in each sentence. Split sentences that compress several relationships into one grammatical chain.

Treat words such as “owns,” “carries,” “reaches,” “survives,” “speaks,” “knows,” and “decides” literally. When an abstraction is the grammatical subject, verify that it can perform the stated action. Otherwise, name the function, process, person, or stored value that does.

## Keep necessary detail

Delete repetition, ceremonial introductions, quality claims, historical narration, and explanations already present in names or structure. Retain:

- observable behavior and exact alternatives;
- non-obvious rationale and constraints;
- units, defaults, null or missing states, identity, order, and precedence;
- meaningful negative guarantees;
- uncertainty that affects interpretation or action;
- examples that reveal behavior the declaration or ordinary platform behavior does not show.

For code comments in any language:

- Documentation describes the contract at the declaration, whether or not it is exported.
- Inline comments explain only non-obvious constraints, workarounds, or proofs that are not declaration contracts.
- Names, types, and direct control flow require no prose translation.
- Research history and step-by-step implementation descriptions belong in design or investigation records.

Do not write this:

```ts
// Notifications omit id; null id still expects a response.
function expectsResponse(message: RpcMessage): message is z.output<typeof rpcRequestSchema> {
  return Object.hasOwn(message, "id");
}
```

Write this:

```ts
/**
 * Narrows a validated message to a request when it includes an `id`.
 *
 * JSON-RPC notifications omit `id`. A request still expects a response when `id` is `null`.
 *
 * @param message - Validated request or notification.
 * @returns `true` when `message` has an own `id` property.
 */
function expectsResponse(message: RpcMessage): message is z.output<typeof rpcRequestSchema> {
  return Object.hasOwn(message, "id");
}
```

## Use the relevant reference

- Read [elements-of-style/02-elementary-rules-of-usage.md](elements-of-style/02-elementary-rules-of-usage.md) for a grammar or punctuation pass.
- Read [elements-of-style/03-elementary-principles-of-composition.md](elements-of-style/03-elementary-principles-of-composition.md) when restructuring paragraphs or sentences, or when active voice, negative phrasing, abstraction, or concision requires judgment.
- Read [elements-of-style/04-a-few-matters-of-form.md](elements-of-style/04-a-few-matters-of-form.md) for headings, lists, quotations, numerals, links, tables, and code formatting.
- Read [elements-of-style/05-words-and-expressions-commonly-misused.md](elements-of-style/05-words-and-expressions-commonly-misused.md) when reviewing vague verbs, hedges, inflated claims, personification, or inconsistent terminology.
- Read [elements-of-style/ai-writing-patterns.md](elements-of-style/ai-writing-patterns.md) when prose sounds polished but lacks a clear proposition, or when reviewing a broad body of generated prose.
- Read [examples/typescript-tsdoc-comments.md](examples/typescript-tsdoc-comments.md) for TypeScript TSDoc, inline comments, public API documentation, or a TypeScript comment-quality pass.
- Read [elements-of-style/01-introductory.md](elements-of-style/01-introductory.md) only when a style rule conflicts with exact meaning or local convention.
- Read [elements-of-style/06-tsdocs.md](elements-of-style/06-tsdocs.md) when writing tsdoc

Read only the references relevant to the current writing task.

## Verify the revision

1. Compare the revision with its evidence. Account for every factual claim and meaningful qualification.
2. Confirm that the intended reader can identify the actor, operation, result, and applicable condition without interpreting a metaphor.
3. Confirm that shorter wording did not remove a contract distinction or convert uncertainty into certainty.
4. Read the prose in its actual location: editor hover, interface, log, document, review, or message.
5. Run the repository's formatter, documentation checks, prose gates, and relevant tests when editing files.
6. Inspect the final diff for unrelated edits and accidental behavior changes.

The work is complete when every sentence provides necessary information, every claim matches the available evidence, and the prose can be understood without hidden context.
