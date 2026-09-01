# TypeDoc

TypeDoc publishes the source contract the repository intends consumers to see.

1. Inspect existing TypeDoc config, package role, generated-artifact ownership, and CI commands.
2. Query current compatible TypeDoc and plugin versions before changing dependencies.
3. Preserve existing entry points, visibility policy, theme, links, and output ownership unless the task changes them.
4. Exclude private, protected, and internal members according to the repository's publication contract.
5. Enable invalid-link and unexported-symbol validation.
6. Validate documentation in CI; commit generated output only when the repository owns that artifact.

TypeDoc exclusion controls publication. Source comments still serve maintainers and editor hovers. Examples remain owned code and should participate in lint or typechecking where practical.

## Completion

Compatible versions are verified, publication scope matches the public contract, links and symbols validate, CI owns the check, and generated output follows repository policy.
