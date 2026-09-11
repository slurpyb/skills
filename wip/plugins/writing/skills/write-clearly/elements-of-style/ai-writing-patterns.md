# Empty AI prose

Use this reference to diagnose prose that is grammatical and polished but does not make clear, verifiable claims. Repair the missing meaning rather than substituting different fashionable words.

## Superficial interpretation

Generated prose often appends an interpretation that no actor stated and no evidence supports.

Before:

> The service records every retry, highlighting its commitment to operational transparency.

After:

> The service logs the attempt number, status code, and retry delay for every retry.

The first sentence assigns motive to a service. The second identifies the recorded data.

Watch for trailing phrases beginning with `ensuring`, `highlighting`, `emphasizing`, `reflecting`, `underscoring`, `showcasing`, or `contributing to`.

## Inflated significance

Words such as `pivotal`, `crucial`, `vital`, `groundbreaking`, `enduring`, `transformative`, and `testament` often replace the consequence that would justify them.

Before:

> This pivotal change establishes a robust foundation for future growth.

After:

> The change separates storage from transport, so either implementation can be replaced independently.

State the changed capability or consequence.

## Personified abstractions

Generated technical prose often assigns intent or perception to modules, layers, boundaries, catalogs, schemas, data, and responses.

Before:

> The boundary knows which failures can safely reach the caller.

After:

> The adapter returns validation errors and converts provider errors to HTTP 502.

Check the grammatical subject. If it cannot literally perform the verb, identify the code or person that does.

## Hedge accumulation

Several weak qualifiers can make a sentence impossible to disprove and useless for action.

Before:

> The operation may potentially fail in certain situations where the provider might be unavailable.

After:

> The operation returns `unreachable` when the connection times out.

If the source does not define the complete condition, preserve that uncertainty and state what is known:

> The provider can also return `unreachable` for undocumented transport errors.

## Defensive non-guarantees

Long lists of what a function does not promise often obscure its actual completion point.

Before:

> Acceptance does not mean the user observed the update, dependent jobs completed, caches refreshed, or notifications arrived.

After:

> `accepted` means the provider stored the update.

Retain a non-guarantee only when callers are likely to rely on the excluded behavior.

## Architectural praise

Generated prose often announces separation of concerns, single sources of truth, clean boundaries, or framework independence without explaining observable behavior.

Before:

> This clean boundary keeps presentation concerns out of the domain and preserves a single source of truth.

After:

> The validator returns reason codes. The HTTP adapter converts those codes to localized messages.

Name the actual division of work. If names and types already show it, delete the comment.

## Rule-of-three padding

A set of three can make an incomplete explanation sound comprehensive.

Before:

> The change improves reliability, maintainability, and scalability.

After:

> The worker resumes from its last committed cursor after a restart.

List multiple properties only when each has evidence and matters to the reader.

## Synonym rotation

Generated prose may rename one concept repeatedly: request, operation, interaction, transaction, workflow. This creates false distinctions and weakens real ones.

Use the domain's established term consistently. Define separate terms when their states or responsibilities differ.

## Empty introductions

Delete introductions such as:

- `It is important to note that ...`
- `It is worth mentioning that ...`
- `In today's rapidly evolving landscape ...`
- `This section explores ...`
- `At its core ...`

Start with the fact the framing delays.

## Repeated summaries

Generated prose often restates the same claim in an introduction, body, and conclusion. Keep each fact once unless repetition serves navigation in a long document.

Do not add a conclusion to a short explanation merely to signal completion.

## Historical detail without a current contract

Dates, checkpoint numbers, package versions, and investigation narratives can make a comment appear authoritative while hiding the present contract.

Before:

> A dated audit traced both provider paths against the pinned client and recorded the complete failure matrix.

After:

> The function extracts response data from rate-limit and protocol errors. It returns `null` for other errors.

Keep the evidence in a maintained investigation record. Keep the result where callers need it.

## Formatting as emphasis

Excessive headings, bold labels, bullets, emoji, and dashes can make weak content look structured. Select formatting only after the relationships between claims are clear.

## Diagnostic pass

For each paragraph:

1. Underline each verifiable proposition.
2. Identify its evidence and level of certainty.
3. Remove statements that only praise, summarize, or interpret another statement.
4. Replace personified abstractions with literal actors and operations.
5. Replace known hedges with their conditions.
6. Delete repeated propositions.

The pass is complete when every remaining sentence states a necessary fact, supported interpretation, instruction, or qualification.
