# Custom model catalogs

Use `~/.pi/agent/models.json` when the endpoint speaks one of Pi's supported APIs:

- `openai-completions`
- `openai-responses`
- `anthropic-messages`
- `google-generative-ai`

A non-built-in provider with models needs `baseUrl` and an API at provider or model level. Each model needs `id`; other fields refine behavior: `name`, `reasoning`, `thinkingLevelMap`, `input`, `contextWindow`, `maxTokens`, `samplingParams`, `cost`, and `compat`.

## Authentication-safe values

`apiKey` and header values support:

- `$ENV_VAR` or `${ENV_VAR}` interpolation
- `!command` to resolve stdout at request time
- literals for non-secret placeholders such as local Ollama's ignored key

Use `$$` for a literal dollar and `$!` for a literal leading bang. Plain uppercase text is a literal, not an environment lookup. Keep real credentials out of versioned JSON.

## Composition

- A provider entry with only `baseUrl` or headers can redirect a built-in provider while keeping its model list.
- Custom `models` are upserted by id alongside built-ins; a matching id replaces that model.
- `modelOverrides` changes known built-in or registered models and ignores unknown ids.
- Provider-level `compat` supplies defaults; model-level `compat` overrides them.
- The file reloads when `/model` opens.

## Verification

1. Parse and validate the file.
2. Run `pi --list-models <provider-or-model-fragment>`.
3. Confirm auth availability separately; a parsed model may remain unavailable without credentials.
4. Select the model and run a bounded no-session prompt.

## Completion

A model entry is complete when it appears under the expected provider, resolves authentication without committed secrets, and passes one bounded request with the intended thinking/input capabilities.
