# Word choice

Judge words by their meaning in context. This reference identifies recurring sources of vague or inflated prose; it is not a blacklist.

## Literal subjects and verbs

Use a verb only when its subject can perform that action literally or the metaphor is established technical terminology.

### Own

Use `own` for responsibility, possession, or a defined ownership relation.

Vague:

> The catalog owns the sentence.

Literal:

> The component reads the sentence from the `checkout` catalog.

### Carry and contain

Use `contain`, `include`, or the name of a field for stored data. Use `carry` only when it is the established term.

Vague:

> The response carries retry truth.

Literal:

> The response includes a retry delay.

### Reach, survive, and flow

Name the transfer, persistence, or call.

| Vague                                | Literal                                               |
| ------------------------------------ | ----------------------------------------------------- |
| The locale reaches another response. | The server reuses locale state for another request.   |
| The envelope survives the failure.   | The thrown error contains the response body.          |
| Data flows through the boundary.     | The adapter passes the validated value to the client. |

### Speak, answer, know, decide, and choose

Functions can return, compare, parse, select, or throw. Values can contain or identify data. Reserve human cognitive verbs for people or systems that actually implement that decision.

Vague:

> The schema knows which state the caller chose.

Literal:

> The `state` discriminant identifies the selected variant.

## Hedges

Words such as `may`, `might`, `can`, `typically`, `generally`, `usually`, `often`, and `where possible` are correct only when uncertainty or frequency is part of the claim.

When the condition is known, state it:

| Hedged                              | Exact                                                           |
| ----------------------------------- | --------------------------------------------------------------- |
| The request may fail in some cases. | The request fails when the token has expired.                   |
| The date usually keeps its day.     | The date keeps its day when the target month contains that day. |
| The value can be omitted.           | Omit the value to use the default locale.                       |

Do not invent certainty. If behavior varies by implementation, provider, or version, name that source of variation.

## Historical adjectives

`Existing`, `current`, `stable`, `unchanged`, `legacy`, and `new` often describe a comparison that the reader cannot see.

Before:

> Returns the unchanged stable response.

After:

> Returns HTTP 409 with reason `no_session`.

Keep the adjective when the comparison is part of the contract, and name both sides:

> Existing records retain their identifiers after migration.

## Quality claims

Words such as `safe`, `robust`, `seamless`, `truthful`, `clean`, `elegant`, `proper`, `correct`, and `exact` require evidence or a defined technical meaning.

Before:

> Handles failures safely and robustly.

After:

> Retries HTTP 429 responses twice and returns other errors to the caller.

Describe the property instead of praising it.

## Broad nouns

Words such as `case`, `character`, `factor`, `feature`, `nature`, `system`, `aspect`, `concern`, `issue`, `behavior`, and `functionality` often conceal a more precise noun or verb.

| Broad                        | Specific                 |
| ---------------------------- | ------------------------ |
| authentication functionality | authentication           |
| an issue occurred            | the connection timed out |
| a factor in the failure      | caused the failure       |
| behavior for empty input     | result for empty input   |
| configuration system         | configuration loader     |

Keep a broad term when it names a real domain concept.

## Weak verbs and nominalizations

Prefer the operation to a noun phrase about the operation.

| Weak                       | Direct     |
| -------------------------- | ---------- |
| performs validation of     | validates  |
| provides support for       | supports   |
| is responsible for sending | sends      |
| makes a determination      | determines |
| has the ability to retry   | can retry  |

Do not replace a precise multiword term merely to save a word.

## Ensure, enable, allow, support, and handle

These verbs often omit the mechanism or the exact capability.

- Use `ensure` only when the subject makes the result inevitable; state how when it is not obvious.
- Use `allow` or `enable` when one condition makes an action possible; name the actor and action.
- Use `support` for a defined compatibility set or service.
- Replace `handle` with the actual operation: parse, retry, log, reject, store, or return.

## Participial endings

An ending phrase beginning with `ensuring`, `highlighting`, `showcasing`, `reflecting`, or `underscoring` often adds an unsupported interpretation.

Before:

> The client retries the request, ensuring reliable delivery.

After:

> The client retries the request twice after a connection timeout.

The revision states the behavior. It does not claim delivery is reliable.

## Empty intensifiers

Remove `very`, `highly`, `clearly`, `obviously`, `certainly`, `crucial`, `vital`, and `important` when they only increase emphasis. State the consequence that makes something important.

Before:

> It is crucial to validate the signature.

After:

> Reject requests whose signatures do not match.

## Inflated verbs

Prefer ordinary verbs when they express the same operation.

| Inflated                 | Direct                                                       |
| ------------------------ | ------------------------------------------------------------ |
| utilize                  | use                                                          |
| leverage                 | use                                                          |
| facilitate               | help, permit, or name the operation                          |
| operationalize           | implement                                                    |
| instantiate a connection | open a connection, unless `instantiate` is technically exact |

## Terminology consistency

Repeat the correct term. Do not rotate among synonyms to make prose sound varied.

If `request`, `attempt`, and `operation` represent different states, define and preserve those distinctions. If they represent the same state, select one term.

## Negative phrases

Replace evasive negatives with a direct positive statement:

- `not very often` → `rarely`
- `did not remember` → `forgot`
- `not sufficient` → `insufficient`

Keep negative wording for an exclusion or guarantee:

- `does not use the host time zone`
- `never logs the access token`
- `returns null when no record exists`

## Etcetera and incomplete sets

Use `etc.` only when omitted items are immaterial and the category is obvious. If readers need the complete accepted set, list it or point to its authoritative definition.

## Respectively

Use `respectively` when it prevents a longer or ambiguous mapping. Prefer a table when several pairs must be compared.

## Final test

For every abstract noun, hedge, and impressive-sounding verb, ask: what exact fact would be lost if this word disappeared? If the answer is none, delete it. If the word abbreviates a real condition or concept, define that meaning where the reader needs it.
