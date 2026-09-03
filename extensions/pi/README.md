# Pi Harness

Resource-only Pi package for configuring Pi, building SDK-native tools and integrations, authoring skills/prompts, reconstructing focused MCP capabilities, and validating the result. Extension authoring is deliberately excluded.

```bash
pi install npm:@slurpyb/pi-harness
pi config
```

Local checkout:

```bash
pi install -l ./plugins/pi
```

The package ships six skills, seven `/pi-*` prompt templates, a reusable `AGENTS.md` source fragment, a static validator, and a credential-free RPC discovery smoke test.

```bash
npm run validate
npm test
npm run smoke
```

See `docs/plugins/pi/README.md` in the catalog repository for the complete inventory.
