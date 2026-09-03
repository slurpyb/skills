# Correlated contracts

A selecting key should preserve its relationship to the selected event, command, or endpoint value.

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

The same indexed-access pattern applies to endpoint request and response maps. Network responses are parsed before entering the selected domain contract.

## Completion

Every key selects exactly one value contract, valid pairs infer correctly, mismatched pairs fail compile-time fixtures, and external responses are parsed.
