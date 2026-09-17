#!/usr/bin/env -S uv run --quiet
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""dr-coverage.py — compute facet-axis coverage matrix across all round manifests.

Reads <workdir>/resources/<YYYYMMDD>-run-config.json to learn the axis set,
walks the round manifests for that run-date, and prints which axes are
covered, partial, or uncovered. Uncovered axes become TODOs the operator
must address (or justify in SUMMARY.md > Limitations).

Usage:
  dr-coverage.py --resources <workdir>/resources [--run-date YYYYMMDD] [--json]
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path


def latest_run_date(resources_dir: Path) -> str | None:
    candidates = sorted(resources_dir.glob("*-run-config.json"))
    if not candidates:
        return None
    return candidates[-1].name.split("-run-config.json")[0]


def load_manifests(resources_dir: Path, run_date: str) -> list[dict]:
    manifests = []
    for path in sorted(resources_dir.glob(f"{run_date}-r*-manifest.json")):
        try:
            manifests.append(json.loads(path.read_text()))
        except json.JSONDecodeError:
            continue
    return manifests


def compute_coverage(config: dict, manifests: list[dict]) -> dict:
    axes = list(config.get("facet_axes", []))
    artifact_count = defaultdict(int)
    source_types = defaultdict(set)

    for m in manifests:
        axis = m.get("facet_axis")
        artifact_count[axis] += len(m.get("artifacts", []))
        for s in m.get("source_mix", []):
            source_types[axis].add(s)

    coverage: dict[str, dict] = {}
    for axis in axes:
        n_artifacts = artifact_count.get(axis, 0)
        n_source_types = len(source_types.get(axis, set()))
        if n_artifacts >= 3 and n_source_types >= 2:
            status = "covered"
        elif n_artifacts > 0:
            status = "partial"
        else:
            status = "uncovered"
        coverage[axis] = {
            "status": status,
            "artifact_count": n_artifacts,
            "source_types": sorted(source_types.get(axis, set())),
        }

    # Include axes that appeared in manifests but weren't in the config (drift).
    for axis in artifact_count:
        if axis not in coverage and axis:
            coverage[axis] = {
                "status": "drift",
                "artifact_count": artifact_count[axis],
                "source_types": sorted(source_types.get(axis, set())),
            }
    return coverage


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--resources", type=Path, required=True)
    p.add_argument("--run-date")
    p.add_argument("--json", action="store_true")
    args = p.parse_args()

    if not args.resources.is_dir():
        print(f"error: resources dir not found: {args.resources}", file=sys.stderr)
        return 2

    run_date = args.run_date or latest_run_date(args.resources)
    if not run_date:
        print("error: no run-config.json found in resources/", file=sys.stderr)
        return 2

    config_path = args.resources / f"{run_date}-run-config.json"
    if not config_path.is_file():
        print(f"error: missing config: {config_path}", file=sys.stderr)
        return 2

    config = json.loads(config_path.read_text())
    manifests = load_manifests(args.resources, run_date)
    coverage = compute_coverage(config, manifests)

    todos = [axis for axis, info in coverage.items() if info["status"] in ("uncovered", "partial")]

    if args.json:
        print(json.dumps({
            "status": "ok" if not todos else "todo",
            "run_date": run_date,
            "topic": config.get("topic"),
            "coverage": coverage,
            "todos": todos,
            "manifests": len(manifests),
        }, indent=2))
        return 0

    print(f"coverage report for {config.get('topic')!r} (run {run_date})")
    print(f"  manifests scanned: {len(manifests)}")
    print()
    print(f"  {'AXIS':<32}{'STATUS':<14}ARTIFACTS  SOURCES")
    for axis, info in coverage.items():
        sources_repr = ",".join(info["source_types"]) or "-"
        print(f"  {axis:<32}{info['status']:<14}{info['artifact_count']:<10} {sources_repr}")
    print()
    if todos:
        print("TODO — uncovered or partial axes:")
        for axis in todos:
            print(f"  - {axis} ({coverage[axis]['status']})")
        return 1
    print("all axes covered.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
