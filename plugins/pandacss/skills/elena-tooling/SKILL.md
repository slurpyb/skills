---
name: elena-tooling
description: Change or verify Elena build configuration, package exports, CEM and declarations, registration, SSR, framework fixtures, and release validation.
---

# Maintain Elena tooling

Read `agent-os/standards/elena/distribution-and-verification.md`, the relevant tooling and
SSR sections of `docs/engineering/elena-conventions.md`, and the current repository scripts
and configuration before editing tooling. Treat the environment as the command source of
truth; use Bun for repository commands.

Keep source and root exports, component CSS entries, automatic and scoped registration,
Custom Elements Manifest metadata, declarations, React augmentation, SSR registration,
framework consumers, and package publication files synchronized. Register only renderer-
owned primitives with Elena SSR; composites remain pass-through markup. Preserve browser-
safe module evaluation and consumer ownership during hydration.

Build before inspecting generated CEM or declarations. Validate the narrow changed surface
while iterating, then run the complete repository verification gate. A tooling change is
complete only when package validation and all applicable HTML/TypeScript, Astro, React,
Shopify, SSR/hydration, scoped-registration, and clean-consumer paths pass and the worktree
is clean in a committed checkpoint.
