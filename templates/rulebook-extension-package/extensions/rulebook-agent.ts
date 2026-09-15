import { readFile, realpath } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  truncateHead,
  type ExtensionAPI,
  type ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

// CUSTOMIZE: rename these two values, then rename this file if useful.
const AGENT_ID = "rulebook-agent";
const AGENT_TITLE = "Rulebook Agent";
const PACKAGE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROFILE_PATH = join(PACKAGE_DIR, "PROFILE.md");
const MINI_RULES_PATH = join(PACKAGE_DIR, "rules", "mini.md");
const FULL_RULES_PATH = join(PACKAGE_DIR, "rules", "full.md");
const STATE_ENTRY = `${AGENT_ID}-state`;
const REFERENCE_TOOL = `${AGENT_ID.replaceAll("-", "_")}_reference`;
const ROLE_TOOLS = [REFERENCE_TOOL];
const CURATED_TOOLS = [
  "read",
  "bash",
  "edit",
  "write",
  "grep",
  "find",
  "ls",
  "ffgrep",
  "fffind",
  "codegraph",
  "symbol_search",
  "module_report",
  "read_symbol",
  "read_enclosing",
  "lens_diagnostics",
  ...ROLE_TOOLS,
];

type AgentState = { active: boolean; task?: string };
type Section = { heading: string; body: string };
type ReferenceDetails = {
  status: "ok" | "not_found" | "cancelled";
  matches: Array<{ heading: string; score: number }>;
  truncated: boolean;
};
type Exec = (
  command: string,
  args: string[],
  options?: { cwd?: string; timeout?: number; signal?: AbortSignal },
) => Promise<{ stdout: string; stderr: string; code: number }>;

export function parseSections(content: string): Section[] {
  const sections: Section[] = [];
  let heading = "Overview";
  let lines: string[] = [];
  const flush = (): void => {
    const body = lines.join("\n").trim();
    if (body) sections.push({ heading, body });
  };
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^#{2,3}\s+(.+)$/);
    if (!match) {
      lines.push(line);
      continue;
    }
    flush();
    heading = match[1].trim();
    lines = [];
  }
  flush();
  return sections;
}

export function searchSections(
  sections: Section[],
  query: string,
  limit: number,
): Array<Section & { score: number }> {
  const normalized = query.trim().toLowerCase();
  const terms = [
    ...new Set(
      normalized.split(/[^a-z0-9]+/).filter((term) => term.length > 2),
    ),
  ];
  return sections
    .map((section) => {
      const heading = section.heading.toLowerCase();
      const body = section.body.toLowerCase();
      const score = terms.reduce(
        (total, term) =>
          total +
          (heading.includes(term) ? 5 : 0) +
          (body.includes(term) ? 1 : 0),
        heading.includes(normalized) ? 12 : 0,
      );
      return { ...section, score };
    })
    .filter((section) => section.score > 0)
    .sort((a, b) => b.score - a.score || a.heading.localeCompare(b.heading))
    .slice(0, limit);
}

export function buildSystemPrompt(
  profile: string,
  miniRules: string,
  basePrompt: string,
  repository: string,
  task?: string,
): string {
  return `${profile}\n\n## Rulebook policy\n\n${miniRules}\n\n## Pi runtime and project policy\n\n${basePrompt}\n\n## Live repository context\n\n${repository}\n\n## Assigned task\n\n${task || "Continue the active task."}`;
}

async function repositoryContext(
  cwd: string,
  contextFiles: string[],
  exec: Exec,
): Promise<string> {
  const rootResult = await exec("git", ["rev-parse", "--show-toplevel"], {
    cwd,
    timeout: 5_000,
  });
  if (rootResult.code !== 0)
    return `Working directory: ${cwd}\nGit repository: none`;
  const root = await realpath(rootResult.stdout.trim());
  const [branch, status] = await Promise.all([
    exec("git", ["branch", "--show-current"], { cwd: root, timeout: 5_000 }),
    exec("git", ["status", "--short"], { cwd: root, timeout: 10_000 }),
  ]);
  const instructions = contextFiles.map((path) => {
    const absolute = isAbsolute(path) ? path : resolve(cwd, path);
    const local = relative(root, absolute);
    return local === "" || (!local.startsWith("..") && !isAbsolute(local))
      ? local || "."
      : path;
  });
  return truncateHead(
    [
      `Repository: ${root}`,
      `Branch: ${branch.stdout.trim() || "detached"}`,
      `Loaded project instructions: ${instructions.join(", ") || "none"}`,
      "Git status:",
      status.stdout.trim() || "clean",
    ].join("\n"),
    { maxBytes: 12_000, maxLines: 240 },
  ).content;
}

function latestState(ctx: ExtensionContext): AgentState | undefined {
  let state: AgentState | undefined;
  for (const entry of ctx.sessionManager.getBranch()) {
    if (entry.type === "custom" && entry.customType === STATE_ENTRY)
      state = entry.data as AgentState;
  }
  return state;
}

// CUSTOMIZE: register deterministic project/role tools here and add their names to ROLE_TOOLS.
function registerProjectTools(_pi: ExtensionAPI): void {}

export default async function rulebookAgent(pi: ExtensionAPI) {
  const [profile, miniRules, fullRules] = await Promise.all([
    readFile(PROFILE_PATH, "utf8"),
    readFile(MINI_RULES_PATH, "utf8"),
    readFile(FULL_RULES_PATH, "utf8"),
  ]);
  const sections = parseSections(fullRules);
  let state: AgentState = { active: false };

  pi.registerTool({
    name: REFERENCE_TOOL,
    label: `${AGENT_TITLE} Reference`,
    description:
      "Search the bundled full rulebook after identifying a concrete decision or tradeoff.",
    parameters: Type.Object({
      query: Type.String({ minLength: 1, maxLength: 300 }),
      limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 6 })),
    }),
    async execute(
      _toolCallId,
      params,
      signal,
    ): Promise<{
      content: Array<{ type: "text"; text: string }>;
      details: ReferenceDetails;
    }> {
      if (signal?.aborted) {
        return {
          content: [{ type: "text", text: "Rulebook lookup cancelled." }],
          details: { status: "cancelled", matches: [], truncated: false },
        };
      }
      const matches = searchSections(sections, params.query, params.limit ?? 3);
      const output = matches
        .map((match) => `## ${match.heading}\n\n${match.body}`)
        .join("\n\n---\n\n");
      const bounded = truncateHead(output, { maxBytes: 20_000, maxLines: 400 });
      return {
        content: [
          {
            type: "text",
            text:
              bounded.content || `No rulebook section matched: ${params.query}`,
          },
        ],
        details: {
          status: matches.length ? "ok" : "not_found",
          matches: matches.map(({ heading, score }) => ({ heading, score })),
          truncated: bounded.truncated,
        },
      };
    },
  });
  registerProjectTools(pi);

  const sync = (ctx: ExtensionContext): void => {
    state = latestState(ctx) ?? { active: pi.getFlag(AGENT_ID) === true };
    const ordinary = pi
      .getActiveTools()
      .filter((name) => !ROLE_TOOLS.includes(name));
    if (state.active) {
      const available = new Set(pi.getAllTools().map((tool) => tool.name));
      pi.setActiveTools(CURATED_TOOLS.filter((name) => available.has(name)));
    } else {
      pi.setActiveTools(ordinary);
    }
    ctx.ui.setStatus(
      AGENT_ID,
      state.active ? `${AGENT_TITLE} active` : undefined,
    );
  };

  pi.registerFlag(AGENT_ID, {
    description: `Run the current session as ${AGENT_TITLE}`,
    type: "boolean",
    default: false,
  });
  pi.registerCommand(AGENT_ID, {
    description: `Start a dedicated ${AGENT_TITLE} session`,
    handler: async (args, ctx) => {
      const task = args.trim();
      if (!task) {
        ctx.ui.notify(`Usage: /${AGENT_ID} <task>`, "warning");
        return;
      }
      const nextState: AgentState = { active: true, task };
      await ctx.waitForIdle();
      const result = await ctx.newSession({
        parentSession: ctx.sessionManager.getSessionFile(),
        setup: async (sessionManager) => {
          sessionManager.appendCustomEntry(STATE_ENTRY, nextState);
          sessionManager.appendSessionInfo(
            `${AGENT_TITLE}: ${task.slice(0, 72)}`,
          );
        },
        withSession: async (next) => next.sendUserMessage(task),
      });
      if (result.cancelled)
        ctx.ui.notify(`${AGENT_TITLE} launch cancelled.`, "warning");
    },
  });

  pi.on("session_start", async (_event, ctx) => sync(ctx));
  pi.on("session_tree", async (_event, ctx) => sync(ctx));
  pi.on("before_agent_start", async (event) => {
    if (!state.active) return;
    const repository = await repositoryContext(
      event.systemPromptOptions.cwd,
      event.systemPromptOptions.contextFiles?.map((file) => file.path) ?? [],
      pi.exec.bind(pi) as Exec,
    );
    return {
      systemPrompt: buildSystemPrompt(
        profile,
        miniRules,
        event.systemPrompt,
        repository,
        state.task,
      ),
    };
  });
}
