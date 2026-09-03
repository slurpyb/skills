import { describe, expect, test } from "bun:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { runCodegraph } from "./codegraph.ts";
import { discoverAgents, resolveSpawnTools } from "./subagent.ts";
import factory from "../index.ts";

function fakePi(handlers: Record<string, (args: string[]) => { stdout: string; stderr: string; code: number; killed: boolean }>): ExtensionAPI {
	return {
		getAllTools: () => [],
		exec: async (command: string, args: string[]) => {
			const handler = handlers[command];
			if (!handler) return { stdout: "", stderr: `missing ${command}`, code: 1, killed: false };
			return handler(args);
		},
	} as unknown as ExtensionAPI;
}

describe("discoverAgents", () => {
	test("loads gatherer, prompt-reviewer, and worker from the extension", () => {
		const names = discoverAgents(process.cwd(), "extension").map((a) => a.name);
		expect(names).toContain("gatherer");
		expect(names).toContain("prompt-reviewer");
		expect(names).toContain("worker");
	});

	test("prompt-engineer still declares Context7/fetch MCP names in frontmatter", () => {
		const agent = discoverAgents(process.cwd(), "extension").find((a) => a.name === "prompt-engineer");
		expect(agent?.tools).toContain("mcp__fetch__fetch");
		expect(agent?.tools).toContain("mcp__context7__resolve-library-id");
		expect(agent?.tools).toContain("mcp__context7__get-library-docs");
	});
});

describe("resolveSpawnTools", () => {
	test("drops Context7/fetch MCP names when they are not in the session", () => {
		const requested = [
			"Read",
			"Write",
			"mcp__fetch__fetch",
			"mcp__context7__resolve-library-id",
			"mcp__context7__get-library-docs",
		];
		expect(resolveSpawnTools(requested, ["read", "write", "grep"])).toEqual(["read", "write"]);
	});

	test("keeps a named MCP tool only when it is actually registered", () => {
		const requested = ["read", "mcp__context7__get-library-docs"];
		expect(resolveSpawnTools(requested, ["read", "mcp__context7__get-library-docs"])).toEqual([
			"read",
			"mcp__context7__get-library-docs",
		]);
	});

	test("drops unshipped MCP names even without a session tool list", () => {
		expect(resolveSpawnTools(["read", "mcp__fetch__fetch", "mcp__context7__resolve-library-id"])).toEqual(["read"]);
	});
});

describe("codegraph wrapper", () => {
	test("map uses find and reports the gap without pi-lens", async () => {
		const pi = fakePi({
			which: () => ({ stdout: "", stderr: "", code: 1, killed: false }),
			find: () => ({
				stdout: "src/auth.ts\nsrc/session.ts\nlib/loop.ts\n",
				stderr: "",
				code: 0,
				killed: false,
			}),
		});
		const snap = await runCodegraph(pi, "/tmp/repo", { action: "map", limit: 10 });
		expect(snap.action).toBe("map");
		expect(snap.backend).toContain("find");
		expect(snap.deeper.some((line) => line.includes("pi-lens is not"))).toBe(true);
		expect(snap.hits.length).toBeGreaterThan(0);
	});
});

describe("extension factory", () => {
	test("registers the loop tools", () => {
		const tools: string[] = [];
		const commands: string[] = [];
		const pi = {
			on() {},
			registerTool(tool: { name: string }) {
				tools.push(tool.name);
			},
			registerCommand(name: string) {
				commands.push(name);
			},
		} as unknown as ExtensionAPI;
		factory(pi);
		expect(tools).toEqual(["codegraph", "gather_materials", "prompt_template", "review_prompt", "fanout_tasks"]);
		expect(commands).toContain("engineer");
	});
});
