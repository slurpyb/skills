# Pi rulebook extension boilerplate

Copy this directory, then program the extension in place.

```bash
cp -R templates/rulebook-extension-package /path/to/project/tools/my-agent
cd /path/to/project/tools/my-agent
bun install
bun run typecheck
bun test
pi install .
```

Customize only what the role needs:

1. Rename `AGENT_ID`, `AGENT_TITLE`, the extension file, and package metadata.
2. Replace `PROFILE.md` with the role's identity, responsibilities, workflow, boundaries, and completion evidence.
3. Replace `rules/mini.md` and `rules/full.md` with one selected rulebook. Keep them as inert data; do not register a skill.
4. Add deterministic role/project tools in `registerProjectTools()` only when Pi built-ins are insufficient. Add each tool name to `ROLE_TOOLS`.
5. Replace the generic tests with role-specific routing, prompt, tool, failure, cancellation, and non-trigger cases.

The default `/rulebook-agent <task>` command starts a dedicated replacement session. The extension preserves Pi's base prompt and loaded project instructions, adds live Git context, and activates only its curated tools in that session.
