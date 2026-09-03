#!/usr/bin/env python3
"""Deterministic validator for resource-only Pi harnesses.

The TypeScript checks are deliberately heuristic. They report warnings and never
claim to replace the compiler, direct tool tests, or a Pi routing smoke test.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Iterable

SKIP_DIRS = {".git", "node_modules", ".pi/npm", ".pi/git", "dist", "build", "coverage"}
SUPPORTED_APIS = {
    "openai-completions",
    "openai-responses",
    "anthropic-messages",
    "google-generative-ai",
}
BUILTIN_TOOLS = {"read", "bash", "powershell", "edit", "write", "grep", "find", "ls"}
SETTINGS_TYPES: dict[str, tuple[type, ...]] = {
    "defaultProvider": (str,),
    "defaultModel": (str,),
    "defaultThinkingLevel": (str,),
    "modelThinkingLevels": (dict,),
    "hideThinkingBlock": (bool,),
    "showCacheMissNotices": (bool,),
    "thinkingBudgets": (dict,),
    "theme": (str,),
    "externalEditor": (str,),
    "quietStartup": (bool,),
    "defaultProjectTrust": (str,),
    "collapseChangelog": (bool,),
    "enableInstallTelemetry": (bool,),
    "enableAnalytics": (bool,),
    "trackingId": (str,),
    "doubleEscapeAction": (str,),
    "treeFilterMode": (str,),
    "editorPaddingX": (int,),
    "outputPad": (int,),
    "autocompleteMaxVisible": (int,),
    "showHardwareCursor": (bool,),
    "tuiMode": (str,),
    "fullscreenExitOutput": (str,),
    "fullscreenScrollbar": (str,),
    "fullscreenCopyOnSelect": (bool,),
    "httpProxy": (str,),
    "warnings": (dict,),
    "compaction": (dict,),
    "branchSummary": (dict,),
    "retry": (dict,),
    "steeringMode": (str,),
    "followUpMode": (str,),
    "transport": (str,),
    "httpIdleTimeoutMs": (int,),
    "websocketConnectTimeoutMs": (int,),
    "terminal": (dict,),
    "images": (dict,),
    "shellPath": (str,),
    "shellCommandPrefix": (str,),
    "npmCommand": (list,),
    "defaultTools": (list,),
    "sessionDir": (str,),
    "enabledModels": (list,),
    "markdown": (dict,),
    "packages": (list,),
    "extensions": (list,),
    "skills": (list,),
    "prompts": (list,),
    "themes": (list,),
    "enableSkillCommands": (bool,),
}


@dataclass(frozen=True)
class Finding:
    severity: str
    check: str
    path: str
    line: int
    message: str


class Validator:
    def __init__(self, root: Path) -> None:
        self.root = root.resolve()
        self.findings: list[Finding] = []
        self.skill_names: dict[str, Path] = {}
        self.prompt_names: dict[str, Path] = {}
        self.tool_names: dict[str, Path] = {}

    def add(self, severity: str, check: str, path: Path, message: str, line: int = 0) -> None:
        try:
            display = str(path.resolve().relative_to(self.root))
        except ValueError:
            display = str(path)
        self.findings.append(Finding(severity, check, display or ".", line, message))

    def error(self, check: str, path: Path, message: str, line: int = 0) -> None:
        self.add("error", check, path, message, line)

    def warn(self, check: str, path: Path, message: str, line: int = 0) -> None:
        self.add("warning", check, path, message, line)

    def run(self) -> list[Finding]:
        if not self.root.exists():
            self.error("input.exists", self.root, "path does not exist")
            return self.findings
        if self.root.is_file():
            self.validate_file(self.root)
        else:
            package = self.root / "package.json"
            if package.exists():
                self.validate_package(package)
            for path in self.walk_files():
                if path == package:
                    continue
                self.validate_file(path)
        return sorted(self.findings, key=lambda f: (f.path, f.line, f.check, f.message))

    def walk_files(self) -> Iterable[Path]:
        for path in self.root.rglob("*"):
            if not path.is_file():
                continue
            rel_parts = path.relative_to(self.root).parts
            if any(part in {".git", "node_modules", "dist", "build", "coverage"} for part in rel_parts):
                continue
            if len(rel_parts) >= 2 and rel_parts[:2] in {(".pi", "npm"), (".pi", "git")}:
                continue
            yield path

    def validate_file(self, path: Path) -> None:
        if path.name == "SKILL.md":
            self.validate_skill(path)
        elif path.suffix == ".md" and path.parent.name == "prompts":
            self.validate_prompt(path)
        elif path.name == "settings.json":
            self.validate_settings(path)
        elif path.name == "models.json":
            self.validate_models(path)
        elif path.suffix in {".ts", ".tsx"}:
            self.validate_tool_source(path)

    def load_json(self, path: Path, check: str) -> Any | None:
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            line = getattr(error, "lineno", 0)
            self.error(check, path, f"invalid JSON: {error}", line)
            return None

    def validate_package(self, path: Path) -> None:
        data = self.load_json(path, "package.json")
        if not isinstance(data, dict):
            if data is not None:
                self.error("package.root", path, "root must be an object")
            return
        keywords = data.get("keywords")
        if not isinstance(keywords, list) or "pi-package" not in keywords:
            self.error("package.keyword", path, "keywords must include 'pi-package'")
        manifest = data.get("pi")
        if not isinstance(manifest, dict):
            self.error("package.manifest", path, "missing object-valued 'pi' manifest")
            return
        if "extensions" in manifest:
            self.error("scope.extensions", path, "resource-only harness must not declare pi.extensions")
        for kind in ("skills", "prompts"):
            entries = manifest.get(kind)
            if not isinstance(entries, list) or not entries:
                self.error("package.resources", path, f"pi.{kind} must be a non-empty array")
                continue
            for entry in entries:
                if not isinstance(entry, str):
                    self.error("package.resources", path, f"pi.{kind} entries must be strings")
                    continue
                if any(char in entry for char in "*!?["):
                    continue
                target = self.root / entry
                if not target.exists():
                    self.error("package.path", path, f"pi.{kind} path does not exist: {entry}")
        version = data.get("version")
        for manifest_path in (
            self.root / ".claude-plugin" / "plugin.json",
            self.root / ".codex-plugin" / "plugin.json",
        ):
            if manifest_path.exists():
                plugin = self.load_json(manifest_path, "plugin.manifest")
                if isinstance(plugin, dict) and plugin.get("version") != version:
                    self.error("package.version", manifest_path, "plugin version must match package.json")

    @staticmethod
    def frontmatter(path: Path) -> tuple[dict[str, str], str, int] | None:
        text = path.read_text(encoding="utf-8")
        match = re.match(r"^---\s*\n(.*?)\n---\s*\n?", text, re.DOTALL)
        if not match:
            return None
        fields: dict[str, str] = {}
        for line in match.group(1).splitlines():
            scalar = re.match(r"^([A-Za-z][A-Za-z0-9_-]*):\s*(.*?)\s*$", line)
            if scalar and scalar.group(2):
                fields[scalar.group(1)] = scalar.group(2).strip("\"'")
        return fields, text[match.end() :], text[: match.end()].count("\n")

    def validate_skill(self, path: Path) -> None:
        parsed = self.frontmatter(path)
        if parsed is None:
            self.error("skill.frontmatter", path, "missing YAML frontmatter", 1)
            return
        fields, body, body_line = parsed
        name = fields.get("name", "")
        description = fields.get("description", "")
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name) or len(name) > 64:
            self.error("skill.name", path, "name must be 1-64 lowercase letters, digits, and single hyphens")
        if name and path.parent.name != name:
            self.error("skill.directory", path, "skill name must match its directory")
        if not description or len(description) > 1024:
            self.error("skill.description", path, "description is required and must be at most 1024 characters")
        elif ". Use when " not in description:
            self.warn("skill.routing", path, "description should contain a capability sentence followed by 'Use when'")
        if name:
            previous = self.skill_names.get(name)
            if previous:
                self.error("skill.duplicate", path, f"duplicate skill name also found at {previous}")
            else:
                self.skill_names[name] = path
        total_lines = len(path.read_text(encoding="utf-8").splitlines())
        if total_lines > 80:
            self.warn("skill.surface", path, f"SKILL.md has {total_lines} lines; disclose depth behind references")
        workflow = re.search(r"^## Workflow\s*$\n(.*?)(?=^## |\Z)", body, re.MULTILINE | re.DOTALL)
        if not workflow:
            self.error("skill.workflow", path, "missing '## Workflow' section")
        else:
            steps = re.findall(r"^\d+\.\s+.+$", workflow.group(1), re.MULTILINE)
            if not steps:
                self.error("skill.workflow", path, "workflow must contain numbered steps")
            for step in steps:
                if "Complete when" not in step:
                    line = body_line + body[: workflow.start() + workflow.group(1).find(step)].count("\n") + 1
                    self.error("skill.completion", path, "workflow step lacks 'Complete when'", line)
        self.validate_skill_references(path, body)

    def validate_skill_references(self, path: Path, body: str) -> None:
        linked = set(re.findall(r"(?:`|\()(?P<link>references/[A-Za-z0-9._/-]+\.md)(?:`|\))", body))
        ref_dir = path.parent / "references"
        present = {f"references/{p.name}" for p in ref_dir.glob("*.md")} if ref_dir.exists() else set()
        for relative in sorted(linked):
            if not (path.parent / relative).exists():
                self.error("skill.reference", path, f"linked reference does not exist: {relative}")
        for relative in sorted(present - linked):
            self.warn("skill.reference", path, f"reference is not pointed to from SKILL.md: {relative}")
        for relative in sorted(present):
            ref = path.parent / relative
            if "## Completion" not in ref.read_text(encoding="utf-8"):
                self.warn("skill.reference-completion", ref, "reference lacks a local '## Completion' criterion")

    def validate_prompt(self, path: Path) -> None:
        parsed = self.frontmatter(path)
        if parsed is None:
            self.error("prompt.frontmatter", path, "prompt template requires YAML frontmatter", 1)
            return
        fields, body, _ = parsed
        if not fields.get("description"):
            self.error("prompt.description", path, "description is required")
        if not fields.get("argument-hint"):
            self.warn("prompt.arguments", path, "argument-hint is recommended")
        name = path.stem
        if name in self.prompt_names:
            self.error("prompt.duplicate", path, f"duplicate prompt name also found at {self.prompt_names[name]}")
        else:
            self.prompt_names[name] = path
        for match in re.finditer(r"\$\{([^}]+)\}", body):
            expression = match.group(1)
            allowed = (
                re.fullmatch(r"\d+:-.*", expression, re.DOTALL)
                or re.fullmatch(r"(?:@|ARGUMENTS):-.*", expression, re.DOTALL)
                or re.fullmatch(r"@:\d+(?::\d+)?", expression)
            )
            if not allowed:
                line = body[: match.start()].count("\n") + 1
                self.error("prompt.substitution", path, f"unsupported Pi template expression: ${{{expression}}}", line)

    def validate_settings(self, path: Path) -> None:
        data = self.load_json(path, "settings.json")
        if not isinstance(data, dict):
            if data is not None:
                self.error("settings.root", path, "root must be an object")
            return
        for key, value in data.items():
            expected = SETTINGS_TYPES.get(key)
            if expected is None:
                self.warn("settings.unknown", path, f"unknown top-level setting: {key}")
            elif not isinstance(value, expected) or (int in expected and isinstance(value, bool)):
                names = "/".join(kind.__name__ for kind in expected)
                self.error("settings.type", path, f"{key} must be {names}")
        trust = data.get("defaultProjectTrust")
        if trust is not None and trust not in {"ask", "always", "never"}:
            self.error("settings.value", path, "defaultProjectTrust must be ask, always, or never")
        tools = data.get("defaultTools")
        if isinstance(tools, list):
            for tool in tools:
                if not isinstance(tool, str):
                    self.error("settings.tools", path, "defaultTools entries must be strings")

    def validate_models(self, path: Path) -> None:
        data = self.load_json(path, "models.json")
        if not isinstance(data, dict) or not isinstance(data.get("providers"), dict):
            self.error("models.root", path, "root must contain an object-valued providers map")
            return
        for provider_id, provider in data["providers"].items():
            if not isinstance(provider, dict):
                self.error("models.provider", path, f"provider {provider_id!r} must be an object")
                continue
            models = provider.get("models")
            api = provider.get("api")
            if api is not None and api not in SUPPORTED_APIS:
                self.error("models.api", path, f"provider {provider_id!r} uses unsupported models.json API {api!r}")
            if models is not None and not isinstance(models, list):
                self.error("models.models", path, f"provider {provider_id!r} models must be an array")
                continue
            if isinstance(models, list):
                if not provider.get("baseUrl") and provider_id not in {"anthropic", "openai", "google"}:
                    self.error("models.base-url", path, f"provider {provider_id!r} with models needs baseUrl")
                seen: set[str] = set()
                for index, model in enumerate(models):
                    if not isinstance(model, dict) or not isinstance(model.get("id"), str) or not model["id"]:
                        self.error("models.id", path, f"provider {provider_id!r} model {index} needs a non-empty id")
                        continue
                    model_id = model["id"]
                    if model_id in seen:
                        self.error("models.duplicate", path, f"duplicate model id {provider_id}/{model_id}")
                    seen.add(model_id)
                    model_api = model.get("api")
                    effective_api = model_api or api
                    if effective_api is None and provider_id not in {"anthropic", "openai", "google"}:
                        self.error("models.api", path, f"model {provider_id}/{model_id} needs an API at provider or model level")
                    elif effective_api is not None and effective_api not in SUPPORTED_APIS:
                        self.error("models.api", path, f"model {provider_id}/{model_id} uses unsupported API {effective_api!r}")
            self.check_secret_value(path, f"providers.{provider_id}.apiKey", provider.get("apiKey"))
            headers = provider.get("headers")
            if isinstance(headers, dict):
                for key, value in headers.items():
                    self.check_secret_value(path, f"providers.{provider_id}.headers.{key}", value)

    def check_secret_value(self, path: Path, field: str, value: Any) -> None:
        if not isinstance(value, str) or not value:
            return
        if value.startswith(("$", "!")) or value.lower() in {"ollama", "none", "dummy", "placeholder"}:
            return
        if re.search(r"(?:sk-|token|secret|bearer|api[_-]?key)", value, re.IGNORECASE) or len(value) >= 24:
            self.error("secret.literal", path, f"{field} looks like a committed secret; use environment or command resolution")
        else:
            self.warn("secret.literal", path, f"{field} is a literal; confirm it is a non-secret placeholder")

    def validate_tool_source(self, path: Path) -> None:
        text = path.read_text(encoding="utf-8")
        if "defineTool" not in text:
            return
        if '@sinclair/typebox' in text:
            self.warn("tool.typebox", path, "Pi tools import Type from 'typebox', not '@sinclair/typebox'")
        if re.search(r"from\s+[\"']typebox[\"']", text) is None:
            self.warn("tool.typebox", path, "defineTool source should import Type from 'typebox'")
        if re.search(r"from\s+[\"']@earendil-works/pi-coding-agent[\"']", text) is None:
            self.warn("tool.import", path, "defineTool should come from the Pi package root")
        if "Type.Any(" in text:
            self.warn("tool.schema", path, "avoid Type.Any(); use a real shape or Type.Unknown() plus narrowing")
        if "process.cwd()" in text:
            self.warn("tool.cwd", path, "tool execution paths should resolve from ctx.cwd")
        if "content:" not in text or "details:" not in text:
            self.warn("tool.result", path, "tool results require both content and details")
        parameter_values = re.findall(r"parameters\s*:\s*([A-Za-z_$][\w$]*|Type\.Object\s*\()", text)
        schema_names = set(re.findall(r"const\s+([A-Za-z_$][\w$]*)\s*=\s*Type\.Object\s*\(", text))
        if parameter_values and not all(value.startswith("Type.Object") or value in schema_names for value in parameter_values):
            self.warn("tool.schema", path, "top-level parameters should be a named or inline Type.Object schema")
        if not parameter_values:
            self.warn("tool.schema", path, "could not find a parameters field; static check is heuristic")
        for match in re.finditer(r"from\s+[\"'](\.{1,2}/[^\"']+)[\"']", text):
            import_path = match.group(1)
            if Path(import_path).suffix not in {".ts", ".tsx", ".js", ".mjs", ".cjs", ".json"}:
                line = text[: match.start()].count("\n") + 1
                self.warn("tool.esm-import", path, f"relative ESM import lacks an explicit extension: {import_path}", line)
        for match in re.finditer(r"\bname\s*:\s*[\"']([^\"']+)[\"']", text):
            name = match.group(1)
            if name in BUILTIN_TOOLS:
                self.warn("tool.collision", path, f"tool name collides with built-in: {name}")
            previous = self.tool_names.get(name)
            if previous and previous != path:
                self.warn("tool.duplicate", path, f"tool name also appears in {previous}")
            self.tool_names.setdefault(name, path)
        if re.search(r"\b(?:fetch|exec|spawn|for\s*\(|while\s*\()", text) and "signal" not in text:
            self.warn("tool.cancellation", path, "slow-work heuristic matched but no cancellation signal is visible")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", nargs="?", default=".", help="package, project, or artifact path")
    parser.add_argument("--json", action="store_true", dest="as_json", help="emit machine-readable JSON")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    findings = Validator(Path(args.path)).run()
    errors = sum(f.severity == "error" for f in findings)
    warnings = sum(f.severity == "warning" for f in findings)
    if args.as_json:
        print(json.dumps({"errors": errors, "warnings": warnings, "findings": [asdict(f) for f in findings]}, indent=2))
    else:
        for finding in findings:
            location = f"{finding.path}:{finding.line}" if finding.line else finding.path
            print(f"{finding.severity.upper()} [{finding.check}] {location} — {finding.message}")
        print(f"Pi harness validation: {errors} error(s), {warnings} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
