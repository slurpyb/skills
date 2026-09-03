# C3.x Codebase Analysis

C3.x is the deep code-analysis suite that runs on GitHub repos and local
codebases. It goes well beyond reading files — it parses ASTs, detects patterns,
mines tests for real examples, and writes architecture docs. Most agents under-use
this; reach for it whenever a *codebase* (not just docs) is the source.

## The C3.x modules

| Module | What it produces |
| --- | --- |
| **C3.1** Design pattern detection | Strategy, Factory, Singleton, Observer, etc. — where and how used |
| **C3.2** Test example extraction | Working, runnable usage pulled from the test suite |
| **C3.3** How-to guide generation | Step-by-step tutorials synthesized from the code |
| **C3.4** Configuration analysis | 9 config formats parsed, incl. a security scan |
| **C3.5** Architecture overview | High-level structure + component relationships |
| **C3.7** Architectural pattern detection | MVC, MVVM, layered, hexagonal, etc. |

Languages: 27+ incl. Python, JavaScript/TypeScript, Go, Rust, C++, C#, Java,
GDScript (Godot signal-flow analysis). AST parsing is deepest for Python, JS, TS,
Java, C++, Go.

## How to trigger it

**CLI — local codebase:**
```bash
skill-seekers create ./my-project -p comprehensive   # full C3.x (no --target on create)
```

**CLI — GitHub repo (auto-detected, or `--repo`):**
```bash
skill-seekers create owner/repo -p comprehensive     # 3.6: no `github` subcommand
# already-cloned repo (skips re-clone/file fetches; still makes one GET /repos/… call — token advised):
skill-seekers create --local-repo-path /tmp/repo -p comprehensive
```

**MCP:** "Analyze this codebase comprehensively", or call `scrape_codebase`
(`{ comprehensive: true }`), then `detect_patterns` / `extract_test_examples` /
`build_how_to_guides` individually.

**Config:** set `enable_codebase_analysis: true` + `code_analysis_depth` on a
GitHub source (see config-schema.md).

## Choosing a depth

| `create` preset (`-p`) | Time | Includes |
| --- | --- | --- |
| `quick` | 1–2 min | File structure, imports, entry points, basic metadata |
| `standard` | 5–10 min | + function/class signatures, API docs, common patterns |
| `comprehensive` | 20–60 min | + C3.1 patterns, C3.2 tests, C3.3 guides, C3.4 config, C3.7 architecture |

> On the CLI, depth is the **`-p`/`--preset`** value (`quick` \| `standard` \|
> `comprehensive`) — there is no `--code-analysis-depth` flag in 3.6. The
> finer-grained `code_analysis_depth` (`surface` \| `deep` \| `full`, `full` =
> complete AST) lives only on a **config** GitHub source (see config-schema.md).

Pick `surface` to map an unfamiliar repo fast; `deep`/`comprehensive` when you want
the skill to teach patterns and real usage. Scope `file_patterns` to the core dirs
(`src/**`, `packages/*/src/**`) so analysis time is spent where it matters.

## Three-stream GitHub fetcher (v3.0+)

GitHub sources pull three parallel streams that get merged:
1. **Code** — files + AST analysis.
2. **Docs** — README from every directory, plus markdown docs.
3. **Issues** — open/closed issues & PRs (when `include_issues` — `fetch_issues` is a DEAD key in 3.6).

It also performs **conflict detection**: comparing documented behavior against the
actual code implementation, surfacing drift between docs and source.

## Output layout

```
output/{repo-name}/
├── SKILL.md
├── references/
│   ├── index.md
│   ├── api_reference.md
│   ├── code_examples.md          # from C3.2 test extraction
│   └── github_issues.md
└── c3_analysis_temp/
    ├── patterns/                 # C3.1 / C3.7
    ├── test_examples/            # C3.2
    └── config_patterns/          # C3.4
```

## Tips

- Set `GITHUB_TOKEN` before any repo analysis: lifts rate limit 60→5000/hr and is
  required for private repos.
- Deep analysis of a large repo can take an hour — run `estimate_pages` / `estimate`
  first, and rely on auto-checkpointing (`resume <job-id>`) if interrupted.
- Local enhancement (no API key set; force with `env -u ANTHROPIC_API_KEY … --agent claude`)
  pairs well with deep analysis to turn raw extractions into curated guides — for free.
  **There is no `--enhance-mode` flag**; mode = API-key presence.
- C3.4's config security scan is a quick way to flag risky settings in a repo's
  config files without a separate tool.
- **`extract-test-examples` matches only `.test.`/`__tests__`** — `.spec.ts` suites yield 0 examples. API-reference extraction captures classes+functions but **misses TS `type`/`interface`/`enum`** (a real gap for parser/type-heavy packages).
- **`-p`/preset is a no-op for unified configs** (C3.x is hardcoded deep+all-features in unified mode). Run the free recon tools first — `detect_patterns` / `extract_test_examples` / `extract_config_patterns` ($0, no AI) — to scope before spending.
