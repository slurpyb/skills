---
name: research-based-solutions
description: Runs an approval-gated research-to-execution process: offers parallel independent research, synthesizes the evidence into a proposed solution, then carries it out and verifies the result after approval. Use when the user asks for a researched, reliable, conventional, or best-practice solution; requests examples or comparison before action; or presents a non-obvious problem with multiple plausible approaches.
---

# Research-based solutions

Turn an open problem into an agreed solution before acting on it.

## Offer

Briefly offer a research-first workflow before beginning execution. State what uncertainty the research will resolve and the independent perspectives you propose to investigate. An explicit request for research or this workflow counts as approval to begin the research stage.

## Frame

Write a compact research brief containing:

- the outcome the user wants;
- known context and constraints;
- questions that must be resolved;
- success criteria; and
- the boundary between research and execution.

The research stage is read-only.

## Fan out

Launch several independent subagents in parallel. Give each one a distinct motivation and question derived from the problem rather than the same generic prompt.

Useful research roles include:

- **Authority** — establish facts from primary sources and official documentation.
- **Context** — inspect the current environment, system, or prior work.
- **Precedent** — find strong examples of comparable solutions.
- **Alternatives** — explore materially different approaches and trade-offs.
- **Adversary** — challenge assumptions and identify failure modes.
- **Experiment** — test a claim in an isolated, reversible environment.

Choose only the roles that add independent evidence. Each prompt must include the shared objective, its unique question, relevant context, source expectations, and a bounded output contract.

Research is complete when the selected perspectives have reported or any evidence gap is explicit.

## Synthesize

Read the complete results and verify decisive claims. Compare areas of agreement, disagreement, differing assumptions, and evidence quality. Select the solution by reasoning across the findings rather than counting recommendations.

The coordinating agent owns the synthesis. Present:

- the recommended solution;
- why the evidence supports it;
- meaningful alternatives and trade-offs;
- expected changes and preserved behavior;
- risks or remaining uncertainty; and
- how the result will be verified.

Ask for approval before execution.

## Execute

After approval, carry out the proposed solution as presented. Use the normal conventions of the environment and keep the work bounded to the agreed scope.

When new evidence changes the proposal materially, return to the user with the changed facts and an updated recommendation before continuing.

## Verify

Verify the observable result and the important underlying assumptions. Prefer direct checks, isolated trials, repeatability tests, and the environment's established validation tools. Clean up temporary research and test artifacts unless the user asked to retain them.

Report what was done, the evidence that it works, any deliberate deviations from the proposal, and the resulting state.

The process is complete when the approved solution has been executed and its success criteria have been demonstrated.
