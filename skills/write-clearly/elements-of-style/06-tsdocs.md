# TSDoc conventions

TSDoc is the human interface to a TypeScript module. A reader should be able to pause on a declaration and learn what it means, what each input controls, what comes back, and which failures or lifecycle rules matter without reconstructing the implementation.

Character count is not a quality measure. Structure, precision, and completeness are.

## What to document

Document every declaration exposed by a module's `index.ts` or `index.server.ts`, plus every public or protected member a caller or subclass can use. React Router entry points receive the same treatment even though the framework discovers them directly.

Documentation belongs on the declaration that owns the contract. A re-export does not duplicate it. Export status is a completeness bar for published APIs, not a reason to omit comments.

Write the same TSDoc shape on module-local functions, types, and methods when a reader pausing on the declaration would otherwise have to reconstruct behavior, invariants, failure modes, null or absent meaning, narrowing, error codes, or omitted results from the body or a spec. Skip comments that only restate names, types, or direct control flow.

An unexported helper whose contract is not in the signature:

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
	return Object.hasOwn(message, 'id');
}
```

A local whose name and types already say it stays uncommented:

```ts
const correlated = responses.filter((candidate): candidate is RpcResponse => candidate !== null);
```

## Required shape

Begin with one summary sentence that identifies the concept or operation in domain language. Then use the standard blocks that match the declaration:

```ts
/**
 * Commits a Webhook delivery and its pending domain events.
 *
 * @typeParam Transaction - Transaction handle supplied to the persistence callback.
 * @param delivery - Aggregate containing the proposed state and pending events.
 * @param persist - Resource-specific state write executed inside the transaction.
 * @returns The aggregate and events after both state and outbox writes commit.
 *
 * @throws
 * Re-throws a persistence or outbox error after restoring the aggregate's accepted state.
 */
```

Use the blocks consistently:

- `@typeParam` for every generic parameter, describing its role in the relationship rather than restating its constraint;
- `@param` for every function, method, and constructor parameter, including callback behavior, units, time basis, accepted range, and ownership where relevant;
- `@returns` for every non-`void` callable, explaining the meaning of the result rather than repeating its TypeScript type;
- one `@throws` block per deliberate caller-relevant exception or thrown response;
- `@defaultValue` on an optional field or property when its default is part of the contract;
- `@example` when construction, narrowing, sequencing, or a state distinction is easier to understand in code;
- `@see` and `{@link}` when another public contract is necessary to use this one correctly;
- `{@inheritDoc}` only when an implementation preserves the inherited contract exactly.

Document interface and record properties when the name and TypeScript type do not capture units, identity, null meaning, sign, chronology, source, or lifecycle state. A field comment should answer a question, not convert camel case into English.

## Summaries and remarks

The summary is the primary documentation. It should be useful in an editor hover and in an API index.

`@remarks` is available for genuinely separate long-form detail that belongs on an API detail page. It is not a container for leftovers and must not replace member docs, parameters, returns, throws, examples, or links. Most declarations in this application should not need it.

Do not write narrative implementation tours. Describe observable contracts and domain meaning:

- good: “Returns `lost` when guarded settlement no longer owns the lease.”
- bad: “Calls `commit`, checks the boolean, and creates an object.”
- good: “`to` is `null` while the membership interval remains open.”
- bad: “The end date of the interval.”

## Examples

Examples earn their space by revealing correct use or an important distinction. Give each example a title and keep it executable in spirit:

````ts
/**
 * Creates validated points-expiry windows.
 *
 * @example Disabling expiry
 * ```ts
 * ExpiryWindow.from(0); // { kind: "disabled" }
 * ```
 *
 * @example Preserving calendar semantics
 * ```ts
 * ExpiryWindow.from(3); // { kind: "calendarMonths", months: 3 }
 * ```
 */
````

Do not add examples that merely repeat a constructor signature.

## Ordering

Use this order so comments scan consistently:

1. summary;
2. `@typeParam`;
3. `@param`;
4. `@returns`;
5. `@throws`;
6. `@defaultValue`;
7. `@example`;
8. `@see`;
9. modifier tags, if the project later adopts API release stages.

Separate different groups with a blank TSDoc line. Keep adjacent tags of the same kind together.

## Review test

A documentation pass is complete only when:

1. every public declaration and callable member has a summary;
2. every generic and callable parameter has a matching structured block;
3. every meaningful return, deliberate exception, default, and null state is explained;
4. TSDoc parses without diagnostics;
5. a reader can distinguish proposed from committed state, attempted from settled work, and malformed input from business refusal without opening the implementation;
6. no `@remarks` block is compensating for missing structure;
7. every module-local declaration in scope whose contract is not in its signature has TSDoc (`dispatchJsonRpc` documented while `expectsResponse`, `dispatchValue`, and `response` remain bare is incomplete).

Stale or misleading TSDoc is a contract defect and changes with the code it describes.
