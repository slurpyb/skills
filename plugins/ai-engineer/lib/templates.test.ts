import { describe, expect, test } from "bun:test";
import { getTemplate, listTemplates } from "./templates.ts";

describe("shipped templates", () => {
	test("includes gather, task, and review", () => {
		const ids = listTemplates().map((t) => t.id);
		expect(ids).toContain("gather");
		expect(ids).toContain("task");
		expect(ids).toContain("review");
	});

	test("indexes prompt-library templates", () => {
		const ids = listTemplates();
		expect(ids.some((t) => t.id.startsWith("library/"))).toBe(true);
	});

	test("task template asks for goal and materials", () => {
		const task = getTemplate("task");
		expect(task?.variables).toContain("goal");
		expect(task?.variables).toContain("materials");
	});
});
