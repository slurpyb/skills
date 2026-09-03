---
name: review
description: Packet for reviewing a subagent-produced prompt before task fan-out.
---

# Objective
Review this worker prompt for the job: {{goal}}

# Prompt under review
{{prompt}}

# Materials the prompt should use
{{materials}}

# Instructions
Score clarity, structure, completeness, guardrails, and grounding in the materials.
Return a single verdict.

# Output Format
VERDICT: APPROVE | REVISE | REJECT
SCORE: 0-10
ISSUES:
- severity: message
REVISION: (only if REVISE) the rewritten prompt, nothing else after it

# Constraints
- Approve only if a worker with fresh context could run it without the parent chat.
- Reject omniscient, ungrounded, or formatless packets.
- Do not implement the task.
