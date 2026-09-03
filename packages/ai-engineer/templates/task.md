---
name: task
description: Sealed worker packet for the second fan-out. Fill from gathered materials. Review before fanout_tasks.
---

# Objective
{{goal}}

# Context
{{materials}}

{{#if codegraph}}
# Codegraph
{{codegraph}}
{{/if}}

# Instructions
{{instructions}}

# Output Format
{{format}}

# Constraints
- Stay inside the files and facts above. If a fact is missing, say so and stop.
- One objective. No nested spawn.
- Parent owns synthesis and any write outside this packet.
- Forbidden: expanding scope, rewriting the packet, implementing adjacent work.
