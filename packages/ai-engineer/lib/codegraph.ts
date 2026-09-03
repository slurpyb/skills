import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { CodegraphSnapshot } from "./loop.ts";

const PI_LENS_TOOLS = ["symbol_search", "module_report", "read_symbol", "read_enclosing", "lsp_navigation", "ast_grep_search"] as const;

const IGNORE = ["node_modules", ".git", "dist", "coverage", ".next", ".turbo", "vendor"];

export interface CodegraphInput {
	action: "map" | "search" | "symbol" | "deps";
	query?: string;
	path?: string;
	limit?: number;
}

function whichTools(pi: ExtensionAPI): string[] {
	try {
		return pi.getAllTools().map((t) => t.name).filter((name) => (PI_LENS_TOOLS as readonly string[]).includes(name));
	} catch {
		return [];
	}
}

async function run(pi: ExtensionAPI, command: string, args: string[], cwd: string, signal?: AbortSignal) {
	return pi.exec(command, args, { cwd, timeout: 15_000, signal });
}

async function hasBin(pi: ExtensionAPI, bin: string, cwd: string): Promise<boolean> {
	const result = await run(pi, "which", [bin], cwd);
	return result.code === 0;
}

function rel(cwd: string, filePath: string): string {
	return filePath.startsWith(cwd) ? filePath.slice(cwd.length).replace(/^\/+/, "") : filePath;
}

function capLines(text: string, limit: number): string[] {
	return text.split("\n").filter(Boolean).slice(0, limit);
}

async function fileMap(pi: ExtensionAPI, cwd: string, root: string, limit: number, signal?: AbortSignal): Promise<CodegraphSnapshot> {
	const pruneExpr = IGNORE.flatMap((d, i) => (i === 0 ? ["-name", d] : ["-o", "-name", d]));
	const result = await run(
		pi,
		"find",
		[root || ".", "(", ...pruneExpr, ")", "-prune", "-o", "-type", "f", "-print"],
		cwd,
		signal,
	);
	const files = capLines(result.stdout, 400);
	const byDir = new Map<string, number>();
	for (const file of files) {
		const dir = file.split("/").slice(0, 3).join("/") || ".";
		byDir.set(dir, (byDir.get(dir) ?? 0) + 1);
	}
	const dirs = [...byDir.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
	return {
		backend: "find",
		action: "map",
		summary: `${files.length} files (capped). Top dirs: ${dirs.map(([d, n]) => `${d} (${n})`).join(", ")}`,
		hits: dirs.map(([d, n]) => ({ path: d, note: `${n} files` })),
		deeper: [],
	};
}

async function search(pi: ExtensionAPI, cwd: string, query: string, root: string, limit: number, signal?: AbortSignal): Promise<CodegraphSnapshot> {
	const useRg = await hasBin(pi, "rg", cwd);
	const result = useRg
		? await run(pi, "rg", ["-n", "--hidden", "--glob", "!**/.git/**", "--glob", "!**/node_modules/**", "-m", "3", "-g", "!*.lock", query, root || "."], cwd, signal)
		: await run(pi, "grep", ["-RIn", "--exclude-dir=node_modules", "--exclude-dir=.git", query, root || "."], cwd, signal);
	const lines = capLines(result.stdout, limit);
	const hits = lines.map((line) => {
		const match = line.match(/^(.*?):(\d+):(.*)$/);
		if (!match) return { path: rel(cwd, line), note: line.slice(0, 160) };
		return { path: rel(cwd, match[1] ?? line), note: `L${match[2]} ${(match[3] ?? "").trim().slice(0, 140)}` };
	});
	return {
		backend: useRg ? "rg" : "grep",
		action: "search",
		query,
		summary: `${hits.length} hits for ${JSON.stringify(query)} via ${useRg ? "rg" : "grep"}`,
		hits,
		deeper: [],
	};
}

async function symbols(pi: ExtensionAPI, cwd: string, query: string, root: string, limit: number, signal?: AbortSignal): Promise<CodegraphSnapshot> {
	const useSg = await hasBin(pi, "sg", cwd);
	if (useSg) {
		const result = await run(pi, "sg", ["run", "--pattern", query, root || ".", "--json=stream"], cwd, signal);
		if (result.code === 0 && result.stdout.trim()) {
			const hits: CodegraphSnapshot["hits"] = [];
			for (const line of capLines(result.stdout, limit)) {
				try {
					const parsed = JSON.parse(line) as { file?: string; range?: { start?: { line?: number } }; text?: string };
					hits.push({
						path: rel(cwd, parsed.file ?? ""),
						note: `L${(parsed.range?.start?.line ?? 0) + 1} ${(parsed.text ?? "").split("\n")[0]?.slice(0, 120)}`,
					});
				} catch {
					hits.push({ path: ".", note: line.slice(0, 160) });
				}
			}
			return { backend: "ast-grep", action: "symbol", query, summary: `${hits.length} ast-grep matches`, hits, deeper: [] };
		}
	}
	const pattern = `(function|class|def|interface|type|const|fn|impl)\\s+${query}\\b`;
	return search(pi, cwd, pattern, root, limit, signal).then((snap) => ({ ...snap, action: "symbol", backend: `${snap.backend}+ident` }));
}

async function deps(pi: ExtensionAPI, cwd: string, query: string | undefined, root: string, limit: number, signal?: AbortSignal): Promise<CodegraphSnapshot> {
	const manifests = ["package.json", "go.mod", "pyproject.toml", "Cargo.toml", "composer.json"];
	const hits: CodegraphSnapshot["hits"] = [];
	for (const name of manifests) {
		const result = await run(pi, "find", [root || ".", "-name", name, "-not", "-path", "*/node_modules/*"], cwd, signal);
		for (const file of capLines(result.stdout, 8)) {
			hits.push({ path: rel(cwd, file), note: "manifest" });
		}
	}
	if (query) {
		const imports = await search(pi, cwd, query, root, Math.min(limit, 20), signal);
		hits.push(...imports.hits);
	}
	return {
		backend: "manifest+imports",
		action: "deps",
		query,
		summary: `${hits.length} dependency anchors`,
		hits: hits.slice(0, limit),
		deeper: [],
	};
}

export async function runCodegraph(pi: ExtensionAPI, cwd: string, input: CodegraphInput, signal?: AbortSignal): Promise<CodegraphSnapshot> {
	const limit = Math.min(Math.max(input.limit ?? 20, 1), 80);
	const root = input.path || ".";
	let snapshot: CodegraphSnapshot;
	switch (input.action) {
		case "map":
			snapshot = await fileMap(pi, cwd, root, limit, signal);
			break;
		case "search":
			if (!input.query) throw new Error("codegraph search requires query");
			snapshot = await search(pi, cwd, input.query, root, limit, signal);
			break;
		case "symbol":
			if (!input.query) throw new Error("codegraph symbol requires query");
			snapshot = await symbols(pi, cwd, input.query, root, limit, signal);
			break;
		case "deps":
			snapshot = await deps(pi, cwd, input.query, root, limit, signal);
			break;
		default:
			throw new Error(`Unknown codegraph action: ${String(input.action)}`);
	}

	const lens = whichTools(pi);
	if (lens.length > 0) {
		snapshot.deeper = [
			"pi-lens is loaded. Prefer its discovery funnel over repeating this scan:",
			"symbol_search → module_report → read_symbol → lsp_navigation (definition/references/incomingCalls)",
			`Active pi-lens tools: ${lens.join(", ")}`,
		];
		snapshot.backend = `${snapshot.backend} (pi-lens available)`;
	} else {
		snapshot.deeper = [
			"Gap: pi-lens is not in this session, so this wrapper used local find/rg/ast-grep only.",
			"Enable npm:pi-lens for symbol_search, module_report, read_symbol, and LSP call graphs.",
			"Octocode MCP (localSearchCode / lspGetSemantics) is a second local graph if those tools are present in this session. Skip them if missing; never invent results from a tool that did not run.",
		];
	}
	return snapshot;
}

export function formatSnapshot(snapshot: CodegraphSnapshot): string {
	const hits = snapshot.hits
		.slice(0, 30)
		.map((h) => `- \`${h.path}\` — ${h.note}`)
		.join("\n");
	return [
		`Backend: ${snapshot.backend}`,
		`Action: ${snapshot.action}${snapshot.query ? ` (${snapshot.query})` : ""}`,
		snapshot.summary,
		hits && `Hits:\n${hits}`,
		snapshot.deeper.length ? `Deeper:\n${snapshot.deeper.map((d) => `- ${d}`).join("\n")}` : "",
	]
		.filter(Boolean)
		.join("\n\n");
}
