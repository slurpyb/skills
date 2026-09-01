# Compiler performance

Measure typechecking before changing compiler or type design.

1. Run the repository typecheck with `tsc --extendedDiagnostics` or the repository's equivalent compiler invocation.
2. Record total time, memory, files, types, instantiations, and the dominant package or project boundary.
3. Isolate expensive declarations or generic relationships with repository tooling and editor navigation.
4. Simplify deep recursion, repeated distribution, or generated contracts before changing compiler limits.
5. Re-run the same command and compare the measured result.

`skipLibCheck`, broader excludes, and project references are repository-level tradeoffs. Use them only when measurements and package ownership justify the changed checking boundary.

## Completion

Before-and-after diagnostics use the same command, the dominant cost has evidence, the chosen change preserves required checking, and improvement is measured.
