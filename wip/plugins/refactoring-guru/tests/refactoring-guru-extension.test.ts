import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import refactoringGuruExtension, {
  buildAgentSystemPrompt,
  parseCatalog,
  searchCatalog,
} from "../extensions/refactoring-guru.ts";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((path) => rm(path, { recursive: true, force: true })),
  );
});

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

async function repository() {
  const root = await mkdtemp(join(tmpdir(), "refactoring-guru-"));
  temporaryDirectories.push(root);
  await mkdir(join(root, "src"));
  await mkdir(join(root, "tests"));
  await mkdir(join(root, "types"));
  await writeFile(join(root, "AGENTS.md"), "Keep public behavior stable.\n");
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({ scripts: { test: "node --test", lint: "eslint ." } }),
  );
  await writeFile(
    join(root, "src", "auth.ts"),
    "export function authenticate() { return true; }\n",
  );
  await writeFile(
    join(root, "src", "caller.ts"),
    "import { authenticate } from './auth';\nexport const allowed = authenticate();\n",
  );
  await writeFile(
    join(root, "tests", "auth.test.ts"),
    "// authenticate remains stable\n",
  );
  await writeFile(
    join(root, "types", "auth.d.ts"),
    "export declare function authenticate(): boolean;\n",
  );
  expect((await exec("git", ["init", "-q"], { cwd: root })).code).toBe(0);
  expect(
    (
      await exec("git", ["config", "user.email", "test@example.com"], {
        cwd: root,
      })
    ).code,
  ).toBe(0);
  expect(
    (await exec("git", ["config", "user.name", "Test"], { cwd: root })).code,
  ).toBe(0);
  expect((await exec("git", ["add", "."], { cwd: root })).code).toBe(0);
  expect(
    (await exec("git", ["commit", "-qm", "fixture"], { cwd: root })).code,
  ).toBe(0);
  return root;
}

function harness(cwd: string) {
  const tools = new Map<string, any>();
  const commands = new Map<string, any>();
  const handlers = new Map<string, any>();
  const entries: Array<{ type: "custom"; customType: string; data: unknown }> =
    [];
  const launchedEntries: Array<{
    type: "custom";
    customType: string;
    data: unknown;
  }> = [];
  const notifications: string[] = [];
  const sentMessages: string[] = [];
  let activeTools = ["read", "bash", "edit", "write", "browser"];

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
    appendEntry(customType: string, data: unknown) {
      entries.push({ type: "custom", customType, data });
    },
    exec,
  } as unknown as ExtensionAPI;

  const ctx = {
    cwd,
    sessionManager: {
      getBranch: () => entries,
      getSessionFile: () => "/tmp/parent.jsonl",
    },
    async waitForIdle() {},
    async newSession(options: any) {
      await options.setup({
        appendCustomEntry(customType: string, data: unknown) {
          const entry = { type: "custom" as const, customType, data };
          launchedEntries.push(entry);
          entries.push(entry);
        },
        appendSessionInfo() {},
      });
      await options.withSession({
        async sendUserMessage(message: string) {
          sentMessages.push(message);
        },
      });
      return { cancelled: false };
    },
    ui: {
      setStatus() {},
      notify(message: string) {
        notifications.push(message);
      },
    },
  };

  return {
    pi,
    ctx,
    tools,
    commands,
    handlers,
    entries,
    launchedEntries,
    notifications,
    sentMessages,
    activeTools: () => activeTools,
  };
}

describe("catalog", () => {
  test("ranks a named smell ahead of incidental mentions", () => {
    const sections = parseCatalog(
      "## Bloaters\nOverview of Long Method.\n### Long Method\nExtract coherent work.\n### Large Class\nSplit responsibilities.",
    );
    expect(searchCatalog(sections, "Long Method", 2)[0]?.heading).toBe(
      "Long Method",
    );
  });
});

describe("system prompt", () => {
  test("defines an agent workflow instead of expanding a skill", () => {
    const prompt = buildAgentSystemPrompt("BASE", "MINI", "REPOSITORY", "TASK");
    expect(prompt).toStartWith("# Refactoring Guru agent");
    expect(prompt).toContain("call refactoring_checkpoint with action=start");
    expect(prompt).toContain(
      "Do not claim behavior preservation unless it returns pass",
    );
    expect(prompt).toContain("MINI");
    expect(prompt).toContain("BASE");
    expect(prompt).toContain("REPOSITORY");
    expect(prompt).toContain("TASK");
    expect(prompt).not.toContain("<skill>");
  });
});

describe("dedicated session", () => {
  test("launches a new agent session and activates only curated tools there", async () => {
    const root = await repository();
    const state = harness(root);
    await refactoringGuruExtension(state.pi);

    await state.handlers.get("session_start")({}, state.ctx);
    expect(state.activeTools()).toEqual([
      "read",
      "bash",
      "edit",
      "write",
      "browser",
    ]);

    await state.commands
      .get("refactoring-guru")
      .handler(
        "extract authentication policy without changing behavior",
        state.ctx,
      );
    expect(state.launchedEntries[0]?.customType).toBe("refactoring-guru-agent");
    expect(state.sentMessages[0]).toContain(
      "Do not edit before a passing refactoring_checkpoint baseline",
    );

    await state.handlers.get("session_start")({}, state.ctx);
    expect(state.activeTools()).toContain("refactoring_impact");
    expect(state.activeTools()).toContain("refactoring_checkpoint");
    expect(state.activeTools()).not.toContain("browser");

    const result = await state.handlers.get("before_agent_start")({
      systemPrompt: "BASE",
      systemPromptOptions: {
        cwd: root,
        contextFiles: [{ path: join(root, "AGENTS.md") }],
      },
    });
    expect(result.systemPrompt).toContain("# Refactoring Guru agent");
    expect(result.systemPrompt).toContain("extract authentication policy");
    expect(result.systemPrompt).toContain("AGENTS.md");
    expect(result.systemPrompt).toContain("package.json (lint, test)");
  });

  test("requires a task instead of toggling the current session", async () => {
    const root = await repository();
    const state = harness(root);
    await refactoringGuruExtension(state.pi);
    await state.commands.get("refactoring-guru").handler("", state.ctx);
    expect(state.launchedEntries).toHaveLength(0);
    expect(state.notifications[0]).toContain("Usage:");
  });
});

describe("role tools", () => {
  test("categorizes lexical impact across implementation, callers, tests, and contracts", async () => {
    const root = await repository();
    const state = harness(root);
    await refactoringGuruExtension(state.pi);
    const impact = await state.tools
      .get("refactoring_impact")
      .execute(
        "impact",
        { target: "src/auth.ts", symbol: "authenticate" },
        new AbortController().signal,
        undefined,
        state.ctx,
      );
    expect(impact.details.status).toBe("ok");
    expect(impact.details.targetHits[0]).toContain("src/auth.ts");
    expect(impact.details.productionHits[0]).toContain("src/caller.ts");
    expect(impact.details.testHits[0]).toContain("tests/auth.test.ts");
    expect(impact.details.contractHits[0]).toContain("types/auth.d.ts");
  });

  test("captures a passing baseline and rejects scope creep during verification", async () => {
    const root = await repository();
    const state = harness(root);
    await refactoringGuruExtension(state.pi);
    const checkpoint = state.tools.get("refactoring_checkpoint");
    const start = await checkpoint.execute(
      "start",
      {
        action: "start",
        target: "src/auth.ts",
        smell: "Long Method",
        treatment: "Extract Method",
        stopCondition: "authentication policy is named once",
        commands: [{ executable: "node", args: ["-e", "process.exit(0)"] }],
      },
      new AbortController().signal,
      undefined,
      state.ctx,
    );
    expect(start.details.status).toBe("started");

    await writeFile(
      join(root, "src", "auth.ts"),
      "export function authenticate() { const allowed = true; return allowed; }\n",
    );
    const pass = await checkpoint.execute(
      "verify",
      { action: "verify", stopEvidence: "authenticate now names its result" },
      new AbortController().signal,
      undefined,
      state.ctx,
    );
    expect(pass.details.status).toBe("pass");

    await writeFile(join(root, "outside.txt"), "scope creep\n");
    const fail = await checkpoint.execute(
      "verify",
      { action: "verify", stopEvidence: "authenticate now names its result" },
      new AbortController().signal,
      undefined,
      state.ctx,
    );
    expect(fail.details.status).toBe("fail");
    expect(fail.details.outsideAllowedPaths).toContain("outside.txt");
  });

  test("rejects arbitrary checkpoint executables and handles cancellation", async () => {
    const root = await repository();
    const state = harness(root);
    await refactoringGuruExtension(state.pi);
    const checkpoint = state.tools.get("refactoring_checkpoint");
    const invalid = await checkpoint.execute(
      "invalid",
      {
        action: "start",
        target: "src/auth.ts",
        smell: "Long Method",
        treatment: "Extract Method",
        stopCondition: "shorter method",
        commands: [{ executable: "rm", args: ["-rf", "."] }],
      },
      new AbortController().signal,
      undefined,
      state.ctx,
    );
    expect(invalid.details.status).toBe("invalid");

    const outside = await checkpoint.execute(
      "outside",
      {
        action: "start",
        target: "src/auth.ts",
        smell: "Long Method",
        treatment: "Extract Method",
        stopCondition: "shorter method",
        allowedPaths: ["../escape"],
        commands: [{ executable: "node", args: ["-e", "process.exit(0)"] }],
      },
      new AbortController().signal,
      undefined,
      state.ctx,
    );
    expect(outside.details.status).toBe("invalid");

    const failedBaseline = await checkpoint.execute(
      "failed-baseline",
      {
        action: "start",
        target: "src/auth.ts",
        smell: "Long Method",
        treatment: "Extract Method",
        stopCondition: "shorter method",
        commands: [{ executable: "node", args: ["-e", "process.exit(2)"] }],
      },
      new AbortController().signal,
      undefined,
      state.ctx,
    );
    expect(failedBaseline.details.status).toBe("baseline_failed");

    const aborted = new AbortController();
    aborted.abort();
    const cancelled = await state.tools
      .get("refactoring_impact")
      .execute(
        "cancelled",
        { target: "src/auth.ts", symbol: "authenticate" },
        aborted.signal,
        undefined,
        state.ctx,
      );
    expect(cancelled.details.status).toBe("cancelled");
  });
});
