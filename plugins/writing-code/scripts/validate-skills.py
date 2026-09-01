#!/usr/bin/env python3
"""Validate writing-code skill packaging and agent-facing invariants."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

PLUGIN_ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = PLUGIN_ROOT / "skills"
MANIFEST = PLUGIN_ROOT / ".claude-plugin" / "plugin.json"
MAX_DESCRIPTION_CHARS = 220
MAX_SKILL_LINES = 80


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)


def frontmatter(text: str, path: Path, failures: list[str]) -> str:
    match = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if match is None:
        fail(f"{path}: missing YAML frontmatter", failures)
        return ""
    return match.group(1)


def field(block: str, name: str) -> str | None:
    match = re.search(rf"^{re.escape(name)}: (.+)$", block, re.MULTILINE)
    return match.group(1).strip().strip('"') if match else None


def main() -> int:
    failures: list[str] = []
    try:
        manifest = json.loads(MANIFEST.read_text())
    except (OSError, json.JSONDecodeError) as error:
        print(f"cannot read plugin manifest: {error}", file=sys.stderr)
        return 1
    version = manifest["version"]

    listed = {
        Path(entry.rstrip("/")).name
        for entry in manifest.get("skills", [])
    }
    present = {path.name for path in SKILLS_ROOT.iterdir() if path.is_dir()}
    if listed != present:
        fail(
            f"manifest skill set differs from directories: listed={sorted(listed)} present={sorted(present)}",
            failures,
        )

    for directory in sorted(SKILLS_ROOT.iterdir()):
        if not directory.is_dir():
            continue
        skill_path = directory / "SKILL.md"
        if not skill_path.exists():
            fail(f"{directory}: missing SKILL.md", failures)
            continue

        text = skill_path.read_text()
        block = frontmatter(text, skill_path, failures)
        name = field(block, "name")
        description = field(block, "description")
        skill_version_match = re.search(
            r"^metadata:\n(?:  .+\n)*?  version: [\"']?([^\"'\n]+)",
            block,
            re.MULTILINE,
        )
        skill_version = skill_version_match.group(1) if skill_version_match else None

        if name != directory.name:
            fail(f"{skill_path}: name {name!r} does not match directory", failures)
        if skill_version != version:
            fail(f"{skill_path}: version {skill_version!r} does not match plugin {version}", failures)
        if description is None or ". Use when " not in description:
            fail(f"{skill_path}: description needs one capability sentence and one Use when sentence", failures)
        elif len(description) > MAX_DESCRIPTION_CHARS:
            fail(
                f"{skill_path}: description is {len(description)} chars; max is {MAX_DESCRIPTION_CHARS}",
                failures,
            )
        if len(text.splitlines()) > MAX_SKILL_LINES:
            fail(f"{skill_path}: exceeds {MAX_SKILL_LINES} lines", failures)

        workflow = re.search(r"## Workflow\n(.*?)(?=\n## |\Z)", text, re.DOTALL)
        if workflow is None:
            fail(f"{skill_path}: missing Workflow section", failures)
        else:
            steps = re.findall(r"^\d+\. .+$", workflow.group(1), re.MULTILINE)
            if not steps:
                fail(f"{skill_path}: workflow has no numbered steps", failures)
            for step in steps:
                if "Complete when" not in step:
                    fail(f"{skill_path}: step lacks completion criterion: {step}", failures)

        linked = set(re.findall(r"`(references/[^`]+\.md)`", text))
        reference_dir = directory / "references"
        present_refs = (
            {f"references/{path.name}" for path in reference_dir.glob("*.md")}
            if reference_dir.exists()
            else set()
        )
        if linked != present_refs:
            fail(
                f"{skill_path}: reference pointers differ from files: linked={sorted(linked)} present={sorted(present_refs)}",
                failures,
            )
        for relative in present_refs:
            reference = directory / relative
            reference_text = reference.read_text()
            if "Load when" in reference_text or "Next:" in reference_text:
                fail(f"{reference}: contains stale routing prose", failures)
            if "## Completion" not in reference_text:
                fail(f"{reference}: missing local completion criterion", failures)

    if failures:
        print("writing-code validation failed:", file=sys.stderr)
        for message in failures:
            print(f"- {message}", file=sys.stderr)
        return 1

    print(f"writing-code validation passed: {len(present)} skills, version {version}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
