# davidondrej-skills

David Ondrej's skills: agent orchestration, skill authoring, web research, thinking, ops.

## API keys and env vars

| Variable | Needed by | For |
|---|---|---|
| `DEEPAPI_API_KEY` | `deepapi`, `deep-research`, `online-shopping`, `youtube-transcript`, `risky-changes` | Auth to DeepAPI search, scrape, research, and shopping |
| `DEEPAPI_API_BASE_URL` | same skills | DeepAPI host; default `https://deepapi.co` |
| `FIREFLIES_API_KEY` | `fireflies-transcript` | Fireflies GraphQL meeting transcripts |
| `OPENROUTER_API_KEY` | `run-deep-swe`, `pi-custom-model` | DeepSWE scoring and Pi custom-model auth |
| `BH_DOMAIN_SKILLS` | `browser-harness` | Set `1` to load per-site playbooks |
