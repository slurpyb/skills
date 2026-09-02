---
description: Design, implement, and evaluate one SDK-native Pi tool
argument-hint: "<tool goal> [constraints]"
---
Use the `building-pi-tools` skill.

Build one SDK-native Pi tool for: $ARGUMENTS

Deliver the TypeBox schema, `defineTool` implementation, direct-`execute()` tests, and SDK `customTools` wiring. Define the `details` contract before implementation. Keep credentials external. Extension registration, lifecycle hooks, commands, and TUI are out of scope.

Done means typecheck and tests pass, cancellation/headless behavior is covered where relevant, and recorded positive/negative trigger smokes show the tool is called only when intended.
