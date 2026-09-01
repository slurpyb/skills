# Factories and builders

Construction APIs establish complete valid products from explicit evidence.

```ts
abstract class Factory<Input, Product> {
  abstract create(input: Input): Product;
}

interface DraftOrder {
  readonly customerId: CustomerId;
  readonly lines: readonly OrderLine[];
}

class OrderFactory extends Factory<DraftOrder, Order> {
  create(input: DraftOrder): Order {
    if (input.lines.length === 0) throw new Error("Order requires a line");
    return Order.open(input.customerId, input.lines);
  }
}
```

Choose:

- a static factory for one class's validated construction;
- an injected factory when product selection or dependencies vary;
- a staged generic builder when call order is compile-time behavior;
- schema validation at `build()` when inputs accumulate dynamically.

A builder's returned stages or final schema encode its transitions. Product fields become complete through construction rather than `Partial<Product>` completion or a fabricated assertion. Generic products trace to an input token, constructor, schema, or class-level relationship.

## Completion

Every public construction path yields a complete valid product, each generic output traces to evidence, and tests cover successful construction plus every rejection branch.
