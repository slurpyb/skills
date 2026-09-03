export interface RubricIssue {
	id: string;
	severity: "critical" | "high" | "medium";
	message: string;
}

export interface RubricResult {
	score: number;
	issues: RubricIssue[];
	verdict: "approved" | "needs_revision" | "rejected";
	notes: string;
}

const CRITICAL_MARKERS = [/#\s*objective/i, /#\s*task/i, /your (task|goal|job)/i, /immediate task/i];
const FORMAT_MARKERS = [/output format/i, /respond with/i, /return (json|markdown|yaml)/i, /## output/i];
const GUARD_MARKERS = [/forbidden/i, /never /i, /do not /i, /constraints/i, /must not/i];

function hasAny(text: string, patterns: RegExp[]): boolean {
	return patterns.some((re) => re.test(text));
}

export function reviewPromptText(body: string, opts?: { hasMaterials?: boolean; goal?: string }): RubricResult {
	const issues: RubricIssue[] = [];
	const trimmed = body.trim();

	if (trimmed.length < 80) {
		issues.push({ id: "too-short", severity: "critical", message: "Prompt is too short to be a sealed worker packet." });
	}
	if (trimmed.length > 24_000) {
		issues.push({ id: "too-long", severity: "high", message: "Prompt exceeds a tight packet; cut restated context." });
	}
	if (!hasAny(trimmed, CRITICAL_MARKERS) && !/^[^\n]{20,}/.test(trimmed)) {
		issues.push({ id: "no-task", severity: "critical", message: "No explicit task/objective heading." });
	}
	if (!hasAny(trimmed, FORMAT_MARKERS)) {
		issues.push({ id: "no-format", severity: "high", message: "No output format. Workers need a return shape." });
	}
	if (!hasAny(trimmed, GUARD_MARKERS)) {
		issues.push({ id: "no-guards", severity: "medium", message: "No constraints/forbidden section." });
	}
	if (opts?.hasMaterials && !/path\/|\.ts|\.py|\.go|\.md|Files Retrieved|materials/i.test(trimmed)) {
		issues.push({
			id: "no-grounding",
			severity: "high",
			message: "Job has gathered materials but the prompt cites no files or excerpts.",
		});
	}
	if (opts?.goal && opts.goal.length > 8 && !trimmed.toLowerCase().includes(opts.goal.slice(0, 24).toLowerCase())) {
		issues.push({
			id: "goal-drift",
			severity: "medium",
			message: "Prompt does not mention the job goal; workers will invent scope.",
		});
	}
	if (/\b(you know everything|do what's logical|figure it out)\b/i.test(trimmed)) {
		issues.push({ id: "omniscient", severity: "high", message: "Omniscient/implicit instructions. Bound the worker." });
	}

	const penalty = issues.reduce((sum, issue) => sum + (issue.severity === "critical" ? 4 : issue.severity === "high" ? 2 : 1), 0);
	const score = Math.max(0, 10 - penalty);
	const verdict: RubricResult["verdict"] =
		issues.some((i) => i.severity === "critical") || score < 5
			? "needs_revision"
			: score < 7
				? "needs_revision"
				: "approved";

	return {
		score,
		issues,
		verdict: trimmed.length === 0 ? "rejected" : verdict,
		notes: issues.length === 0 ? "Rubric pass. Ready for fan-out." : issues.map((i) => `${i.severity}: ${i.message}`).join("\n"),
	};
}

export function parseSubagentVerdict(text: string): RubricResult["verdict"] | undefined {
	const upper = text.toUpperCase();
	if (/\bVERDICT:\s*APPROVE/.test(upper) || /\bAPPROVE\b/.test(upper.split("\n")[0] ?? "")) return "approved";
	if (/\bVERDICT:\s*REJECT/.test(upper)) return "rejected";
	if (/\bVERDICT:\s*REVISE/.test(upper) || /\bNEEDS[_\s-]?REVISION\b/.test(upper)) return "needs_revision";
	return undefined;
}

export function mergeReviews(local: RubricResult, remote?: RubricResult): RubricResult {
	if (!remote) return local;
	const rank = { rejected: 0, needs_revision: 1, approved: 2 };
	const verdict = rank[local.verdict] <= rank[remote.verdict] ? local.verdict : remote.verdict;
	return {
		score: Math.min(local.score, remote.score),
		issues: [...local.issues, ...remote.issues],
		verdict,
		notes: [local.notes, remote.notes].filter(Boolean).join("\n---\n"),
	};
}
