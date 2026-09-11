import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CONFIG_DIR_NAME, getAgentDir, parseFrontmatter, withFileMutationQueue } from "@earendil-works/pi-coding-agent";
import { AGENTS_DIR } from "./paths.ts";

export type AgentScope = "extension" | "user" | "project" | "all";

export interface AgentConfig {
	name: string;
	description: string;
	tools?: string[];
	model?: string;
	systemPrompt: string;
	source: "extension" | "user" | "project";
	filePath: string;
}

type AgentFrontmatter = {
	name?: unknown;
	description?: unknown;
	tools?: unknown;
	model?: unknown;
};

export interface SubagentResult {
	agent: string;
	task: string;
	ok: boolean;
	output: string;
	stderr: string;
	exitCode: number;
}

const MAX_PARALLEL = 6;
const MAX_CONCURRENCY = 3;

function parseToolList(value: unknown): string[] | undefined {
	const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
	const tools = raw.filter((t): t is string => typeof t === "string").map((t) => t.trim()).filter(Boolean);
	return tools.length > 0 ? tools : undefined;
}

function isUnshippedMcp(name: string): boolean {
	return /mcp__/i.test(name) || /context7/i.test(name);
}

/** Keep frontmatter tool names that exist in this session. Drop Context7/fetch MCP names when they are not registered. */
export function resolveSpawnTools(requested: string[] | undefined, available?: readonly string[]): string[] | undefined {
	if (!requested?.length) return undefined;
	const have = available && available.length > 0 ? new Set(available) : undefined;
	const haveLower = have ? new Map([...have].map((n) => [n.toLowerCase(), n])) : undefined;
	const out: string[] = [];
	for (const raw of requested) {
		const name = raw.trim();
		if (!name) continue;
		if (have && haveLower) {
			if (have.has(name)) {
				out.push(name);
				continue;
			}
			const mapped = haveLower.get(name.toLowerCase());
			if (mapped) {
				out.push(mapped);
				continue;
			}
			continue;
		}
		if (isUnshippedMcp(name)) continue;
		out.push(name);
	}
	return out.length > 0 ? [...new Set(out)] : undefined;
}

function loadAgentsFromDir(dir: string, source: AgentConfig["source"]): AgentConfig[] {
	if (!fs.existsSync(dir)) return [];
	const agents: AgentConfig[] = [];
	let entries: fs.Dirent[];
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
	for (const entry of entries) {
		if (!entry.name.endsWith(".md") || !(entry.isFile() || entry.isSymbolicLink())) continue;
		const filePath = path.join(dir, entry.name);
		let content: string;
		try {
			content = fs.readFileSync(filePath, "utf8");
		} catch {
			continue;
		}
		const { frontmatter, body } = parseFrontmatter<AgentFrontmatter>(content);
		if (typeof frontmatter.name !== "string" || typeof frontmatter.description !== "string") continue;
		agents.push({
			name: frontmatter.name,
			description: frontmatter.description,
			tools: parseToolList(frontmatter.tools),
			model: typeof frontmatter.model === "string" ? frontmatter.model : undefined,
			systemPrompt: body,
			source,
			filePath,
		});
	}
	return agents;
}

function findProjectAgentsDir(cwd: string): string | null {
	let current = cwd;
	while (true) {
		const candidate = path.join(current, CONFIG_DIR_NAME, "agents");
		try {
			if (fs.statSync(candidate).isDirectory()) return candidate;
		} catch {
			/* skip */
		}
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}

export function discoverAgents(cwd: string, scope: AgentScope = "all"): AgentConfig[] {
	const map = new Map<string, AgentConfig>();
	const add = (list: AgentConfig[]) => {
		for (const agent of list) map.set(agent.name, agent);
	};
	if (scope === "extension" || scope === "all") add(loadAgentsFromDir(AGENTS_DIR, "extension"));
	if (scope === "user" || scope === "all") add(loadAgentsFromDir(path.join(getAgentDir(), "agents"), "user"));
	if (scope === "project" || scope === "all") {
		const dir = findProjectAgentsDir(cwd);
		if (dir) add(loadAgentsFromDir(dir, "project"));
	}
	return [...map.values()];
}

function piInvocation(args: string[]): { command: string; args: string[] } {
	const currentScript = process.argv[1];
	const bunVirtual = currentScript?.startsWith("/$bunfs/root/");
	if (currentScript && !bunVirtual && fs.existsSync(currentScript)) {
		return { command: process.execPath, args: [currentScript, ...args] };
	}
	const execName = path.basename(process.execPath).toLowerCase();
	if (!/^(node|bun)(\.exe)?$/.test(execName)) return { command: process.execPath, args };
	return { command: "pi", args };
}

async function writePromptFile(agentName: string, prompt: string): Promise<{ dir: string; filePath: string }> {
	const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "pi-ai-engineer-"));
	const filePath = path.join(dir, `prompt-${agentName.replace(/[^\w.-]+/g, "_")}.md`);
	await withFileMutationQueue(filePath, async () => {
		await fs.promises.writeFile(filePath, prompt, { encoding: "utf8", mode: 0o600 });
	});
	return { dir, filePath };
}

function finalAssistantText(messages: Array<{ role?: string; content?: Array<{ type?: string; text?: string }> }>): string {
	for (let i = messages.length - 1; i >= 0; i--) {
		const msg = messages[i];
		if (msg?.role !== "assistant") continue;
		for (const part of msg.content ?? []) {
			if (part.type === "text" && part.text) return part.text;
		}
	}
	return "";
}

export async function runAgent(opts: {
	cwd: string;
	agent: AgentConfig;
	task: string;
	model?: string;
	signal?: AbortSignal;
	availableTools?: readonly string[];
}): Promise<SubagentResult> {
	const args = ["--mode", "json", "-p", "--no-session"];
	const model = opts.agent.model ?? opts.model;
	if (model) args.push("--model", model);
	const tools = resolveSpawnTools(opts.agent.tools, opts.availableTools);
	if (tools?.length) args.push("--tools", tools.join(","));

	let tmpDir: string | null = null;
	let tmpPath: string | null = null;
	const messages: Array<{ role?: string; content?: Array<{ type?: string; text?: string }> }> = [];
	let stderr = "";

	try {
		if (opts.agent.systemPrompt.trim()) {
			const tmp = await writePromptFile(opts.agent.name, opts.agent.systemPrompt);
			tmpDir = tmp.dir;
			tmpPath = tmp.filePath;
			args.push("--append-system-prompt", tmpPath);
		}
		args.push(opts.task);

		const exitCode = await new Promise<number>((resolve) => {
			const invocation = piInvocation(args);
			const proc = spawn(invocation.command, invocation.args, {
				cwd: opts.cwd,
				shell: false,
				stdio: ["ignore", "pipe", "pipe"],
			});
			let buffer = "";
			const onLine = (line: string) => {
				if (!line.trim()) return;
				try {
					const event = JSON.parse(line) as { type?: string; message?: (typeof messages)[number] };
					if ((event.type === "message_end" || event.type === "tool_result_end") && event.message) {
						messages.push(event.message);
					}
				} catch {
					/* ignore non-JSON */
				}
			};
			proc.stdout.on("data", (chunk) => {
				buffer += chunk.toString();
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				for (const line of lines) onLine(line);
			});
			proc.stderr.on("data", (chunk) => {
				stderr += chunk.toString();
			});
			proc.on("close", (code) => {
				if (buffer.trim()) onLine(buffer);
				resolve(code ?? 0);
			});
			proc.on("error", () => resolve(1));
			if (opts.signal) {
				const kill = () => {
					proc.kill("SIGTERM");
					setTimeout(() => {
						if (!proc.killed) proc.kill("SIGKILL");
					}, 4000);
				};
				if (opts.signal.aborted) kill();
				else opts.signal.addEventListener("abort", kill, { once: true });
			}
		});

		const output = finalAssistantText(messages) || stderr.trim() || "(no output)";
		return {
			agent: opts.agent.name,
			task: opts.task,
			ok: exitCode === 0,
			output,
			stderr,
			exitCode,
		};
	} finally {
		if (tmpPath) try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
		if (tmpDir) try { fs.rmdirSync(tmpDir); } catch { /* ignore */ }
	}
}

export async function runParallel(
	items: Array<{ agent: AgentConfig; task: string }>,
	opts: { cwd: string; model?: string; signal?: AbortSignal; availableTools?: readonly string[] },
): Promise<SubagentResult[]> {
	if (items.length > MAX_PARALLEL) {
		throw new Error(`Too many parallel tasks (${items.length}). Max is ${MAX_PARALLEL}.`);
	}
	const results: SubagentResult[] = new Array(items.length);
	let next = 0;
	const workers = Array.from({ length: Math.min(MAX_CONCURRENCY, items.length) }, async () => {
		while (true) {
			const i = next++;
			if (i >= items.length) return;
			const item = items[i];
			if (!item) return;
			results[i] = await runAgent({
				cwd: opts.cwd,
				agent: item.agent,
				task: item.task,
				model: opts.model,
				signal: opts.signal,
				availableTools: opts.availableTools,
			});
		}
	});
	await Promise.all(workers);
	return results;
}

export function formatResults(results: SubagentResult[]): string {
	return results
		.map((r) => {
			const status = r.ok ? "completed" : `failed (${r.exitCode})`;
			return `### [${r.agent}] ${status}\n\n${r.output}`;
		})
		.join("\n\n---\n\n");
}
