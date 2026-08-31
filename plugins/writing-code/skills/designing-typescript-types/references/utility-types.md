# Utility types

Load when deriving one owned contract from another. Why: derivation prevents duplicate field lists while retaining concrete value evidence.

Prefer built-ins:

```ts
interface User {
  id: string;
  name: string;
  email: string;
}

type UserUpdate = Partial<Pick<User, "name" | "email">>;
type PublicUser = Omit<User, "email">;
type UserById = Record<string, User>;
```

Rules:

- `Record` is appropriate when both the key space and value contract are meaningful. Avoid `Record<string, unknown>`.
- Prefer a named interface for an owner-controlled object passed across modules.
- Use `Pick`, `Omit`, `Partial`, and `Required` only when the derived semantics remain obvious.
- Keep recursive utilities bounded and test them against representative contracts.
- Do not annotate an object literal with an open dictionary merely to permit later mutation. Collect typed entries and use `Object.fromEntries`, or expose an owner method.

```ts
type ValueOf<T> = T[keyof T];

type PickByValue<T, Value> = {
  [Key in keyof T as T[Key] extends Value ? Key : never]: T[Key];
};
```

Next: load `advanced-types.md` when a transformation needs conditional or mapped-type logic; otherwise this step ends here.
