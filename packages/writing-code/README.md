# Writing Code

A Pi- and Codex-first Agent Skills pack for TypeScript engineering. Claude Code remains a compatibility target.

## Install

### Pi package

From a checkout of this catalog:

```bash
pi install ./plugins/writing-code
```

Try it for one session without changing settings:

```bash
pi -e ./plugins/writing-code
```

`package.json` exposes `./skills` through `pi.skills`.

### Codex plugin and shared Agent Skills

`.codex-plugin/plugin.json` exposes the pack through Codex's plugin format. For direct personal discovery by both Codex and Pi, install the skill folders into the shared Agent Skills root:

```bash
python3 plugins/writing-code/scripts/install-agent-skills.py
```

The default destination is `~/.agents/skills`. Pass a project destination such as `/path/to/project/.agents/skills`, or add `--copy` when symlinks are unsuitable. The installer preflights every destination and leaves existing skills untouched.

### Claude Code compatibility

```bash
claude plugin install writing-code@slurpyb-agent-skills
```

The compatibility manifest lives at `.claude-plugin/plugin.json`.

## Skills

| Skill | Invocation branch |
| --- | --- |
| `writing-typescript` | Runtime application behavior and I/O boundaries |
| `modeling-typescript-domains` | Business invariants, value objects, outcomes, and lifecycle states |
| `designing-typescript-objects` | Polymorphism, construction, persistence ports, and shared class behavior |
| `designing-typescript-types` | Inference, generic relationships, and compile-time fixtures |
| `documenting-typescript` | TSDoc, TypeDoc, and published API surfaces |
| `configuring-typescript` | Compiler and package-boundary configuration |
| `installing-typescript-anti-slop` | Bundled Oxlint policy installation and migration |

`writing-typescript` keeps the compatibility identity but owns only runtime implementation. Each specialist has a narrower independent trigger.

## Validation

```bash
python3 plugins/writing-code/scripts/validate-skills.py
```

The validator treats the Pi package and Codex plugin as primary packaging, then checks Claude compatibility, frontmatter identity, version alignment, description budgets, workflow completion criteria, reference reachability, and stale routing prose.
