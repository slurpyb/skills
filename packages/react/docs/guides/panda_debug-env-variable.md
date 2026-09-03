---
title: "PANDA_DEBUG env variable"
---

You can prefix any of the Panda CLI command with the `PANDA_DEBUG` environment variable to show debug logs.

```bash
PANDA_DEBUG=* pnpm panda
```

This can be useful to check if a specific file is being processed or not, or if a specific function/component has been
extracted.

```
❯ PANDA_DEBUG=* pnpm panda cssgen
🐼 debug [config:path] /Users/astahmer/dev/open-source/panda-clone/website/panda.config.ts
🐼 debug [ast:import] Found import { css } in /Users/astahmer/dev/open-source/panda-clone/website/theme.config.tsx
🐼 debug [ast:Icon] { kind: 'component' }
🐼 debug [ast:css] { kind: 'function' }
🐼 debug [hrtime] Parsed /Users/astahmer/dev/open-source/panda-clone/website/theme.config.tsx (9.66ms)
🐼 debug [ast:import] Found import { css } in /Users/astahmer/dev/open-source/panda-clone/website/src/DEFAULT_THEME.tsx
🐼 debug [ast:DiscordIcon] { kind: 'component' }
🐼 debug [ast:css] { kind: 'function' }
🐼 debug [ast:Anchor] { kind: 'component' }
🐼 debug [ast:GitHubIcon] { kind: 'component' }
🐼 debug [ast:Flexsearch] { kind: 'component' }
🐼 debug [ast:MatchSorterSearch] { kind: 'component' }
🐼 debug [hrtime] Parsed /Users/astahmer/dev/open-source/panda-clone/website/src/DEFAULT_THEME.tsx (4.51ms)
🐼 debug [ast:import] No import found in /Users/astahmer/dev/open-source/panda-clone/website/src/constants.tsx
🐼 debug [hrtime] Parsed /Users/astahmer/dev/open-source/panda-clone/website/src/constants.tsx (4.23ms)
🐼 debug [ast:import] Found import { css } in /Users/astahmer/dev/open-source/panda-clone/website/src/index.tsx
🐼 debug [ast:css] { kind: 'function' }
```