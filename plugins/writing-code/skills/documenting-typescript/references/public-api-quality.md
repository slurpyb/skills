# Public API quality

Load when exporting a library surface, documenting contracts, or diagnosing complex inferred types. Why: consumers depend on inference, declarations, behavior, and compatibility—not only runtime output.

- Export every owner type appearing in a public signature, including constraints and result variants.
- Annotate public and ownership boundaries; infer private locals and helpers unless an annotation adds evidence.
- Use TSDoc for behavior types cannot express: side effects, caching, ordering, failure modes, deprecation, and examples. Do not restate parameter types.
- Test complex inference, rejected calls, modifiers, union distribution, and declaration output.
- Keep behavioral tests: types prove admissible relationships, not algorithmic correctness.
- Inspect inferred types through editor/LSP navigation rather than guessing.
- Measure expensive type work with `tsc --extendedDiagnostics`; simplify deep recursion before raising compiler limits.
- Generate large external contracts from schemas instead of hand-maintaining type-level replicas.
- Emit and securely publish source maps when the runtime deployment needs debuggable production traces.

For third-party integration, define an owned port when isolating dependency semantics. Import a stable exported type when the dependency truly owns the contract; do not copy a type merely to avoid an import and silently drift.

Treat `skipLibCheck` as a repository compatibility/performance decision. It is not a universal correctness rule.

Next: load `documenting-typescript.md` for TSDoc and TypeDoc, use `designing-typescript-types` for compile-time fixtures, or use `configuring-typescript` for compiler and package settings; otherwise this step ends here.
