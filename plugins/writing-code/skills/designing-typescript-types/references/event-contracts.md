# Correlated contracts

Load when keys select different value contracts, such as events, commands, or endpoints. Why: generics should preserve the relationship without open dictionaries or assertions.

```ts
type AccountEvents = {
  created: { accountId: string; owner: string };
  renamed: { accountId: string; name: string };
  closed: { accountId: string };
};

type Listeners<Events> = {
  [Name in keyof Events]?: Array<(event: Events[Name]) => void>;
};

class EventEmitter<Events> {
  private readonly listeners: Listeners<Events> = {};

  on<Name extends keyof Events>(
    name: Name,
    listener: (event: Events[Name]) => void,
  ): void {
    const existing = this.listeners[name];
    if (existing === undefined) {
      this.listeners[name] = [listener];
      return;
    }
    existing.push(listener);
  }

  emit<Name extends keyof Events>(name: Name, event: Events[Name]): void {
    for (const listener of this.listeners[name] ?? []) listener(event);
  }
}
```

Use the same indexed-access pattern for endpoint request/response maps. Parse network responses before returning the selected domain contract; compile-time correlation cannot validate runtime data.

Next: load `type-testing.md` to lock the key/value relationship with fixtures; otherwise this step ends here.
