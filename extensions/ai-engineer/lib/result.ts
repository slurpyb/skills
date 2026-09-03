import type { AgentToolResult } from "@earendil-works/pi-coding-agent";

export function ok<T>(text: string, details: T): AgentToolResult<T> {
	return { content: [{ type: "text", text }], details };
}

export function fail<T>(text: string, details: T): AgentToolResult<T> {
	return { content: [{ type: "text", text: `Error: ${text}` }], details };
}

export function nextStep(phase: string, hint: string): string {
	return `\n\nNext: ${hint}\nLoop phase: ${phase}`;
}
