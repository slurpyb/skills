---
description: Make and verify a scoped Pi configuration change
argument-hint: "<configuration goal> [global|project]"
---
Use the `configuring-pi` skill.

Apply this Pi configuration goal: $ARGUMENTS

Identify the owning layer and precedence before editing. Preserve unrelated keys and keep credentials in environment, `/login`, or command-backed resolution. Prefer project scope unless the behavior must apply globally. Custom provider code and extension authoring are out of scope.

Done means static validation has no errors and the change is observable through the narrowest relevant probe (`pi config`, `pi --list-models`, `/model`, `/settings`, or a disposable print run), with trust behavior recorded.
