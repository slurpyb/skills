# Narrowing and parsing

Load when values cross an I/O boundary or a typed union needs narrowing. Why: parsing establishes a contract; ad hoc representation checks do not.

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

Pass `User`, not an unparsed top type, into downstream functions. Give recursive transport values a concrete union such as `JsonValue`; do not use an open `Record<string, unknown>`.

## Typed unions

Predicates are appropriate after a value already belongs to a closed domain union:

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

Prefer exhaustive switches and a `never` check for state transitions. Avoid assertion functions that claim an external value is valid without schema parsing.

Next: load `patterns.md` when the parsed union drives a Result API or state machine; otherwise this step ends here.
