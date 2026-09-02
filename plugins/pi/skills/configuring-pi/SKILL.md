---
name: configuring-pi
description: Configures Pi settings, models, resources, trust, and environment behavior. Use when editing settings.json or models.json, selecting tools or models, changing package/resource loading, or diagnosing configuration precedence.
metadata:
  version: "0.1.0"
---

# Configuring Pi

Treat configuration as a layered system, not one JSON blob.

## Workflow

1. Classify the change as process environment, global settings, project settings, model catalog, or package filter. **Complete when:** one owning layer and its override behavior are named.
2. Read `references/settings.md` for settings and trust, or `references/models.md` for provider/model entries. **Complete when:** every proposed key has a documented type and location.
3. Inspect the current files and preserve unrelated keys. Keep credentials in environment variables, `/login`, or command-backed resolution. **Complete when:** the diff contains no literal secret.
4. Apply the smallest valid change at the narrowest scope. **Complete when:** global behavior stays global and project behavior stays project-local.
5. Run `python3 <plugin-root>/scripts/validate-pi-harness.py <target>`, then smoke with `pi --list-models`, `pi config`, or a no-session print run as appropriate. **Complete when:** validation has no errors and the intended resource/model is observable.

## Boundaries

- Prefer `models.json` for supported OpenAI, Anthropic, or Google-compatible endpoints.
- Custom provider code and extension authoring are a separate project.
- Project `.pi` resources and project `.agents/skills` require trust; context files load independently unless disabled. Non-interactive runs need a saved decision or explicit `--approve`.

## References

- `references/settings.md` — scopes, precedence, resources, tools, and trust
- `references/models.md` — custom model catalogs and authentication-safe values
