# Factories and builders

Load when construction requires validation, dependency selection, staged inputs, or polymorphic products. Why: construction APIs must establish completeness without recovering it through assertions.

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

Never use `Partial<Product>` followed by `as Product`. Never expose a function-level generic return that callers can choose without an input token, constructor, schema, or class-level generic establishing the relationship.

Builders may be stateful and fluent. Their state transitions must either be encoded in returned builder stages or validated before producing the product. Returning `this` through `any` is not a staged builder.

Next: use `designing-typescript-types` for staged generic relationships or load `mixins-and-inheritance.md` for reusable construction behavior; otherwise this step ends here.
