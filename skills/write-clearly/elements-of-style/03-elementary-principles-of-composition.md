# Principles of composition

## Organize around the reader's task

Use one paragraph for one topic or one step in an argument. Begin with the fact or conclusion that gives the paragraph its purpose. Follow with evidence, conditions, consequences, or examples.

A short answer may need one paragraph. A longer explanation should separate distinct decisions or stages. Do not create sections merely to make the document look complete.

## Lead with the outcome

State the result before recounting the work that produced it.

Before:

> After reviewing the configuration, checking the deployment logs, and comparing the two environments, I found that the production secret is missing.

After:

> Production is missing the required secret. The configuration and deployment logs confirm the omission.

The reader learns the actionable fact first and can then evaluate the evidence.

## Choose voice by meaning

Active voice is direct when the subject performs the action.

> The worker retries the request three times.

Passive voice is correct when the actor is unknown, irrelevant, or less important than the result.

> The token was revoked at 14:32 UTC.

Do not force active voice by assigning human actions to abstractions.

Unclear:

> The boundary decides which errors survive.

Clear:

> The adapter returns rate-limit errors and discards other provider errors.

The second sentence identifies the code and operations involved.

## Use positive and negative statements deliberately

Positive wording often states ordinary behavior more directly.

> The job starts after the transaction commits.

Negative wording is necessary when absence or prohibition is part of the contract.

> The parser does not use the host time zone.

> The response never includes the internal exclusion reason.

Do not replace a meaningful negative guarantee merely to satisfy a style preference.

## Use definite, specific, concrete language

Name the operation, value, condition, and result.

Vague:

> The service handles failures safely.

Specific:

> The service retries HTTP 429 responses and returns all other HTTP errors to the caller.

An abstraction is useful when the surrounding work defines it. Otherwise, replace it with the concrete facts it abbreviates.

## State exact conditions

Replace a hedge when the implementation provides a condition.

Before:

> The date usually keeps the same day where possible.

After:

> The result keeps the same day when that day exists in the target month. Otherwise, it uses the month's final day.

Keep a qualification when evidence does not support a stronger claim.

> Some clients omit the header.

Do not silently change `some` to `all`, `can` to `will`, or `typically` to `always`.

## Omit needless words after preserving meaning

Delete words that add no fact, distinction, tone required by the audience, or structural help.

| Before                        | After                   |
| ----------------------------- | ----------------------- |
| due to the fact that          | because                 |
| in order to                   | to                      |
| at this point in time         | now                     |
| has the ability to            | can                     |
| is responsible for validating | validates               |
| it is important to note that  | state the fact directly |

Concision does not require short sentences or sparse documentation. A long sentence is justified when each part defines necessary behavior and the relationships remain clear.

## Keep related words together

Place conditions beside the claims they limit. Place modifiers beside the words they modify. Keep a term's definition and exceptions together.

Unclear:

> The function returns an error for records after validation that have no owner.

Clear:

> After validation, the function returns an error for records that have no owner.

## Use parallel form for parallel ideas

Present equivalent alternatives with the same grammatical structure.

> The command validates the input, writes the record, and publishes the event.

Parallel form makes missing or unequal steps visible. Do not add a third item solely to create a rhetorical set of three.

## Keep one main claim in each sentence

Dense prose often combines cause, mechanism, ownership, history, and consequence in one sentence. Split the sentence at the point where the reader must hold one relationship in memory to decode another.

Before:

> One request owns one translator, so one request's locale never reaches another response, preserving the boundary's isolation contract.

After:

> The server creates a translator for each request. It does not share translator state between requests.

The revision names the actual operation and the resulting isolation property.

## Use examples for hidden distinctions

An example is useful when ordinary behavior would lead the reader to expect the wrong result, or when several valid forms are hard to state compactly. An example that repeats the type signature or preceding sentence adds no information.

## End when the topic is complete

Do not add a conclusion that merely repeats the paragraph or section. End with the final necessary fact, consequence, or action.
