#!/usr/bin/env python3
"""Verify Pi discovers a package's skills and prompts exactly once via RPC.

This smoke test makes no model request and needs no provider credentials.
"""

from __future__ import annotations

import argparse
import json
import subprocess
from collections import Counter
from pathlib import Path
from typing import Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", nargs="?", default=".", help="Pi package root")
    parser.add_argument("--pi", default="pi", help="Pi executable (default: pi)")
    parser.add_argument("--timeout", type=float, default=20.0, help="seconds to wait for RPC response")
    parser.add_argument("--json", action="store_true", dest="as_json")
    return parser.parse_args()


def print_report(report: dict[str, Any], as_json: bool) -> None:
    if as_json:
        print(json.dumps(report, indent=2))
        return
    if report["ok"]:
        print(f"Pi resource smoke passed: {report['skills']} skill(s), {report['prompts']} prompt(s)")
        return
    print("Pi resource smoke failed")
    for key in ("missingOrDuplicate", "wrongSource", "protocolErrors"):
        if report.get(key):
            print(f"- {key}: {report[key]}")
    if report.get("stderr"):
        print(f"- stderr: {report['stderr']}")


def main() -> int:
    args = parse_args()
    root = Path(args.path).resolve()
    skills = sorted((root / "skills").rglob("SKILL.md")) if (root / "skills").exists() else []
    prompts = sorted((root / "prompts").glob("*.md")) if (root / "prompts").exists() else []
    expected = {f"skill:{path.parent.name}": "skill" for path in skills}
    expected.update({path.stem: "prompt" for path in prompts})

    command = [
        args.pi,
        "--mode",
        "rpc",
        "--no-session",
        "--no-tools",
        "--no-extensions",
        "--no-skills",
        "--no-prompt-templates",
        "--no-context-files",
    ]
    for path in skills:
        command.extend(("--skill", str(path)))
    for path in prompts:
        command.extend(("--prompt-template", str(path)))

    request = json.dumps({"id": "pi-harness-smoke", "type": "get_commands"}) + "\n"
    try:
        completed = subprocess.run(
            command,
            input=request,
            capture_output=True,
            text=True,
            timeout=args.timeout,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as error:
        report = {
            "ok": False,
            "skills": len(skills),
            "prompts": len(prompts),
            "missingOrDuplicate": sorted(expected),
            "wrongSource": [],
            "protocolErrors": [f"could not complete Pi RPC smoke: {error}"],
            "stderr": None,
        }
        print_report(report, args.as_json)
        return 1

    response: dict[str, Any] | None = None
    protocol_errors: list[str] = []
    for line in completed.stdout.splitlines():
        try:
            event = json.loads(line)
        except json.JSONDecodeError as error:
            protocol_errors.append(f"invalid JSONL from Pi: {error}")
            continue
        if event.get("type") == "response" and event.get("id") == "pi-harness-smoke":
            response = event
            break

    commands = response.get("data", {}).get("commands", []) if response and response.get("success") else []
    observed = Counter(item.get("name") for item in commands if isinstance(item, dict))
    wrong_source = [
        name
        for name, source in expected.items()
        if not any(item.get("name") == name and item.get("source") == source for item in commands)
    ]
    missing_or_duplicate = [name for name in expected if observed[name] != 1]
    if response is None:
        protocol_errors.append("no get_commands response")
    elif not response.get("success"):
        protocol_errors.append(str(response.get("error", "get_commands failed")))
    if completed.returncode != 0:
        protocol_errors.append(f"Pi exited with status {completed.returncode}")

    report = {
        "ok": not protocol_errors and not wrong_source and not missing_or_duplicate,
        "skills": len(skills),
        "prompts": len(prompts),
        "missingOrDuplicate": sorted(missing_or_duplicate),
        "wrongSource": sorted(wrong_source),
        "protocolErrors": protocol_errors,
        "stderr": completed.stderr.strip() or None,
    }
    print_report(report, args.as_json)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
