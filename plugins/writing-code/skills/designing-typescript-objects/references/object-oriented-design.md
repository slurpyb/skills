# Object-oriented design

An abstraction earns its place by owning behavior, state, or an invariant.

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

Inheritance fits a stable lifecycle whose subclasses vary through narrow protected hooks. Composition fits independently varying behavior, runtime replacement, or capabilities that cross lifecycle owners.

Base contracts preserve preconditions, results, and invariants. Protected hooks expose the minimum variation point, and each hierarchy level adds one coherent invariant. Tests use concrete fakes or in-memory implementations through owned ports.

## Completion

Every abstraction owns named behavior or an invariant, each variation point is narrow, subclasses remain substitutable, and lifecycle paths are tested through owned contracts.
