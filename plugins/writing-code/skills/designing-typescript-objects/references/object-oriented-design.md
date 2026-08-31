# Object-oriented design

Load when choosing interfaces, abstract classes, inheritance, composition, or polymorphic hooks. Why: abstraction should own behavior and invariants rather than merely rename structure.

Use:

- interfaces for ports, capabilities, and consumer-extensible contracts;
- abstract classes for shared state, invariant-preserving behavior, and Template Method lifecycles;
- concrete classes for domain or infrastructure behavior;
- aliases for unions, tuples, mapped types, and computed relationships.

```ts
abstract class ImportJob<Input, Output> {
  async execute(input: Input): Promise<Output> {
    await this.before(input);
    const output = await this.perform(input);
    await this.after(output);
    return output;
  }

  protected async before(input: Input): Promise<void> {
    void input;
  }

  protected abstract perform(input: Input): Promise<Output>;

  protected async after(output: Output): Promise<void> {
    void output;
  }
}
```

Inheritance is appropriate when the base owns a stable lifecycle and subclasses vary through narrow protected hooks. Prefer composition when behaviors vary independently, runtime replacement matters, or subclasses would override unrelated methods.

Keep base contracts substitutable: do not strengthen preconditions, weaken results, expose mutable protected bags, or require subclasses to know storage details. Deep hierarchies are acceptable when each level adds a coherent invariant; depth without ownership is ceremony.

Inject owned interfaces instead of mocking modules. Tests can use concrete fakes or in-memory implementations through the same port.

Next: load `construction-patterns.md`, `persistence-patterns.md`, or `mixins-and-inheritance.md` for the relevant architecture; otherwise this step ends here.
