---
description: Start or inspect the AI Engineer loop (codegraph → gather → template → review → fan-out)
---

Start an AI Engineer orchestration job for: $@

Loop (do not skip gates):
1. codegraph (map/search/symbol/deps) until the job is understood
2. gather_materials in parallel — read-only recon, iterative retrieval max 3 cycles
3. prompt_template fill using those materials (`task` for workers, `gather` for recon)
4. review_prompt on every draft (rubric; subagent for high-risk packets)
5. fanout_tasks only for approved prompts

If $@ is empty, report the current job phase and stop.
Load skills/orchestration/SKILL.md if the next tool is unclear.
