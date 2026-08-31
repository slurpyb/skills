# Type testing

Load when conditional, mapped, inferred, or template-literal types encode important behavior. Why: runtime tests cannot detect type-level regressions.

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

For invalid calls, use `@ts-expect-error` with a reason and place it directly above the failing expression. Prefer the repository's existing type-test runner; do not add a second framework without need.

Test:

- expected inference,
- rejected inputs,
- union distribution or intentional non-distribution,
- readonly and optional modifiers,
- recursion boundaries,
- public declaration output for libraries.

Keep fixtures small. If a type needs many pages of tests, simplify its contract before expanding the suite.

Next: return to the `SKILL.md` done gate and run the complete typecheck.
