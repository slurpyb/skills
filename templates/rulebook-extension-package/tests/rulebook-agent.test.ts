import { describe, expect, test } from "bun:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import rulebookAgent, {
  buildSystemPrompt,
  parseSections,
  searchSections,
} from "../extensions/rulebook-agent.ts";

async function exec(
  command: string,
  args: string[],
  options: { cwd?: string; signal?: AbortSignal } = {},
) {
  const child = Bun.spawn([command, ...args], {
    cwd: options.cwd,
    signal: options.signal,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { stdout, stderr, code };
}

function harness() {
  const tools = new Map<string, any>();
  const commands = new Map<string, any>();
  const handlers = new Map<string, any>();
  const entries: Array<{ type: "custom"; customType: string; data: unknown }> =
    [];
  const sent: string[] = [];
  let activeTools = ["read", "bash"];
  const pi = {
    registerTool(tool: any) {
      tools.set(tool.name, tool);
      activeTools.push(tool.name);
    },
    registerCommand(name: string, command: any) {
      commands.set(name, command);
    },
    registerFlag() {},
    on(name: string, handler: any) {
      handlers.set(name, handler);
    },
    getFlag() {
      return false;
    },
    getActiveTools() {
      return [...activeTools];
    },
    getAllTools() {
      return [...new Set([...activeTools, ...tools.keys()])].map((name) => ({
        name,
      }));
    },
    setActiveTools(names: string[]) {
      activeTools = [...names];
    },
    exec,
  } as unknown as ExtensionAPI;
  const ctx = {
    cwd: process.cwd(),
    sessionManager: {
      getBranch: () => entries,
      getSessionFile: () => "/tmp/parent.jsonl",
    },
    async waitForIdle() {},
    async newSession(options: any) {
      await options.setup({
        appendCustomEntry(customType: string, data: unknown) {
          entries.push({ type: "custom", customType, data });
        },
        appendSessionInfo() {},
      });
      await options.withSession({
        async sendUserMessage(message: string) {
          sent.push(message);
        },
      });
      return { cancelled: false };
    },
    ui: { setStatus() {}, notify() {} },
  };
  return {
    pi,
    ctx,
    tools,
    commands,
    handlers,
    entries,
    sent,
    activeTools: () => activeTools,
  };
}

describe("rulebook extension boilerplate", () => {
  test("composes role, rulebook, runtime, repository, and task context", () => {
    const prompt = buildSystemPrompt(
      "ROLE",
      "RULES",
      "BASE",
      "REPOSITORY",
      "TASK",
    );
    for (const value of ["ROLE", "RULES", "BASE", "REPOSITORY", "TASK"]) {
      expect(prompt).toContain(value);
    }
    expect(prompt).not.toContain("<skill>");
  });

  test("searches the full rulebook by heading", () => {
    const sections = parseSections(
      "## Boundaries\nKeep dependencies inward.\n### Dependency Rule\nSource dependencies point inward.",
    );
    expect(searchSections(sections, "Dependency Rule", 1)[0]?.heading).toBe(
      "Dependency Rule",
    );
  });

  test("keeps role tools out of ordinary sessions", async () => {
    const state = harness();
    await rulebookAgent(state.pi);
    await state.handlers.get("session_start")({}, state.ctx);
    expect(state.activeTools()).toEqual(["read", "bash"]);
    expect(await state.handlers.get("before_agent_start")({})).toBeUndefined();
  });

  test("starts a dedicated session and exposes bounded reference guidance", async () => {
    const state = harness();
    await rulebookAgent(state.pi);
    await state.commands
      .get("rulebook-agent")
      .handler("review package boundaries", state.ctx);
    expect(state.entries[0]?.customType).toBe("rulebook-agent-state");
    expect(state.sent).toEqual(["review package boundaries"]);

    await state.handlers.get("session_start")({}, state.ctx);
    expect(state.activeTools()).toContain("rulebook_agent_reference");
    const result = await state.tools
      .get("rulebook_agent_reference")
      .execute(
        "reference",
        { query: "Example decision" },
        new AbortController().signal,
      );
    expect(result.details.status).toBe("ok");
    expect(result.details.matches[0]?.heading).toBe("Example decision");
  });
});
