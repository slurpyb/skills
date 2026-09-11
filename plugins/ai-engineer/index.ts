import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { formatSnapshot, runCodegraph, type CodegraphInput } from "./lib/codegraph.ts";
import {
	applyReview,
	approvedPrompts,
	ensureJob,
	formatMaterials,
	getJob,
	markDispatched,
	recordCodegraph,
	recordMaterials,
	recordPrompt,
	startJob,
	summarizeJob,
	type DraftPrompt,
} from "./lib/loop.ts";
import { GUIDELINES, LOOP } from "./lib/pointers.ts";
import { fail, nextStep, ok } from "./lib/result.ts";
import { mergeReviews, parseSubagentVerdict, reviewPromptText } from "./lib/review.ts";
import { discoverAgents, formatResults, runAgent, runParallel } from "./lib/subagent.ts";
import { fillTemplate, getTemplate, listTemplates } from "./lib/templates.ts";

const ACTIONS = ["map", "search", "symbol", "deps"] as const;

function modelOf(ctx: { model?: { provider: string; id: string } | undefined }): string | undefined {
	return ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : undefined;
}

function sessionToolNames(pi: ExtensionAPI): string[] {
	try {
		return pi.getAllTools().map((t) => t.name);
	} catch {
		return [];
	}
}

function jobVars(cwd: string, extra: Record<string, string | undefined> = {}): Record<string, string | undefined> {
	const job = getJob(cwd);
	return {
		goal: job?.goal,
		materials: job ? formatMaterials(job) : undefined,
		codegraph: job?.codegraph ? formatSnapshot(job.codegraph) : undefined,
		...extra,
	};
}

export default function (pi: ExtensionAPI) {
	pi.on("session_start", (_event, ctx) => {
		const job = getJob(ctx.cwd);
		ctx.ui.setStatus("ai-engineer", job ? `engineer:${job.phase}` : undefined);
	});

	pi.registerCommand("engineer", {
		description: "Start or inspect the AI Engineer loop (codegraph → gather → template → review → fan-out)",
		handler: async (args, ctx) => {
			const goal = args.trim();
			if (!goal) {
				const job = getJob(ctx.cwd);
				ctx.ui.notify(job ? summarizeJob(job) : `No job. /engineer <goal>\n${LOOP}`, job ? "info" : "warning");
				return;
			}
			const job = startJob(ctx.cwd, goal);
			ctx.ui.setStatus("ai-engineer", `engineer:${job.phase}`);
			ctx.ui.notify(`${summarizeJob(job)}\nNext: codegraph map or search.`, "info");
			pi.sendUserMessage(
				`Start the AI Engineer loop for: ${goal}\n\n${LOOP}\nBegin with codegraph. Do not fan out tasks until review_prompt approves a draft.`,
				{ deliverAs: "followUp" },
			);
		},
	});

	pi.registerTool({
		name: "codegraph",
		label: "Codegraph",
		description:
			"Orients on a codebase via a local graph wrapper (find/rg/ast-grep) and routes to pi-lens when that package is loaded. Use at the start of an AI Engineer job — map, search, symbol, or deps — before gather_materials.",
		promptSnippet: "Orient on the repo (map/search/symbol/deps) before gathering materials",
		promptGuidelines: GUIDELINES,
		parameters: Type.Object({
			action: Type.String({ description: "map | search | symbol | deps" }),
			query: Type.Optional(Type.String({ description: "Search/symbol/import query" })),
			path: Type.Optional(Type.String({ description: "Subtree to scope, default cwd" })),
			limit: Type.Optional(Type.Number({ description: "Max hits (1–80)" })),
			goal: Type.Optional(Type.String({ description: "Starts a job if none exists" })),
		}),
		executionMode: "parallel",
		async execute(_id, params, signal, _onUpdate, ctx) {
			const action = params.action as CodegraphInput["action"];
			if (!ACTIONS.includes(action)) {
				return fail(`Unknown action "${params.action}". Use map | search | symbol | deps.`, { action: params.action });
			}
			const job = ensureJob(ctx.cwd, params.goal);
			if (params.goal) job.goal = params.goal;
			try {
				const snapshot = await runCodegraph(pi, ctx.cwd, { action, query: params.query, path: params.path, limit: params.limit }, signal);
				recordCodegraph(job, snapshot);
				ctx.ui.setStatus("ai-engineer", `engineer:${job.phase}`);
				return ok(
					`${formatSnapshot(snapshot)}${nextStep(job.phase, "gather_materials with one slice per parallel worker")}`,
					{ job: job.id, phase: job.phase, snapshot },
				);
			} catch (err) {
				return fail(err instanceof Error ? err.message : String(err), { phase: job.phase });
			}
		},
	});

	pi.registerTool({
		name: "gather_materials",
		label: "Gather Materials",
		description:
			"First fan-out: spawn read-only gatherer subagents in parallel to collect files, excerpts, terminology, and gaps. Use after codegraph, before filling prompt templates. Each slice is one worker.",
		promptSnippet: "Fan out read-only gatherers before writing worker prompts",
		parameters: Type.Object({
			slices: Type.Array(Type.String(), { description: "One recon slice per worker" }),
			agent: Type.Optional(Type.String({ description: "Agent name, default gatherer" })),
			goal: Type.Optional(Type.String({ description: "Job goal if not already started" })),
		}),
		async execute(_id, params, signal, _onUpdate, ctx) {
			const slices = params.slices.filter((s) => s.trim());
			if (slices.length === 0) return fail("Provide at least one gather slice.", {});
			const job = ensureJob(ctx.cwd, params.goal);
			if (params.goal) job.goal = params.goal;
			const agents = discoverAgents(ctx.cwd, "all");
			const agentName = params.agent || "gatherer";
			const agent = agents.find((a) => a.name === agentName);
			if (!agent) {
				return fail(`Unknown agent "${agentName}". Available: ${agents.map((a) => a.name).join(", ") || "none"}`, {});
			}
			const gatherTpl = getTemplate("gather");
			const items = slices.map((slice) => {
				const filled = gatherTpl
					? fillTemplate(gatherTpl.body, jobVars(ctx.cwd, { slice, instructions: slice })).text
					: `Gather materials for ${job.goal}. Slice: ${slice}\n${job.codegraph ? formatSnapshot(job.codegraph) : ""}`;
				return { agent, task: filled };
			});
			try {
				const results = await runParallel(items, {
					cwd: ctx.cwd,
					model: modelOf(ctx),
					signal,
					availableTools: sessionToolNames(pi),
				});
				recordMaterials(
					job,
					results.map((r, i) => ({
						source: slices[i] ?? r.agent,
						agent: r.agent,
						body: r.output,
					})),
				);
				ctx.ui.setStatus("ai-engineer", `engineer:${job.phase}`);
				return ok(
					`${formatResults(results)}${nextStep(job.phase, "prompt_template fill (template=task) using these materials")}`,
					{ job: job.id, phase: job.phase, results },
				);
			} catch (err) {
				return fail(err instanceof Error ? err.message : String(err), { phase: job.phase });
			}
		},
	});

	pi.registerTool({
		name: "prompt_template",
		label: "Prompt Template",
		description:
			"Lists, shows, or fills prompt templates with gathered materials. Use after gather_materials to produce sealed worker prompts. Built-in templates: gather, task, review, plus prompt-library.",
		promptSnippet: "Fill a prompt template from gathered materials",
		parameters: Type.Object({
			action: Type.String({ description: "list | show | fill" }),
			template: Type.Optional(Type.String({ description: "Template id (show/fill)" })),
			vars: Type.Optional(Type.Record(Type.String(), Type.String(), { description: "Template variables" })),
			promptId: Type.Optional(Type.String({ description: "Reuse an id when revising" })),
		}),
		executionMode: "parallel",
		async execute(_id, params, _signal, _onUpdate, ctx) {
			if (params.action === "list") {
				const templates = listTemplates();
				const lines = templates.map((t) => `- \`${t.id}\` — ${t.title} (${t.variables.join(", ") || "no vars"})`);
				return ok(lines.join("\n") || "No templates found.", { templates: templates.map((t) => t.id) });
			}
			if (!params.template) return fail("template id required for show/fill", {});
			const tpl = getTemplate(params.template);
			if (!tpl) return fail(`Unknown template "${params.template}". Call action=list.`, {});
			if (params.action === "show") {
				return ok(`# ${tpl.id}\nVars: ${tpl.variables.join(", ") || "(none)"}\nSource: ${tpl.source}\n\n${tpl.body}`, {
					id: tpl.id,
					variables: tpl.variables,
				});
			}
			if (params.action !== "fill") return fail(`Unknown action "${params.action}". Use list | show | fill.`, {});
			const job = ensureJob(ctx.cwd);
			const { text, missing } = fillTemplate(tpl.body, jobVars(ctx.cwd, params.vars ?? {}));
			const draft: DraftPrompt = {
				id: params.promptId || `prompt-${Date.now().toString(36)}`,
				template: tpl.id,
				body: text,
				status: "draft",
			};
			recordPrompt(job, draft);
			ctx.ui.setStatus("ai-engineer", `engineer:${job.phase}`);
			const missingNote = missing.length ? `\nUnresolved placeholders: ${missing.join(", ")}` : "";
			return ok(
				`Draft ${draft.id} from \`${tpl.id}\`${missingNote}\n\n${text}${nextStep(job.phase, `review_prompt promptId=${draft.id}`)}`,
				{ job: job.id, phase: job.phase, prompt: draft, missing },
			);
		},
	});

	pi.registerTool({
		name: "review_prompt",
		label: "Review Prompt",
		description:
			"Gates the second fan-out. Critiques a draft worker prompt with the local rubric and optionally a prompt-reviewer subagent. Use after prompt_template fill; approve before fanout_tasks.",
		promptSnippet: "Review a draft worker prompt before fanout_tasks",
		parameters: Type.Object({
			promptId: Type.Optional(Type.String({ description: "Draft id from prompt_template fill; defaults to latest" })),
			via: Type.Optional(Type.String({ description: "rubric (default) | subagent" })),
			verdict: Type.Optional(Type.String({ description: "Parent override: approved | needs_revision | rejected" })),
		}),
		async execute(_id, params, signal, _onUpdate, ctx) {
			const job = getJob(ctx.cwd);
			if (!job) return fail("No job. Fill a template first.", {});
			const prompt = params.promptId
				? job.prompts.find((p) => p.id === params.promptId)
				: job.prompts.at(-1);
			if (!prompt) return fail("No draft prompt. prompt_template fill first.", { phase: job.phase });

			const local = reviewPromptText(prompt.body, { hasMaterials: job.materials.length > 0, goal: job.goal });
			let remote = undefined;
			if ((params.via || "rubric") === "subagent") {
				const agents = discoverAgents(ctx.cwd, "all");
				const reviewer = agents.find((a) => a.name === "prompt-reviewer");
				if (!reviewer) return fail("prompt-reviewer agent missing from the extension agents/ folder.", {});
				const reviewTpl = getTemplate("review");
				const packet = reviewTpl
					? fillTemplate(reviewTpl.body, jobVars(ctx.cwd, { prompt: prompt.body })).text
					: prompt.body;
				const result = await runAgent({
					cwd: ctx.cwd,
					agent: reviewer,
					task: packet,
					model: modelOf(ctx),
					signal,
					availableTools: sessionToolNames(pi),
				});
				const parsed = parseSubagentVerdict(result.output);
				remote = {
					score: local.score,
					issues: local.issues,
					verdict: parsed ?? "needs_revision",
					notes: result.output,
				};
			}

			let merged = mergeReviews(local, remote);
			if (params.verdict === "approved" || params.verdict === "needs_revision" || params.verdict === "rejected") {
				merged = { ...merged, verdict: params.verdict };
			}
			const updated = applyReview(job, prompt.id, merged);
			ctx.ui.setStatus("ai-engineer", `engineer:${job.phase}`);
			const next =
				updated.status === "approved"
					? "fanout_tasks with this promptId"
					: "Revise via prompt_template fill (same promptId) then review_prompt again";
			return ok(
				`Prompt ${updated.id}: ${updated.status} (score ${merged.score}/10)\n${merged.notes}${nextStep(job.phase, next)}`,
				{ job: job.id, phase: job.phase, prompt: updated, rubric: merged },
			);
		},
	});

	pi.registerTool({
		name: "fanout_tasks",
		label: "Fan-out Tasks",
		description:
			"Second fan-out: runs approved worker prompts in parallel. Use only after review_prompt approves. Refuses drafts that are still unreviewed or needs_revision.",
		promptSnippet: "Dispatch approved worker prompts only",
		parameters: Type.Object({
			promptIds: Type.Optional(Type.Array(Type.String(), { description: "Subset of approved ids; default all approved" })),
			agent: Type.Optional(Type.String({ description: "Worker agent, default worker" })),
		}),
		async execute(_id, params, signal, _onUpdate, ctx) {
			const job = getJob(ctx.cwd);
			if (!job) return fail("No job. Run the loop from codegraph first.", {});
			let prompts = approvedPrompts(job);
			if (params.promptIds?.length) {
				prompts = prompts.filter((p) => params.promptIds?.includes(p.id));
			}
			if (prompts.length === 0) {
				const pending = job.prompts.map((p) => `${p.id}:${p.status}`).join(", ") || "none";
				return fail(
					`fanout_tasks is gated until review_prompt approves a draft. Current prompts: ${pending}`,
					{ phase: job.phase, prompts: job.prompts.map((p) => ({ id: p.id, status: p.status })) },
				);
			}
			const agents = discoverAgents(ctx.cwd, "all");
			const agentName = params.agent || "worker";
			const agent = agents.find((a) => a.name === agentName);
			if (!agent) {
				return fail(`Unknown agent "${agentName}". Available: ${agents.map((a) => a.name).join(", ") || "none"}`, {});
			}
			try {
				const results = await runParallel(
					prompts.map((p) => ({ agent, task: p.body })),
					{ cwd: ctx.cwd, model: modelOf(ctx), signal, availableTools: sessionToolNames(pi) },
				);
				markDispatched(job);
				ctx.ui.setStatus("ai-engineer", `engineer:${job.phase}`);
				return ok(`${formatResults(results)}${nextStep(job.phase, "Synthesize worker outputs in the parent")}`, {
					job: job.id,
					phase: job.phase,
					results,
				});
			} catch (err) {
				return fail(err instanceof Error ? err.message : String(err), { phase: job.phase });
			}
		},
	});
}
