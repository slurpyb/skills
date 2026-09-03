import fs from "node:fs";
import path from "node:path";
import { LIBRARY_TEMPLATES_DIR, TEMPLATES_DIR } from "./paths.ts";

export interface Template {
	id: string;
	title: string;
	source: string;
	body: string;
	variables: string[];
}

const IF_BLOCK = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
const MUSTACHE = /\{\{\s*(\w+)\s*\}\}/g;
const BRACE = /(?<!\{)\{([a-zA-Z_][a-zA-Z0-9_]*)\}(?!\})/g;

export function extractVariables(body: string): string[] {
	const names = new Set<string>();
	for (const re of [MUSTACHE, BRACE, /\{\{#if\s+(\w+)\}\}/g]) {
		re.lastIndex = 0;
		let match: RegExpExecArray | null;
		while ((match = re.exec(body))) {
			if (match[1]) names.add(match[1]);
		}
	}
	return [...names];
}

export function fillTemplate(body: string, vars: Record<string, string | undefined>): { text: string; missing: string[] } {
	const missing: string[] = [];
	let text = body.replace(IF_BLOCK, (_all, name: string, inner: string) => {
		const value = vars[name];
		return value ? inner : "";
	});
	text = text.replace(MUSTACHE, (_all, name: string) => {
		const value = vars[name];
		if (value === undefined) {
			missing.push(name);
			return `{{${name}}}`;
		}
		return value;
	});
	text = text.replace(BRACE, (_all, name: string) => {
		const value = vars[name];
		if (value === undefined) {
			missing.push(name);
			return `{${name}}`;
		}
		return value;
	});
	return { text, missing: [...new Set(missing)] };
}

function titleFrom(body: string, fallback: string): string {
	const heading = body.match(/^#\s+(.+)$/m);
	return heading?.[1]?.trim() || fallback;
}

function loadMarkdownTemplate(id: string, filePath: string): Template | undefined {
	let body: string;
	try {
		body = fs.readFileSync(filePath, "utf8");
	} catch {
		return undefined;
	}
	return {
		id,
		title: titleFrom(body, id),
		source: filePath,
		body,
		variables: extractVariables(body),
	};
}

function walkMarkdown(dir: string, prefix: string, acc: Template[]): void {
	if (!fs.existsSync(dir)) return;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walkMarkdown(full, `${prefix}${entry.name}/`, acc);
			continue;
		}
		if (!entry.name.endsWith(".md")) continue;
		const id = `${prefix}${entry.name.replace(/\.md$/, "")}`;
		const loaded = loadMarkdownTemplate(id, full);
		if (loaded) acc.push(loaded);
	}
}

export function listTemplates(): Template[] {
	const acc: Template[] = [];
	walkMarkdown(TEMPLATES_DIR, "", acc);
	walkMarkdown(LIBRARY_TEMPLATES_DIR, "library/", acc);
	return acc;
}

export function getTemplate(id: string): Template | undefined {
	return listTemplates().find((t) => t.id === id);
}
