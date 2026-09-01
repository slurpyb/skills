#!/usr/bin/env python3
"""Install writing-code skills into a Pi/Codex Agent Skills root."""

from __future__ import annotations

import argparse
import os
import shutil
import sys
from pathlib import Path

PLUGIN_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = PLUGIN_ROOT / "skills"
DEFAULT_DESTINATION = Path.home() / ".agents" / "skills"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Install writing-code skills for Pi and Codex discovery.",
    )
    parser.add_argument(
        "destination",
        nargs="?",
        type=Path,
        default=DEFAULT_DESTINATION,
        help="Agent Skills root (default: ~/.agents/skills)",
    )
    parser.add_argument(
        "--copy",
        action="store_true",
        help="Copy skill directories instead of creating symlinks.",
    )
    return parser.parse_args()


def target_exists(path: Path) -> bool:
    return os.path.lexists(path)


def remove_created(path: Path) -> None:
    try:
        if path.is_symlink() or path.is_file():
            path.unlink(missing_ok=True)
        elif path.is_dir():
            shutil.rmtree(path)
    except OSError as error:
        print(f"rollback warning for {path}: {error}", file=sys.stderr)


def main() -> int:
    args = parse_args()
    destination = args.destination.expanduser().resolve()
    sources = sorted(path for path in SOURCE_ROOT.iterdir() if path.is_dir())
    targets = [(source, destination / source.name) for source in sources]
    conflicts = [target for _, target in targets if target_exists(target)]

    if conflicts:
        print("installation refused; destinations already exist:", file=sys.stderr)
        for conflict in conflicts:
            print(f"- {conflict}", file=sys.stderr)
        return 2

    created: list[Path] = []
    try:
        destination.mkdir(parents=True, exist_ok=True)
        for source, target in targets:
            if args.copy:
                shutil.copytree(source, target)
            else:
                target.symlink_to(source.resolve(), target_is_directory=True)
            created.append(target)
    except OSError as error:
        for target in reversed(created):
            remove_created(target)
        print(f"installation failed and was rolled back: {error}", file=sys.stderr)
        return 1

    mode = "copied" if args.copy else "linked"
    print(f"{mode} {len(created)} writing-code skills into {destination}")
    print("Start a new Pi or Codex session to refresh skill discovery.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
