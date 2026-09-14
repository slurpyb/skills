## Marketplace compatibility

Use `marketplace.config.json` for plugin membership and metadata. Edit skills at their original sources; `marketplace.generated.json` identifies generated files. Regenerate after source changes, then run `marketplace:check` and `test:marketplace`.

Keep stable, WIP, and deprecated catalogs isolated. Preserve each capability when adapting platforms. Require behavioral contract tests for native features; matching manifests or skill counts does not establish parity. Run `marketplace:release` before claiming full compatibility or publishing a release. Existing migration failures remain blockers.

Read [the marketplace guide](docs/marketplaces.md) when changing plugin packaging, discovery, adapters, or distribution.
