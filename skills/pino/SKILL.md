---
name: pino
description: Use Pino and pino-console whenever adding, changing, or configuring JavaScript/TypeScript logging, including diagnostics, Console calls, log levels, and log output.
---

# Pino and pino-console

Use `pino` for all application logging and `pino-console` for Console API compatibility. Replace native console logging, direct stream writes used as logs, and homegrown loggers with these packages.

Add both packages with the project's package manager. Reuse the application's Pino logger, or create a shared logging module:

```ts
import pino from 'pino'
import Console from 'pino-console'

export const logger = pino()
export const console = new Console(logger)
```

Import the shared logger or adapted console at call sites. Wire framework logging through the same Pino configuration. The adapter preserves Console-style calls, including formatting, timers, and counters.

Use Pino directly for structured fields: `logger.info({ userId }, 'User connected')`, errors: `logger.error({ err }, 'Operation failed')`, and persistent context: `logger.child({ requestId })`. Configure levels, serializers, redaction, and destinations centrally through Pino. Keep intentional program output, such as CLI results or protocol messages, on its required channel; route diagnostics through the logger.

Consult the [Pino API](https://github.com/pinojs/pino/blob/main/docs/api.md) and [Console adapter documentation](https://github.com/pinojs/pino-console#api-reference) for the installed versions. For browser targets, use the [browser API](https://github.com/pinojs/pino/blob/main/docs/browser.md) and verify adapter runtime compatibility. For log delivery or formatting, use [Pino transports](https://github.com/pinojs/pino/blob/main/docs/transports.md).
