# Public API quality

Consumers depend on inference, declarations, behavior, and compatibility as one contract.

- Export every owner type that appears in a public signature, including constraints and result variants.
- Annotate public and ownership boundaries; infer private locals unless an annotation adds evidence.
- Document behavior invisible to the type system: side effects, caching, ordering, failure, deprecation, and usage.
- Test complex inference, rejected calls, modifiers, union distribution, declaration output, and runtime behavior.
- Inspect inferred types through editor or LSP navigation.
- Measure expensive public types with `tsc --extendedDiagnostics` and simplify deep recursion first.
- Generate large external contracts from schemas.
- Publish source maps when supported runtime deployments require production traces.

For third-party integration, define an owned port when isolating dependency semantics. Import a stable exported type when the dependency owns the contract so one source controls its evolution.

Treat `skipLibCheck` as a measured repository compatibility or performance decision.

## Completion

Every public signature exposes its owner types, declaration output matches intended inference, compatibility targets pass, behavioral tests pass, and measured type cost is acceptable.
