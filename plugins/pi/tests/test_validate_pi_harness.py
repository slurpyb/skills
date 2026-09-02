from __future__ import annotations

import json
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "validate-pi-harness.py"


class ValidatorTests(unittest.TestCase):
    def run_validator(self, root: Path) -> tuple[int, dict]:
        completed = subprocess.run(
            ["python3", str(SCRIPT), str(root), "--json"],
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(completed.stderr, "")
        return completed.returncode, json.loads(completed.stdout)

    def make_package(self, root: Path) -> None:
        (root / "skills" / "demo").mkdir(parents=True)
        (root / "prompts").mkdir()
        (root / "package.json").write_text(
            json.dumps(
                {
                    "name": "demo",
                    "version": "0.1.0",
                    "keywords": ["pi-package"],
                    "pi": {"skills": ["./skills"], "prompts": ["./prompts"]},
                }
            )
        )
        (root / "skills" / "demo" / "SKILL.md").write_text(
            """---
name: demo
description: Demonstrates a valid skill. Use when testing the validator.
---

# Demo

## Workflow

1. Inspect the input. **Complete when:** the input is known.
"""
        )
        (root / "prompts" / "demo.md").write_text(
            """---
description: Run the demo workflow
argument-hint: "<goal>"
---
Run the demo for $ARGUMENTS.
"""
        )

    def test_clean_package(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.make_package(root)
            code, report = self.run_validator(root)
            self.assertEqual(code, 0)
            self.assertEqual(report["errors"], 0)
            self.assertEqual(report["warnings"], 0)

    def test_malformed_skill_is_error(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.make_package(root)
            (root / "skills" / "demo" / "SKILL.md").write_text(
                "---\nname: Wrong_Name\n---\n\nNo workflow.\n"
            )
            code, report = self.run_validator(root)
            checks = {finding["check"] for finding in report["findings"]}
            self.assertEqual(code, 1)
            self.assertIn("skill.name", checks)
            self.assertIn("skill.description", checks)
            self.assertIn("skill.workflow", checks)

    def test_unsupported_prompt_expression_is_error(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.make_package(root)
            prompt = root / "prompts" / "demo.md"
            prompt.write_text(
                "---\ndescription: Bad expression\nargument-hint: \"<goal>\"\n---\nUse ${name}.\n"
            )
            code, report = self.run_validator(root)
            self.assertEqual(code, 1)
            self.assertIn("prompt.substitution", {f["check"] for f in report["findings"]})

    def test_settings_type_and_unknown_key(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.make_package(root)
            (root / ".pi").mkdir()
            (root / ".pi" / "settings.json").write_text(
                json.dumps({"defaultTools": "read", "imaginarySetting": True})
            )
            code, report = self.run_validator(root)
            checks = {finding["check"] for finding in report["findings"]}
            self.assertEqual(code, 1)
            self.assertIn("settings.type", checks)
            self.assertIn("settings.unknown", checks)

    def test_models_shape_api_and_secret(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.make_package(root)
            (root / "models.json").write_text(
                json.dumps(
                    {
                        "providers": {
                            "local": {
                                "baseUrl": "http://localhost:9000/v1",
                                "api": "invented-api",
                                "apiKey": "sk-this-should-not-be-committed",
                                "models": [{"id": "x"}, {"id": "x"}],
                            }
                        }
                    }
                )
            )
            code, report = self.run_validator(root)
            checks = {finding["check"] for finding in report["findings"]}
            self.assertEqual(code, 1)
            self.assertTrue({"models.api", "models.duplicate", "secret.literal"}.issubset(checks))

    def test_tool_source_heuristics_are_warnings(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.make_package(root)
            (root / "src").mkdir()
            (root / "src" / "tool.ts").write_text(
                """import { defineTool } from "wrong-package";
import { Type } from "@sinclair/typebox";
import { helper } from "./helper";
const tool = defineTool({
  name: "read",
  label: "Bad",
  description: "Bad tool",
  parameters: Type.Object({ value: Type.Any() }),
  async execute() { process.cwd(); return {}; }
});
"""
            )
            code, report = self.run_validator(root)
            checks = {finding["check"] for finding in report["findings"]}
            self.assertEqual(code, 0)
            self.assertGreater(report["warnings"], 0)
            self.assertTrue(
                {"tool.typebox", "tool.import", "tool.schema", "tool.cwd", "tool.result", "tool.esm-import", "tool.collision"}.issubset(checks)
            )


if __name__ == "__main__":
    unittest.main()
