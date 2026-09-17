---
name: cli-agentify-investigation
description: How to deeply study a CLI tool before writing agent docs. Covers source reading, help output, gotcha detection, and building a mental model of the tool's failure modes.
---

# Investigation Phase

Before writing a single line of AGENTS.md, build a complete mental model of the tool.
The goal: find the **#1 thing agents will get wrong** — that becomes the first section.

---

## Step 1: Read the Source

For interpreted CLIs (Python, Node, Ruby), always read the source. It reveals:
- Which flags are global vs subcommand-local
- How flags interact (mutual exclusivity, precedence)
- Input validation rules that aren't obvious from `--help`
- Exit codes and error behaviour
- How stdin / environment variables are handled

```bash
# Python (Typer, Click, argparse)
find . -name "*.py" | grep -v __pycache__ | head -20
cat pyproject.toml  # entry point → find main module

# Node (commander, yargs, oclif)
cat package.json | jq '.bin'
find src -name "*.ts" -o -name "*.js" | head -20

# Go
find . -name "*.go" | grep -v _test | head -20

# Rust
cat Cargo.toml
find src -name "*.rs" | head -20
```

**What to look for in source:**
- Where global state / context object is set up (Typer: `app.callback()`, Click: `@click.pass_context`)
- Any flags that must precede subcommands (framework-level constraint)
- JSON/stdin input parsing logic
- Output format switching (text vs JSON vs pretty)
- Error handling: what raises SystemExit and with what code

---

## Step 2: Run `--help` at Every Level

```bash
# Root help
<tool> --help

# Each subcommand
<tool> <subcommand> --help

# Shell completion (reveals hidden flags)
<tool> --show-completion 2>/dev/null || true
```

**Read the help output looking for:**
- Flags listed under root `[OPTIONS]` vs under subcommand `[OPTIONS]`
- Any flag in the root section **cannot** trail after a subcommand
- Examples in the help text — are they consistent? Do they reveal idioms?
- Argument types: positional vs `--flag` vs `--flag VALUE`

---

## Step 3: Identify the #1 Agent Gotcha

Every CLI has one thing agents reliably get wrong. Find it before writing anything.

**Common gotcha patterns:**

| Pattern | Example | Trigger |
|---------|---------|---------|
| Global flags before subcommand | `--text`, `--pretty`, `--api-key` in Typer root callback | Framework routes unknown trailing flags to nowhere |
| Environment variable required | `PERPLEXITY_API_KEY`, `GITHUB_TOKEN` | Missing → confusing error |
| Input format ambiguity | positional vs `--json` vs stdin | Agents guess wrong |
| Subcommand confusion | `search` vs `ask` vs `query` | Wrong tool for the job |
| Flag name mismatch | CLI uses `--max-results`, JSON uses `max_results` | Snake vs kebab |
| Array vs string | `--domains a,b` (string) vs `"domains": ["a","b"]` (array) | Schema mismatch |

**How to confirm a gotcha:**
```bash
# Test the wrong usage to see what actually happens
<tool> subcommand "arg" --global-flag   # does it error? silently ignore?
<tool> --global-flag subcommand "arg"   # correct usage
```

Typer and many CLIs **silently ignore** unrecognized trailing flags — making the mistake invisible until the agent wonders why the output format didn't change.

---

## Step 4: Map the Full Command Surface

Build a mental model before writing docs:

```
Questions to answer:
- How many subcommands?
- Which flags are shared across subcommands?
- Is there a JSON input mode? Stdin? Both?
- What does the default output look like? (run a real query)
- What are the output formats? How do agents consume each?
- What are the exit codes?
- Is there streaming? If so, where do chunks vs final output go?
- What requires authentication? How is it provided?
```

---

## Step 5: Run a Real Query (if safe)

If the tool has a test/dry-run mode or costs nothing, run it:

```bash
# See actual output shape
<tool> <subcommand> "test query" 2>&1 | head -20

# Compare formats
<tool> <subcommand> "test"           # default
<tool> --pretty <subcommand> "test"  # pretty
<tool> --text <subcommand> "test"    # text
```

Seeing real output is worth more than reading the source for understanding output schemas.

---

## Investigation Checklist

Before moving on, you should be able to answer all of these:

- [ ] What is the entry point / binary name?
- [ ] What are all the subcommands?
- [ ] Which flags are global (root-level) vs per-subcommand?
- [ ] What is the #1 thing agents will get wrong?
- [ ] What does default output look like? How does an agent parse it?
- [ ] Is there a JSON input mode? What is the schema?
- [ ] How is authentication handled?
- [ ] What are the exit codes?
- [ ] Is there streaming? How does it behave in agent (non-tty) context?
- [ ] What are the available models/modes/providers (if applicable)?
