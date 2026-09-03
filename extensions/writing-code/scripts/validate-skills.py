#!/usr/bin/env python3
"""Validate writing-code packaging and agent-facing invariants."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

PLUGIN_ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = PLUGIN_ROOT / "skills"
PACKAGE = PLUGIN_ROOT / "package.json"
CODEX_MANIFEST = PLUGIN_ROOT / ".codex-plugin" / "plugin.json"
CLAUDE_MANIFEST = PLUGIN_ROOT / ".claude-plugin" / "plugin.json"
MAX_DESCRIPTION_CHARS = 220
MAX_SKILL_LINES = 80


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)


def read_json(path: Path, failures: list[str]) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as error:
        fail(f"{path}: cannot read JSON: {error}", failures)
        return {}
    if not isinstance(value, dict):
        fail(f"{path}: root must be an object", failures)
        return {}
    return value


def frontmatter(text: str, path: Path, failures: list[str]) -> str:
    match = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if match is None:
        fail(f"{path}: missing YAML frontmatter", failures)
        return ""
    return match.group(1)


def field(block: str, name: str) -> str | None:
    match = re.search(rf"^{re.escape(name)}: (.+)$", block, re.MULTILINE)
    return match.group(1).strip().strip('"') if match else None


def validate_packaging(
    package: dict[str, Any],
    codex: dict[str, Any],
    claude: dict[str, Any],
    present: set[str],
    failures: list[str],
) -> str | None:
    version = package.get("version")
    if package.get("name") != "@slurpyb/writing-code":
        fail(f"{PACKAGE}: unexpected package name", failures)
    package_keywords = package.get("keywords")
    if not isinstance(package_keywords, list) or "pi-package" not in package_keywords:
        fail(f"{PACKAGE}: keywords must include pi-package", failures)
    pi_manifest = package.get("pi")
    if not isinstance(pi_manifest, dict) or pi_manifest.get("skills") != ["./skills"]:
        fail(f"{PACKAGE}: pi.skills must expose ./skills", failures)

    if codex.get("name") != "writing-code":
        fail(f"{CODEX_MANIFEST}: unexpected plugin name", failures)
    if codex.get("version") != version:
        fail(f"{CODEX_MANIFEST}: version must match package.json", failures)
    if codex.get("skills") != "./skills/":
        fail(f"{CODEX_MANIFEST}: skills must expose ./skills/", failures)
    interface = codex.get("interface")
    if not isinstance(interface, dict) or interface.get("displayName") != "Writing Code":
        fail(f"{CODEX_MANIFEST}: missing Writing Code interface", failures)

    if claude.get("name") != "writing-code":
        fail(f"{CLAUDE_MANIFEST}: unexpected compatibility plugin name", failures)
    if claude.get("version") != version:
        fail(f"{CLAUDE_MANIFEST}: version must match package.json", failures)
    claude_skills = claude.get("skills")
    listed: set[str] = set()
    if isinstance(claude_skills, list):
        listed = {
            Path(entry.rstrip("/")).name
            for entry in claude_skills
            if isinstance(entry, str)
        }
    if listed != present:
        fail(
            f"{CLAUDE_MANIFEST}: skill set differs from directories: listed={sorted(listed)} present={sorted(present)}",
            failures,
        )
    return version if isinstance(version, str) else None


def validate_skill(directory: Path, version: str | None, failures: list[str]) -> None:
    skill_path = directory / "SKILL.md"
    if not skill_path.exists():
        fail(f"{directory}: missing SKILL.md", failures)
        return

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
        fail(f"{skill_path}: version {skill_version!r} does not match package {version}", failures)
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


def main() -> int:
    failures: list[str] = []
    package = read_json(PACKAGE, failures)
    codex = read_json(CODEX_MANIFEST, failures)
    claude = read_json(CLAUDE_MANIFEST, failures)
    present = {path.name for path in SKILLS_ROOT.iterdir() if path.is_dir()}
    version = validate_packaging(package, codex, claude, present, failures)

    for directory in sorted(SKILLS_ROOT.iterdir()):
        if directory.is_dir():
            validate_skill(directory, version, failures)

    if failures:
        print("writing-code validation failed:", file=sys.stderr)
        for message in failures:
            print(f"- {message}", file=sys.stderr)
        return 1

    print(
        f"writing-code validation passed: {len(present)} skills, version {version}; Pi and Codex primary, Claude compatible"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
