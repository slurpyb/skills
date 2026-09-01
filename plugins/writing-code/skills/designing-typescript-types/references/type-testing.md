# Type testing

Compile-time fixtures prove type relationships that runtime tests cannot observe.

Use equality and expectation helpers in a file included by the repository typecheck:

```ts
type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;

type Expect<Condition extends true> = Condition;

type ElementOf<Value> = Value extends readonly (infer Element)[]
  ? Element
  : never;

type _ElementCheck = Expect<Equal<ElementOf<readonly string[]>, string>>;
```

Place `@ts-expect-error` with a reason directly above each intentionally rejected expression. Use the repository's existing type-test runner.

Prove:

- expected inference;
- rejected inputs;
- union distribution or intentional non-distribution;
- readonly and optional modifiers;
- recursion boundaries;
- public declaration output for libraries.

Small fixtures keep failures local. A contract that requires pages of fixtures should be simplified before the suite expands.

## Completion

Every important relationship has positive and negative evidence, expected errors include reasons, and the complete repository typecheck passes.
