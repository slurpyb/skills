import { describe, expect, test } from "bun:test";
import { fillTemplate, extractVariables } from "./templates.ts";
import { reviewPromptText, mergeReviews, parseSubagentVerdict } from "./review.ts";
import {
	applyReview,
	approvedPrompts,
	clearJob,
	ensureJob,
	markDispatched,
	recordMaterials,
	recordPrompt,
	startJob,
} from "./loop.ts";

describe("fillTemplate", () => {
	test("substitutes mustache and brace vars", () => {
		const { text, missing } = fillTemplate("Hello {{name}} from {place}", { name: "Ada", place: "London" });
		expect(text).toBe("Hello Ada from London");
		expect(missing).toEqual([]);
	});

	test("keeps unresolved placeholders", () => {
		const { text, missing } = fillTemplate("X={{missing}}", {});
		expect(text).toBe("X={{missing}}");
		expect(missing).toEqual(["missing"]);
	});

	test("drops false if-blocks", () => {
		const { text } = fillTemplate("A{{#if extra}}+{{extra}}{{/if}}Z", {});
		expect(text).toBe("AZ");
	});

	test("extracts variables", () => {
		expect(extractVariables("{{goal}} {slice} {{#if codegraph}}x{{/if}}").sort()).toEqual(["codegraph", "goal", "slice"]);
	});
});

describe("review rubric", () => {
	const solid = `# Objective
Ship the auth fix.

# Context
See \`src/auth.ts\` (lines 10-40)

# Instructions
1. Patch token expiry.

# Output Format
Return a diff summary.

# Constraints
- Never rotate secrets.
- Forbidden: rewriting unrelated files.`;

	test("approves a grounded packet", () => {
		const result = reviewPromptText(solid, { hasMaterials: true, goal: "Ship the auth fix." });
		expect(result.verdict).toBe("approved");
		expect(result.score).toBeGreaterThanOrEqual(7);
	});

	test("flags a stub", () => {
		const result = reviewPromptText("do it");
		expect(result.verdict).not.toBe("approved");
	});

	test("stricter merge wins", () => {
		const merged = mergeReviews(
			{ score: 9, issues: [], verdict: "approved", notes: "ok" },
			{ score: 4, issues: [], verdict: "needs_revision", notes: "thin" },
		);
		expect(merged.verdict).toBe("needs_revision");
		expect(merged.score).toBe(4);
	});

	test("parses subagent verdicts", () => {
		expect(parseSubagentVerdict("VERDICT: APPROVE\nSCORE: 8")).toBe("approved");
		expect(parseSubagentVerdict("VERDICT: REVISE")).toBe("needs_revision");
	});
});

describe("loop gates", () => {
	test("fanout refuses without approval", () => {
		clearJob("/tmp/ai-engineer-test");
		const job = startJob("/tmp/ai-engineer-test", "demo");
		recordPrompt(job, { id: "p1", template: "task", body: "x", status: "draft" });
		expect(() => markDispatched(job)).toThrow(/gated/);
	});

	test("approval unlocks fanout", () => {
		const job = ensureJob("/tmp/ai-engineer-test-2", "demo");
		recordMaterials(job, [{ source: "auth", agent: "gatherer", body: "src/auth.ts" }]);
		recordPrompt(job, { id: "p1", template: "task", body: solidPacket(), status: "draft" });
		applyReview(job, "p1", { verdict: "approved", score: 8, issues: [], notes: "ok" });
		expect(approvedPrompts(job)).toHaveLength(1);
		markDispatched(job);
		expect(job.phase).toBe("dispatched");
	});
});

function solidPacket(): string {
	return `# Objective\nDemo\n# Output Format\nDone.\n# Constraints\n- Never invent files.`;
}
