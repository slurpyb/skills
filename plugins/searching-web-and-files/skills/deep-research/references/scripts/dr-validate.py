#!/usr/bin/env -S uv run --quiet
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "jsonschema>=4.21",
# ]
# ///
"""dr-validate.py — schema-validate every deep-research artifact.

Validates:
  - <YYYYMMDD>-r{N}-manifest.json against round-manifest.schema.json
  - <YYYYMMDD>-synthesis-meta.json against synthesis-spec.schema.json
  - That <YYYYMMDD>-SUMMARY.md actually contains every required section
    (level-2 markdown heading) declared in the synthesis-meta sidecar.
  - That citation tags in SUMMARY.md resolve to rows in the citation
    index.

Exits non-zero on any drift. Honors --json for machine-readable output.

Usage:
  dr-validate.py --resources <workdir>/resources [--run-date YYYYMMDD] [--json]
  dr-validate.py --templates           # validate the bundled templates
  dr-validate.py --files file1 file2   # validate explicit manifest files
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

from jsonschema import Draft202012Validator

SCRIPT_DIR = Path(__file__).resolve().parent
SCHEMA_DIR = SCRIPT_DIR.parent / "schemas"
TEMPLATES_DIR = SCRIPT_DIR.parent / "templates"

ROUND_SCHEMA_PATH = SCHEMA_DIR / "round-manifest.schema.json"
SYNTH_SCHEMA_PATH = SCHEMA_DIR / "synthesis-spec.schema.json"


@dataclass
class Report:
    ok: list[str] = field(default_factory=list)
    errors: list[dict] = field(default_factory=list)

    def add_ok(self, path: str) -> None:
        self.ok.append(path)

    def add_error(self, path: str, message: str, detail: str | None = None) -> None:
        self.errors.append({"path": path, "message": message, "detail": detail})


def load_schema(path: Path) -> Draft202012Validator:
    return Draft202012Validator(json.loads(path.read_text()))


def validate_round_manifest(path: Path, validator: Draft202012Validator, report: Report) -> None:
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError as exc:
        report.add_error(str(path), "invalid JSON", str(exc))
        return
    errors = sorted(validator.iter_errors(data), key=lambda e: list(e.absolute_path))
    if errors:
        for err in errors:
            report.add_error(
                str(path),
                f"schema violation at {'/'.join(str(p) for p in err.absolute_path) or '<root>'}",
                err.message,
            )
        return
    report.add_ok(str(path))


HEADING_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)
CITATION_RE = re.compile(r"\[(r\d+[a-z][a-z0-9]*)\]")


def headings_in(markdown: str) -> set[str]:
    return {h.strip().lower() for h in HEADING_RE.findall(markdown)}


def validate_synthesis(meta_path: Path, validator: Draft202012Validator, report: Report) -> None:
    import datetime
    pre_error_count = len(report.errors)

    try:
        meta = json.loads(meta_path.read_text())
    except json.JSONDecodeError as exc:
        report.add_error(str(meta_path), "invalid JSON", str(exc))
        return

    errors = sorted(validator.iter_errors(meta), key=lambda e: list(e.absolute_path))
    if errors:
        for err in errors:
            report.add_error(
                str(meta_path),
                f"schema violation at {'/'.join(str(p) for p in err.absolute_path) or '<root>'}",
                err.message,
            )
        return

    base_dir = meta_path.parent
    summary_path = base_dir / meta["summary_path"]
    citation_path = base_dir / meta["citation_index_path"]

    if not summary_path.is_file():
        report.add_error(str(meta_path), "summary missing", str(summary_path))
        return
    if not citation_path.is_file():
        report.add_error(str(meta_path), "citation index missing", str(citation_path))
        return

    summary_text = summary_path.read_text()
    citation_text = citation_path.read_text()
    headings = headings_in(summary_text)

    for section_key, section_meta in meta["sections"].items():
        if not section_meta.get("present", False):
            continue
        anchor = section_meta["anchor"].strip().lower()
        if anchor not in headings:
            report.add_error(
                str(summary_path),
                f"missing required section heading: '## {section_meta['anchor']}'",
                f"declared by {meta_path.name} sections.{section_key}",
            )

    summary_tags = set(CITATION_RE.findall(summary_text))
    citation_tags = set(CITATION_RE.findall(citation_text))
    unresolved = summary_tags - citation_tags
    if unresolved:
        report.add_error(
            str(summary_path),
            "citations in SUMMARY.md not present in citation index",
            ", ".join(sorted(unresolved)),
        )
    if not summary_tags:
        report.add_error(
            str(summary_path),
            "no citation tags found",
            "Synthesis must cite at least one source.",
        )

    placeholder_re = re.compile(r"\bREPLACE(?:_WITH_[A-Z_]+)?\b")
    if placeholder_re.search(summary_text):
        report.add_error(str(summary_path), "unfilled REPLACE placeholders remain", None)
    if placeholder_re.search(citation_text):
        report.add_error(str(citation_path), "unfilled REPLACE placeholders remain", None)

    new_errors = [e for e in report.errors[pre_error_count:]]
    if not any(e["path"] == str(meta_path) for e in new_errors):
        report.add_ok(str(meta_path))
    if not any(e["path"] == str(summary_path) for e in new_errors):
        report.add_ok(str(summary_path))

    # If synthesis passed, write back validated=true + claim_count + run_at.
    if not new_errors:
        meta["validated"] = True
        meta["claim_count"] = len(CITATION_RE.findall(summary_text))
        meta["validator_run_at"] = (
            datetime.datetime.now(datetime.timezone.utc)
            .replace(microsecond=0)
            .isoformat()
            .replace("+00:00", "Z")
        )
        # Update per-section claim_count.
        section_counts: dict[str, int] = {}
        current_section: str | None = None
        section_anchor_lookup = {
            v["anchor"].strip().lower(): k for k, v in meta["sections"].items()
        }
        for line in summary_text.splitlines():
            heading_match = HEADING_RE.match(line)
            if heading_match:
                anchor = heading_match.group(1).strip().lower()
                current_section = section_anchor_lookup.get(anchor)
                if current_section:
                    section_counts.setdefault(current_section, 0)
            elif current_section:
                section_counts[current_section] = section_counts.get(current_section, 0) + len(
                    CITATION_RE.findall(line)
                )
        for key, sect in meta["sections"].items():
            sect["claim_count"] = section_counts.get(key, 0)
        meta_path.write_text(json.dumps(meta, indent=2) + "\n")


def validate_resources(resources_dir: Path, run_date: str | None, report: Report) -> None:
    round_validator = load_schema(ROUND_SCHEMA_PATH)
    synth_validator = load_schema(SYNTH_SCHEMA_PATH)

    glob_pat = f"{run_date}-r*-manifest.json" if run_date else "*-r*-manifest.json"
    manifests = sorted(resources_dir.glob(glob_pat))
    if not manifests:
        report.add_error(str(resources_dir), "no round manifests found", glob_pat)
    for m in manifests:
        validate_round_manifest(m, round_validator, report)

    meta_glob = f"{run_date}-synthesis-meta.json" if run_date else "*-synthesis-meta.json"
    metas = sorted(resources_dir.glob(meta_glob))
    for meta in metas:
        validate_synthesis(meta, synth_validator, report)


def validate_templates(report: Report) -> None:
    round_validator = load_schema(ROUND_SCHEMA_PATH)
    template_manifest = TEMPLATES_DIR / "round-manifest.json"
    if template_manifest.is_file():
        validate_round_manifest(template_manifest, round_validator, report)
    else:
        report.add_error(str(template_manifest), "template manifest missing", None)


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--resources", type=Path, help="Path to <workdir>/resources directory")
    g.add_argument("--templates", action="store_true", help="Validate bundled templates")
    g.add_argument("--files", nargs="+", type=Path, help="Validate specific round-manifest files")
    p.add_argument("--run-date", help="Restrict to a specific YYYYMMDD prefix when using --resources")
    p.add_argument("--json", action="store_true", help="Emit machine-readable JSON status")
    args = p.parse_args()

    report = Report()

    if args.resources:
        if not args.resources.is_dir():
            report.add_error(str(args.resources), "resources dir not found", None)
        else:
            validate_resources(args.resources, args.run_date, report)
    elif args.templates:
        validate_templates(report)
    elif args.files:
        round_validator = load_schema(ROUND_SCHEMA_PATH)
        for f in args.files:
            validate_round_manifest(f, round_validator, report)

    status = "ok" if not report.errors else "error"
    if args.json:
        print(json.dumps({"status": status, "ok": report.ok, "errors": report.errors}, indent=2))
    else:
        for path in report.ok:
            print(f"ok    {path}")
        for err in report.errors:
            detail = f" — {err['detail']}" if err.get("detail") else ""
            print(f"error {err['path']}: {err['message']}{detail}", file=sys.stderr)
        print(f"\nsummary: {len(report.ok)} ok, {len(report.errors)} errors", file=sys.stderr)

    return 0 if not report.errors else 1


if __name__ == "__main__":
    sys.exit(main())
