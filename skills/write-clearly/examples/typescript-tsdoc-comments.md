# TypeScript TSDoc and inline comment examples

Many poor comments are fluent and technically informed. Their failure is not limited to length. They replace concrete behavior with metaphor, personify code and data, hedge conditions that are known, or compress several architectural claims into one sentence.

Choose the smallest correct result:

1. Delete a comment when the declaration already provides the information.
2. Compress a comment when only one non-obvious fact remains relevant.
3. Rewrite a comment when callers need a contract that the original prose does not state clearly.
4. Retain detail when it defines observable behavior or explains a necessary implementation constraint.

Infer the contract from the current code, types, callers, tests, and external constraints. These examples demonstrate decisions, not wording to copy.

## TypeScript contract checklist

For each declaration in scope whose contract is not already in its name and types, exported or not:

- Start TSDoc with a direct summary in domain terms.
- Document each type parameter and parameter required by the local TSDoc standard.
- Define every returned alternative, including its discriminant and associated data.
- State caller-relevant errors, defaults, null states, units, normalization, identity, order, and precedence.
- Add an example only when it reveals correct use or behavior that the signature does not show.

For a constraint, workaround, or proof that is not a declaration contract, use an ordinary inline comment. Place a safety comment beside the exact assertion it justifies.

After editing, run the repository's formatter, TSDoc parser or documentation tests, prose checks, linter, and type checker as appropriate. Inspect the final diff and confirm that a documentation-only pass did not change runtime behavior.

## Put the contract on an unexported helper, not a line comment

Export status does not decide the comment form. An unexported function whose signature hides protocol, narrowing, error codes, or omitted results gets the same TSDoc shape as a public one.

Before:

```ts
export async function dispatchJsonRpc(source: string, handler: RpcHandler): Promise<RpcDispatch> {
	// ...
}

async function dispatchValue(
	value: z.output<typeof z.json>,
	handler: RpcHandler,
): Promise<RpcResponse | null> {
	// invalid → -32600 with null id; notification → null
	const parsed = rpcMessageSchema.safeParse(value);
	if (!parsed.success) {
		return response(null, failure(-32600, 'Invalid Request'));
	}
	const outcome = await handler(parsed.data);
	return expectsResponse(parsed.data) ? response(parsed.data.id, outcome) : null;
}
```

After:

```ts
/**
 * Parses and dispatches one JSON value as a JSON-RPC message.
 *
 * A structurally invalid value produces error `-32600` with a `null` identifier. A valid
 * notification returns `null` so the caller omits it from the response.
 *
 * @param value - One JSON value: a single-call body or one batch member.
 * @param handler - Router invoked for a structurally valid request or notification.
 * @returns A correlated response, an invalid-request error, or `null` for a notification.
 *
 * @throws
 * Re-throws errors and promise rejections from `handler`.
 */
async function dispatchValue(
	value: z.output<typeof z.json>,
	handler: RpcHandler,
): Promise<RpcResponse | null> {
	const parsed = rpcMessageSchema.safeParse(value);
	if (!parsed.success) {
		return response(null, failure(-32600, 'Invalid Request'));
	}
	const outcome = await handler(parsed.data);
	return expectsResponse(parsed.data) ? response(parsed.data.id, outcome) : null;
}
```

The exported dispatcher can be fully documented while this helper still needs its own comment: `-32600`, `null` id, and a notification returning `null` are not in the signature. A `//` above the body is not hoverable and is the wrong form.

## Replace personified architecture with a type contract

Before:

```ts
/**
 * One catalog entry named by the namespace that owns it, written `namespace:key`.
 *
 * Every key carries its namespace. No module inherits a default namespace by accident, and a
 * reader sees which catalog owns the wording without leaving the call site.
 *
 * @typeParam Namespace - Namespaces the key belongs to. Defaults to every shipped namespace.
 */
export type MessageKey<Namespace extends MessageNamespace = MessageNamespace> = {
	[Name in Namespace]: `${Name}:${Extract<keyof MessageCatalog[Name], string>}`;
}[Namespace];
```

After:

```ts
/**
 * Fully qualified message key in `namespace:key` form.
 *
 * @typeParam Namespace - Namespace or namespace union allowed at the call site.
 */
export type MessageKey<Namespace extends MessageNamespace = MessageNamespace> = {
	[Name in Namespace]: `${Name}:${Extract<keyof MessageCatalog[Name], string>}`;
}[Namespace];
```

The original makes namespaces “own” wording, keys “carry” namespaces, and modules “inherit by accident.” The type has one relevant contract: accepted strings include a namespace prefix and the generic restricts that prefix.

## Remove a dense metaphor from a function type

Before:

```ts
/**
 * Resolves one namespaced catalog key to its message in a single request's locale.
 *
 * This is the whole dependency a message boundary takes on the locale runtime: no instance, no
 * namespace loading, and no I/O. One request owns one translator, so one request's locale never
 * reaches another's response.
 *
 * @typeParam Namespace - Namespaces this translator resolves keys from.
 */
export type Translate<Namespace extends MessageNamespace = MessageNamespace> = (
	key: MessageKey<Namespace>,
) => string;
```

After:

```ts
/**
 * Resolves qualified message keys without exposing the localization runtime to the caller.
 *
 * @typeParam Namespace - Namespace or namespace union accepted by the function.
 */
export type Translate<Namespace extends MessageNamespace = MessageNamespace> = (
	key: MessageKey<Namespace>,
) => string;
```

“A request owns a translator” and “a locale reaches a response” require interpretation. The revised comment states the input, output, and encapsulation property directly. Request isolation belongs on the code that creates request-scoped instances, where that behavior can be verified.

## Delete a private mapping manifesto

Before:

```ts
/**
 * Catalog entry that words each public refusal reason.
 *
 * The reason stays the machine contract. The key beside it names the reader's sentence. The
 * `public` namespace keeps these keys apart from the account family, which words `excluded`,
 * `method_not_allowed`, and `not_signed_in` differently. One reason code, two surfaces, two
 * sentences, and no catalog collision.
 */
const RESPONSE_MESSAGE_KEYS = {
	excluded: 'public:excluded',
	method_not_allowed: 'public:methodNotAllowed',
	not_signed_in: 'public:notSignedIn',
} satisfies Record<ResponseReason, MessageKey<'public'>>;
```

After:

```ts
const RESPONSE_MESSAGE_KEYS = {
	excluded: 'public:excluded',
	method_not_allowed: 'public:methodNotAllowed',
	not_signed_in: 'public:notSignedIn',
} satisfies Record<ResponseReason, MessageKey<'public'>>;
```

The name, values, and type constraint show the mapping and namespace. The original comment converts visible code into abstract prose and adds no constraint or rationale.

## Describe union variants without discussing copy ownership

Before:

```ts
/**
 * What a user-entered integer turned out to be, naming the rule a refusal broke.
 *
 * This names the rule instead of wording it. A caller that owns reader copy picks the sentence,
 * and a caller that owns none stays out of the presentation layer.
 */
export type IntegerReading =
	| Readonly<{ kind: 'whole'; value: number }>
	| Readonly<{ kind: 'notWhole' }>
	| Readonly<{ kind: 'belowMinimum'; bound: number }>
	| Readonly<{ kind: 'aboveMaximum'; bound: number }>;
```

After:

```ts
/** Parsed integer or the validation rule that rejected the input. */
export type IntegerReading =
	| Readonly<{ kind: 'whole'; value: number }>
	| Readonly<{ kind: 'notWhole' }>
	| Readonly<{ kind: 'belowMinimum'; bound: number }>
	| Readonly<{ kind: 'aboveMaximum'; bound: number }>;
```

“What an integer turned out to be,” “a rule a refusal broke,” and callers that “own copy” obscure a simple discriminated union. The replacement states what the union represents.

## Replace a presentation-layer manifesto with data semantics

Before:

```ts
/**
 * Why the validator refused one editable field, named rather than worded.
 *
 * A bound refusal carries the bound the entry crossed, so the form states the number without
 * deriving it again. It also carries the subject the sentence is about, so one template serves
 * every numeric field.
 *
 * `above_money_maximum` separates a bound a reader sees as money from a bound a reader sees as a
 * plain count. Monetary values hold cents, and the form has only ever shown their maximum as
 * dollars. Codes remain here while sentences belong to the presentation layer.
 */
export type FieldRefusal =
	| Readonly<{ code: 'not_whole'; subject: NumericField }>
	| Readonly<{ code: 'below_minimum'; subject: NumericField; bound: number }>
	| Readonly<{ code: 'above_maximum'; subject: NumericField; bound: number }>
	| Readonly<{ code: 'above_money_maximum'; subject: NumericField; bound: number }>;
```

After:

```ts
/**
 * Structured validation failure for one numeric field.
 *
 * Bound failures include the affected field and threshold. `above_money_maximum` identifies a
 * threshold stored as cents but displayed as dollars.
 */
export type FieldRefusal =
	| Readonly<{ code: 'not_whole'; subject: NumericField }>
	| Readonly<{ code: 'below_minimum'; subject: NumericField; bound: number }>
	| Readonly<{ code: 'above_maximum'; subject: NumericField; bound: number }>
	| Readonly<{ code: 'above_money_maximum'; subject: NumericField; bound: number }>;
```

The original discusses sentences, templates, readers, and layer ownership. The revised comment explains the non-obvious distinction between `above_maximum` and `above_money_maximum`.

## Remove localization architecture from a component hover

Before:

```ts
/**
 * Renders the shared create-and-edit plan form from resolved values and refusal codes.
 *
 * Every reader-facing sentence resolves through the `plans` namespace, apart from four `common`
 * messages a shared owner holds. Those four are the stale-projection warning the settings screen
 * also renders and the three bounded-integer templates every whole-number caller shares. The
 * caller owns the post target, so this component renders no `form` element of its own.
 *
 * @param props - Resolved form values, refusal codes, and submission state.
 * @returns Plan-form markup with no persistence or provider decision in JSX.
 */
export function PlanFields(props: PlanFieldsProps) {
	// ...
}
```

After:

```ts
/**
 * Renders shared create-and-edit plan fields.
 *
 * The component does not render a `form` element. Its parent supplies the form and submission
 * target.
 *
 * @param props - Values, validation failures, operation type, and submission state.
 * @returns Localized plan fields and submission feedback.
 */
export function PlanFields(props: PlanFieldsProps) {
	// ...
}
```

The number and location of messages can change without changing the component API. The missing `form` element affects composition and remains in the public contract.

## Document parser grammar, not validation architecture

Before:

````ts
/**
 * Parses a bounded integer without coupling validation to presentation copy.
 *
 * Surrounding whitespace is ignored. Shape is checked before bounds, so each rejected value has
 * exactly one reason. Every caller words its own refusal from a message catalog, so no English
 * sentence lives in this module.
 *
 * @param value - Untrusted field text.
 * @param range - Inclusive minimum and maximum.
 * @returns The parsed integer, or the first violated rule with its applicable bound.
 *
 * @example Distinguishing a malformed entry from an out-of-range one
 * ```ts
 * readWholeNumberBounds("1.5", { min: 0, max: 10 }); // { kind: "notWhole" }
 * readWholeNumberBounds("11", { min: 0, max: 10 }); // { kind: "aboveMaximum", bound: 10 }
 * ```
 */
````

After:

```ts
/**
 * Parses a signed decimal integer within inclusive bounds.
 *
 * Surrounding whitespace is ignored. Decimal points, exponent notation, and leading plus signs
 * are invalid.
 *
 * @param value - Candidate integer text.
 * @param range - Inclusive accepted range.
 * @returns `whole` with the parsed value, `notWhole` for invalid integer syntax,
 * `belowMinimum` with the minimum, or `aboveMaximum` with the maximum.
 */
```

The original explains validation order and separation from the presentation layer. Its example repeats variants that the return type already defines. The replacement states the accepted syntax and the exact result for each failure class.

## State contained response data, not a surviving envelope

Before:

```ts
/**
 * A failed API attempt whose response envelope survived the failure.
 *
 * @see {@link recoverProviderAttempt} for the two provider contracts this is recovered from.
 */
export interface RecoveredAttempt {
	/** Status the attempt reached. */
	status: number;
	/** Untrusted response envelope. The caller still validates it before reading. */
	body: unknown;
	/** Retry delay converted to milliseconds, or `null` when the response carried none. */
	retryAfterMs: number | null;
}
```

After:

```ts
/** Retry metadata extracted from a failed API request. */
export interface RecoveredAttempt {
	/** HTTP status from the error response. */
	status: number;
	/** Unvalidated response body. */
	body: unknown;
	/** Retry delay in milliseconds. `null` means the error contained no valid delay. */
	retryAfterMs: number | null;
}
```

An envelope does not “survive,” a status does not “reach,” and a response does not “carry” a delay. The revised properties state what data was extracted and what `null` means.

## Keep provider investigations out of API hovers

Before:

```ts
/**
 * Recovers the response envelope from a failed API attempt.
 *
 * @param cause - Value thrown by the injected client.
 * @returns The recovered attempt when retry policy can still read a body, otherwise `null` so the
 * caller rethrows the original failure unchanged.
 *
 * @remarks
 * Two client contracts reach this function. Authenticated requests throw the framework's response
 * wrapper, while background clients throw the library's error object. A dated checkpoint traced
 * both contracts against pinned package versions and recorded the relevant source locations.
 *
 * Only rate-limit responses and protocol failures carried on HTTP 200 are recoverable. The same
 * checkpoint probed every failure class and contains the complete matrix.
 */
```

After:

```ts
/**
 * Extracts retry metadata from errors produced by supported API clients.
 *
 * Rate-limit errors and protocol errors with HTTP status 200 contain usable response data. The
 * function returns `null` for other HTTP errors, connection failures, and unknown values.
 *
 * @param cause - Error value from a supported API client.
 * @returns The status, body, and retry delay, or `null` when the error has no recoverable response.
 *
 * @throws
 * Re-throws body-parsing errors from recognized rate-limit responses.
 */
```

The package research belongs in its evidence record. The public comment defines accepted error classes, returned data, `null`, and the body-parsing error.

## Replace dated provenance with current precedence

Before:

```ts
/**
 * Query parameters carrying an explicit locale, in negotiation order.
 *
 * The host platform sends the user's chosen locale as a `locale` request parameter on document
 * requests. That contract comes from the provider's localization guide, checked during a dated
 * audit with the claim and source excerpt preserved in a result file. `lng` is the deliberate
 * override used by browser automation and end-to-end suites.
 */
export const LOCALE_SEARCH_PARAMS = ['locale', 'lng'] as const;
```

After:

```ts
/** Locale parameters in precedence order: the host's `locale`, then the `lng` override. */
export const LOCALE_SEARCH_PARAMS = ['locale', 'lng'] as const;
```

Parameter order and the source of each value affect use of the constant. Audit dates, citations, and test consumers do not.

## Replace non-guarantees with the completion condition

Before:

```ts
/**
 * Clears the profile properties owned by this service.
 *
 * @returns `accepted` when the provider answered 200 or 201 for an upsert setting exactly the
 * service-owned properties to `null`. The pinned revision documents that response as the applied
 * property write, so acceptance is also completion of the clear. It claims nothing about the user
 * having observed the change, about dependent segments having recomputed, or about notification
 * delivery.
 */
clearProfile(key: string, email: string): Promise<ProviderAttempt>;
```

After:

```ts
/**
 * Sets the service-managed profile properties to `null`.
 *
 * @param key - Decrypted provider credential.
 * @param email - Email used as the profile identifier.
 * @returns `accepted` after the provider applies the profile update, otherwise a rejection or
 * connection-failure result.
 */
clearProfile(key: string, email: string): Promise<ProviderAttempt>;
```

The original ends with three defensive non-guarantees. The replacement defines when the operation is complete and identifies the other return alternatives.

## Preserve a mutation constraint without the topology narrative

Before:

```ts
/**
 * Builds the localization options every composition root shares.
 *
 * The returned options carry no `locale`: server middleware supplies it per request and the
 * browser factory supplies it during hydration, which keeps one instance per request rather than
 * a shared module singleton. Each call also copies the catalogs, because the library keeps the
 * object it is given and edits it in place; sharing one would let a single request's edit reach
 * every other request in the process.
 *
 * @param options - Locale policy and missing-key policy for the instance being built.
 * @returns Initialization options with every catalog inlined, so initialization needs no backend.
 */
```

After:

```ts
/**
 * Builds localization configuration for one render-scoped instance.
 *
 * The result omits the locale so the caller can set it. Each call clones the catalogs because the
 * localization library mutates the resource object it receives.
 *
 * @param options - Missing-key policy for the instance.
 * @returns Initialization options with separate in-memory catalogs and no configured locale.
 */
```

The clone prevents mutation from affecting another instance, and the omitted locale affects the returned value. Those facts remain. The server/browser topology is unnecessary in this function's documentation.

## Replace a hedge with its exact condition

Before:

```ts
/**
 * Adds whole calendar months to an instant, in UTC.
 *
 * @remarks
 * Preserves the UTC day where possible and clamps overflow to the target month's final day.
 *
 * @param from - The instant to measure from.
 * @param months - Whole months to add. Zero returns the same instant.
 * @returns A new date the given number of calendar months later.
 */
```

After:

```ts
/**
 * Adds whole calendar months to an instant in UTC.
 *
 * The result uses the same day of month when that day exists in the target month. Otherwise, it
 * uses the target month's final day. The time of day and milliseconds do not change.
 *
 * @param from - Instant to shift.
 * @param months - Number of calendar months to add. Negative and zero values are valid.
 * @returns A new `Date` containing the shifted instant.
 */
```

“Where possible” hides the condition that controls clamping. The replacement names that condition and also states what the operation preserves.

## Use an example for behavior hidden by the platform

Retained:

````ts
/**
 * Parses supported calendar-date and offset-timestamp text into a UTC instant.
 *
 * Accepts a calendar day (`2026-08-21`), interpreted as UTC midnight, or a date and time with an
 * explicit zone (`2026-08-21T10:00:00Z`, `2026-08-21T10:00:00+05:30`). The separator can be `T`
 * or a space. Zones can use `Z`, `+HH`, `+HHMM`, or `+HH:MM`. Fractional seconds are truncated to
 * milliseconds.
 *
 * Parsing does not use the host time zone. Impossible calendar dates and times without an explicit
 * zone are invalid; the function does not normalize or infer them.
 *
 * @param raw - Candidate date text. Surrounding whitespace is ignored.
 * @returns The parsed instant, `impossible_day` for an invalid calendar date, `zone_absent` for a
 * time without an offset, or `not_a_date` for every other unsupported value.
 *
 * @example Values accepted by native parsing but rejected here
 * ```ts
 * readUtcInstant("2026-02-30"); // { ok: false, problem: "impossible_day" }
 * readUtcInstant("2026-08-21T10:00:00"); // { ok: false, problem: "zone_absent" }
 * ```
 */
````

The example is useful because native JavaScript parsing can normalize or infer both values. The return type alone does not show that difference.
