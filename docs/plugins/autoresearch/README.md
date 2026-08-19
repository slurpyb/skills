# autoresearch

Autonomous research loop: edit an artifact, score it, keep improvements, iterate via a Stop hook.

## API keys and env vars

| Variable | Needed by | For |
|---|---|---|
| `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` | Claude Code session | Set `0` (or above the experiment count) before long runs; default cap is 8 |
