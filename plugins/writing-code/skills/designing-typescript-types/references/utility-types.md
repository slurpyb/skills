# Utility types

Derive one owner contract from another when the derived semantics remain obvious.

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

- `Record` fits a meaningful key space and concrete value contract.
- A named interface fits an owner-controlled object that crosses modules.
- `Pick`, `Omit`, `Partial`, and `Required` fit derivations that preserve clear semantics.
- Recursive utilities stay bounded and carry representative fixtures.
- Typed entries plus `Object.fromEntries`, or an owner method, preserve evidence while building a dynamic object.

```ts
type ValueOf<Value> = Value[keyof Value];

type PickByValue<Source, Value> = {
  [Key in keyof Source as Source[Key] extends Value ? Key : never]: Source[Key];
};
```

## Completion

Every utility has one source owner, its derived semantics are named, modifiers and representative values have fixtures, and recursion is bounded.
