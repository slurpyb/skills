export const PHASES = ["idle", "understood", "gathered", "drafted", "reviewed", "dispatched"] as const;
export type Phase = (typeof PHASES)[number];

export type PromptStatus = "draft" | "needs_revision" | "approved" | "rejected";

export interface CodegraphSnapshot {
	backend: string;
	action: string;
	query?: string;
	summary: string;
	hits: Array<{ path: string; note: string }>;
	deeper: string[];
}

export interface Material {
	source: string;
	agent: string;
	body: string;
}

export interface DraftPrompt {
	id: string;
	template: string;
	body: string;
	status: PromptStatus;
	review?: {
		verdict: PromptStatus;
		score: number;
		issues: Array<{ id: string; severity: string; message: string }>;
		notes: string;
	};
}

export interface Job {
	id: string;
	goal: string;
	cwd: string;
	phase: Phase;
	codegraph?: CodegraphSnapshot;
	materials: Material[];
	prompts: DraftPrompt[];
	updatedAt: number;
}

const jobs = new Map<string, Job>();

function key(cwd: string): string {
	return cwd;
}

export function getJob(cwd: string): Job | undefined {
	return jobs.get(key(cwd));
}

export function requireJob(cwd: string): Job {
	const job = getJob(cwd);
	if (!job) {
		throw new Error("No orchestration job in this session. Call codegraph first, or /engineer <goal>.");
	}
	return job;
}

export function startJob(cwd: string, goal: string): Job {
	const job: Job = {
		id: `job-${Date.now().toString(36)}`,
		goal,
		cwd,
		phase: "idle",
		materials: [],
		prompts: [],
		updatedAt: Date.now(),
	};
	jobs.set(key(cwd), job);
	return job;
}

export function ensureJob(cwd: string, goal?: string): Job {
	return getJob(cwd) ?? startJob(cwd, goal ?? "(unspecified)");
}

export function setPhase(job: Job, phase: Phase): void {
	job.phase = phase;
	job.updatedAt = Date.now();
}

export function recordCodegraph(job: Job, snapshot: CodegraphSnapshot): void {
	job.codegraph = snapshot;
	if (job.phase === "idle") setPhase(job, "understood");
	job.updatedAt = Date.now();
}

export function recordMaterials(job: Job, materials: Material[]): void {
	job.materials.push(...materials);
	if (PHASES.indexOf(job.phase) < PHASES.indexOf("gathered")) setPhase(job, "gathered");
	job.updatedAt = Date.now();
}

export function recordPrompt(job: Job, prompt: DraftPrompt): DraftPrompt {
	const existing = job.prompts.findIndex((p) => p.id === prompt.id);
	if (existing >= 0) job.prompts[existing] = prompt;
	else job.prompts.push(prompt);
	if (PHASES.indexOf(job.phase) < PHASES.indexOf("drafted")) setPhase(job, "drafted");
	job.updatedAt = Date.now();
	return prompt;
}

export function applyReview(job: Job, promptId: string, review: NonNullable<DraftPrompt["review"]>): DraftPrompt {
	const prompt = job.prompts.find((p) => p.id === promptId);
	if (!prompt) throw new Error(`Unknown prompt id "${promptId}". Use prompt_template fill first.`);
	prompt.review = review;
	prompt.status = review.verdict;
	prompt.body = prompt.body; // keep current body; revise happens by re-fill
	const allSettled = job.prompts.length > 0 && job.prompts.every((p) => p.status === "approved" || p.status === "rejected");
	const anyApproved = job.prompts.some((p) => p.status === "approved");
	if (anyApproved) setPhase(job, "reviewed");
	else if (allSettled) setPhase(job, "drafted");
	job.updatedAt = Date.now();
	return prompt;
}

export function approvedPrompts(job: Job): DraftPrompt[] {
	return job.prompts.filter((p) => p.status === "approved");
}

export function markDispatched(job: Job): void {
	if (approvedPrompts(job).length === 0) {
		throw new Error("fanout_tasks is gated: approve at least one prompt with review_prompt first.");
	}
	setPhase(job, "dispatched");
}

export function summarizeJob(job: Job): string {
	const approved = approvedPrompts(job).length;
	return [
		`Job ${job.id}`,
		`Goal: ${job.goal}`,
		`Phase: ${job.phase}`,
		`Materials: ${job.materials.length}`,
		`Prompts: ${job.prompts.length} (${approved} approved)`,
		job.codegraph ? `Codegraph: ${job.codegraph.backend} / ${job.codegraph.action}` : "Codegraph: none",
	].join("\n");
}

export function formatMaterials(job: Job, maxChars = 8000): string {
	if (job.materials.length === 0) return "(no gathered materials)";
	const parts: string[] = [];
	let used = 0;
	for (const item of job.materials) {
		const chunk = `### ${item.agent} — ${item.source}\n${item.body}\n`;
		if (used + chunk.length > maxChars) {
			parts.push(`… ${job.materials.length - parts.length} more materials truncated`);
			break;
		}
		parts.push(chunk);
		used += chunk.length;
	}
	return parts.join("\n");
}

export function clearJob(cwd: string): void {
	jobs.delete(key(cwd));
}
