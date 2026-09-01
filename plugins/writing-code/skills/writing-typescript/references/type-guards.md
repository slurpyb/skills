# Narrowing and parsing

Parsing establishes an owner contract at an I/O boundary; discriminants narrow values already inside a closed domain union.

## External values

Use the repository's schema library at HTTP, JSON, YAML, environment, storage, and framework boundaries:

```ts
const userSchema = z.object({
  kind: z.literal("user"),
  name: z.string(),
  email: z.email(),
});

type User = z.infer<typeof userSchema>;

export function readUser(requestBody: JsonValue): User {
  return userSchema.parse(requestBody);
}
```

Pass `User` into application behavior. Represent recursive transport data with a concrete union such as `JsonValue`.

## Closed unions

Use predicates after a value belongs to a domain union:

```ts
type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: Error };

function isSuccess(
  state: RequestState,
): state is Extract<RequestState, { status: "success" }> {
  return state.status === "success";
}
```

Use exhaustive switches with a `never` check for state transitions. Schema parsing, rather than an assertion function, establishes an external value's contract.

## Completion

Every external value on the changed path is parsed once before application behavior, and every changed closed union narrows exhaustively.
