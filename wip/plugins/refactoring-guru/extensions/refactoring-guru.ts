import { createHash } from "node:crypto";
import { access, readFile, realpath } from "node:fs/promises";
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";
import { fileURLToPath } from "node:url";
import {
  truncateHead,
  type ExtensionAPI,
  type ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const EXTENSION_DIR = dirname(fileURLToPath(import.meta.url));
const REFERENCE_DIR = join(
  EXTENSION_DIR,
  "..",
  "references",
  "refactoring-guru",
);
const MINI_PATH = join(REFERENCE_DIR, "refactoring-guru.mini.md");
const CATALOG_PATH = join(REFERENCE_DIR, "refactoring-guru.md");
const AGENT_STATE_ENTRY = "refactoring-guru-agent";
const CHECKPOINT_ENTRY = "refactoring-guru-checkpoint";
const STATUS_KEY = "refactoring-guru";
const ROLE_TOOL_NAMES = [
  "refactoring_catalog",
  "refactoring_impact",
  "refactoring_checkpoint",
];
const CURATED_TOOL_NAMES = [
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
  "project_report",
  "module_report",
  "read_symbol",
  "read_enclosing",
  "lens_diagnostics",
  ...ROLE_TOOL_NAMES,
];
const MANIFEST_NAMES = [
  "package.json",
  "pyproject.toml",
  "Cargo.toml",
  "go.mod",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "Gemfile",
  "Makefile",
  "justfile",
];
const SAFE_CHECK_EXECUTABLES = new Set([
  "bun",
  "cargo",
  "deno",
  "dotnet",
  "go",
  "gradle",
  "gradlew",
  "java",
  "just",
  "make",
  "mvn",
  "node",
  "npm",
  "pnpm",
  "pytest",
  "python",
  "python3",
  "swift",
  "yarn",
]);
const TEST_PATH =
  /(^|\/)(__tests__|tests?|specs?)(\/|$)|(?:\.test|\.spec|_test)\.[^/]+$/i;
const CONTRACT_PATH =
  /(^|\/)(api|contracts?|exports?|interfaces?|proto|public|schemas?|types?)(\/|\.|$)|\.(d\.ts|graphql|proto)$/i;
const STOP_WORDS = new Set(["and", "for", "from", "into", "the", "with"]);

export type CatalogMatch = { heading: string; score: number };
export type RefactoringCatalogDetails = {
  status: "ok" | "not_found" | "cancelled";
  query: string;
  matches: CatalogMatch[];
  truncated: boolean;
};
export type RefactoringImpactDetails = {
  status:
    | "ok"
    | "not_found"
    | "cancelled"
    | "not_git_repository"
    | "outside_repository";
  repositoryRoot?: string;
  target?: string;
  symbol: string;
  files: number;
  targetHits: string[];
  productionHits: string[];
  testHits: string[];
  contractHits: string[];
  recentTargetCommits: string[];
  truncated: boolean;
};

type VerificationCommand = { executable: string; args: string[] };
type CheckResult = {
  command: string;
  code: number;
  stdout: string;
  stderr: string;
};
export type RefactoringCheckpoint = {
  repositoryRoot: string;
  target: string;
  smell: string;
  treatment: string;
  stopCondition: string;
  allowedPaths: string[];
  commands: VerificationCommand[];
  baselineChecks: CheckResult[];
  baselineChangedPaths: string[];
  baselineFingerprint: string;
};
export type RefactoringCheckpointDetails = {
  status:
    | "started"
    | "baseline_failed"
    | "pass"
    | "fail"
    | "missing"
    | "cancelled"
    | "invalid";
  checkpoint?: RefactoringCheckpoint;
  checks?: CheckResult[];
  changedPaths?: string[];
  outsideAllowedPaths?: string[];
  stopEvidence?: string;
};

type CatalogSection = { heading: string; body: string };
type ExecResult = {
  stdout: string;
  stderr: string;
  code: number;
  killed?: boolean;
};
type ExecOptions = {
  cwd?: string;
  signal?: AbortSignal;
  timeout?: number;
};
type Exec = (
  command: string,
  args: string[],
  options?: ExecOptions,
) => Promise<ExecResult>;
type AgentState = { active: boolean; task?: string };

type RepositoryTarget = {
  root: string;
  absolute: string;
  relative: string;
};

function loadText(path: string, label: string): Promise<string> {
  return readFile(path, "utf8").then((content) => {
    if (!content.trim()) throw new Error(`${label} is empty: ${path}`);
    return content;
  });
}

export function parseCatalog(content: string): CatalogSection[] {
  const sections: CatalogSection[] = [];
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

function queryTerms(query: string): string[] {
  return [
    ...new Set(
      query
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((term) => term.length > 2 && !STOP_WORDS.has(term)),
    ),
  ];
}

export function searchCatalog(
  sections: CatalogSection[],
  query: string,
  limit: number,
): Array<CatalogSection & { score: number }> {
  const normalized = query.trim().toLowerCase();
  const terms = queryTerms(query);
  return sections
    .map((section) => {
      const heading = section.heading.toLowerCase();
      const body = section.body.toLowerCase();
      let score = normalized && heading.includes(normalized) ? 12 : 0;
      for (const term of terms) {
        if (heading.includes(term)) score += 5;
        if (body.includes(term)) score += 1;
      }
      return { ...section, score };
    })
    .filter((section) => section.score > 0)
    .sort((a, b) => b.score - a.score || a.heading.localeCompare(b.heading))
    .slice(0, limit);
}

function isWithin(root: string, target: string): boolean {
  const path = relative(root, target);
  return path === "" || (!path.startsWith("..") && !isAbsolute(path));
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function repositoryTarget(
  cwd: string,
  target: string,
  exec: Exec,
  signal?: AbortSignal,
): Promise<
  RepositoryTarget | "not_git_repository" | "not_found" | "outside_repository"
> {
  const rootResult = await exec("git", ["rev-parse", "--show-toplevel"], {
    cwd,
    signal,
    timeout: 5_000,
  });
  if (rootResult.code !== 0) return "not_git_repository";

  const root = await realpath(rootResult.stdout.trim());
  const requested = resolve(cwd, target.replace(/^@/, ""));
  if (!(await exists(requested))) return "not_found";
  const absolute = await realpath(requested);
  if (!isWithin(root, absolute)) return "outside_repository";
  return { root, absolute, relative: relative(root, absolute) || "." };
}

function boundedLines(text: string, maxLines: number): string[] {
  return text.split(/\r?\n/).filter(Boolean).slice(0, maxLines);
}

async function readPackageScripts(
  root: string,
  manifests: string[],
): Promise<Record<string, string[]>> {
  const scripts: Record<string, string[]> = {};
  for (const manifest of manifests.filter((path) =>
    path.endsWith("package.json"),
  )) {
    try {
      const parsed = JSON.parse(await readFile(manifest, "utf8")) as {
        scripts?: Record<string, unknown>;
      };
      const names = Object.entries(parsed.scripts ?? {})
        .flatMap(([name, value]) =>
          typeof value === "string" &&
          /test|check|lint|type|build|verify/i.test(name)
            ? [name]
            : [],
        )
        .sort((a, b) => a.localeCompare(b));
      if (names.length) scripts[relative(root, manifest)] = names;
    } catch {
      // Malformed package metadata is repository evidence, not something to guess around.
    }
  }
  return scripts;
}

async function repositorySnapshot(
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
  const manifests = (
    await Promise.all(
      MANIFEST_NAMES.map(async (name) => {
        const path = join(root, name);
        return (await exists(path)) ? path : undefined;
      }),
    )
  ).filter((path): path is string => Boolean(path));
  const [branch, head, status, files] = await Promise.all([
    exec("git", ["branch", "--show-current"], { cwd: root, timeout: 5_000 }),
    exec("git", ["rev-parse", "--short", "HEAD"], {
      cwd: root,
      timeout: 5_000,
    }),
    exec("git", ["status", "--short"], { cwd: root, timeout: 10_000 }),
    exec("git", ["ls-files"], { cwd: root, timeout: 10_000 }),
  ]);
  const trackedFiles = files.stdout.split(/\r?\n/).filter(Boolean);
  const languages: Record<string, number> = {};
  for (const file of trackedFiles) {
    const extension = extname(file).toLowerCase() || "[none]";
    languages[extension] = (languages[extension] ?? 0) + 1;
  }
  const scripts = await readPackageScripts(root, manifests);
  const instructions = contextFiles.map((path) => {
    const absolute = isAbsolute(path) ? path : resolve(cwd, path);
    return isWithin(root, absolute) ? relative(root, absolute) || "." : path;
  });
  return truncateHead(
    [
      `Repository: ${root}`,
      `Branch/HEAD: ${branch.stdout.trim() || "detached"} ${head.stdout.trim() || "unborn"}`,
      `Loaded project instructions: ${instructions.join(", ") || "none"}`,
      `Root manifests: ${manifests.map((path) => relative(root, path)).join(", ") || "none"}`,
      `Validation scripts: ${
        Object.entries(scripts)
          .map(([file, names]) => `${file} (${names.join(", ")})`)
          .join("; ") || "none detected"
      }`,
      `Tracked languages: ${
        Object.entries(languages)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([extension, count]) => `${extension}=${count}`)
          .join(", ") || "none"
      }`,
      "Git status:",
      status.stdout.trim() || "clean",
    ].join("\n"),
    { maxBytes: 12_000, maxLines: 240 },
  ).content;
}

const AGENT_PROMPT = `# Refactoring Guru agent

You are a repository-grounded refactoring specialist. Your job is to improve internal design while preserving observable behavior, public contracts, and user work.

## Responsibilities

- Classify the request as refactoring, bug fixing, feature work, or a mixture. Isolate structural work from behavior changes.
- Trace the real code path, callers, tests, contracts, construction paths, and invariants before editing.
- Name one concrete smell and its maintenance cost before selecting a treatment.
- Make the smallest coherent transformation that removes or materially reduces that smell.
- Keep the repository runnable, preserve unrelated work, verify behavior, and stop at the declared condition.

## Required workflow

1. Read the repository instructions and inspect the target implementation and callers.
2. Use refactoring_impact for a bounded lexical blast-radius scan; use semantic navigation tools too when available.
3. Use refactoring_catalog only after naming the smell or technique.
4. Before editing, call refactoring_checkpoint with action=start, a target, allowed paths, one or more safe verification commands, and a concrete stop condition. Do not edit if its baseline checks fail unless the user explicitly accepts that baseline.
5. Edit in small behavior-preserving steps. Do not mix cleanup with unrelated fixes or features.
6. Call refactoring_checkpoint with action=verify after the final edit. Do not claim behavior preservation unless it returns pass.
7. Report the smell, treatment, changed files, verification evidence, and stop condition. Report additional smells separately instead of expanding scope.

## Boundaries

- Do not introduce a pattern, hierarchy, interface, wrapper, or parameter object without a demonstrated recurring concept or client.
- Do not delete code until public, generated, reflected, serialized, plugin-facing, framework, and test-only reachability has been checked.
- Do not overwrite or revert pre-existing user changes.
- Treat catalog guidance as decision support, not permission for mechanical rewrites.`;

export function buildAgentSystemPrompt(
  basePrompt: string,
  miniRules: string,
  repository: string,
  task?: string,
): string {
  return `${AGENT_PROMPT}\n\n## Refactoring.Guru decision rules\n\n${miniRules}\n\n## Pi runtime and project policy\n\n${basePrompt}\n\n## Live repository snapshot\n\n${repository}\n\n## Assigned task\n\n${task || "Continue the active refactoring task."}`;
}

function registerCatalogTool(pi: ExtensionAPI, catalog: string): void {
  const sections = parseCatalog(catalog);
  pi.registerTool({
    name: "refactoring_catalog",
    label: "Refactoring Catalog",
    description:
      "Retrieve bounded full-reference guidance for an already diagnosed smell or named refactoring technique.",
    promptSnippet:
      "Search the full Refactoring.Guru treatment catalog after diagnosing a smell.",
    parameters: Type.Object({
      query: Type.String({
        description: "Named smell or refactoring technique",
      }),
      limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 6 })),
    }),
    async execute(_toolCallId, params, signal) {
      if (signal?.aborted) {
        const details: RefactoringCatalogDetails = {
          status: "cancelled",
          query: params.query,
          matches: [],
          truncated: false,
        };
        return {
          content: [{ type: "text", text: "Catalog lookup cancelled." }],
          details,
        };
      }
      const matches = searchCatalog(sections, params.query, params.limit ?? 3);
      if (!matches.length) {
        const details: RefactoringCatalogDetails = {
          status: "not_found",
          query: params.query,
          matches: [],
          truncated: false,
        };
        return {
          content: [
            {
              type: "text",
              text: `No catalog section matched: ${params.query}`,
            },
          ],
          details,
        };
      }
      const output = matches
        .map((match) => `## ${match.heading}\n\n${match.body}`)
        .join("\n\n---\n\n");
      const bounded = truncateHead(output, { maxBytes: 20_000, maxLines: 400 });
      const details: RefactoringCatalogDetails = {
        status: "ok",
        query: params.query,
        matches: matches.map(({ heading, score }) => ({ heading, score })),
        truncated: bounded.truncated,
      };
      return { content: [{ type: "text", text: bounded.content }], details };
    },
  });
}

function registerImpactTool(pi: ExtensionAPI): void {
  const exec = pi.exec.bind(pi) as Exec;
  pi.registerTool({
    name: "refactoring_impact",
    label: "Refactoring Impact",
    description:
      "Run a bounded read-only lexical impact scan for a symbol across tracked repository files, categorized into target, production, tests, and contract surfaces. This is evidence, not a semantic reference guarantee.",
    promptSnippet:
      "Trace a refactoring target's lexical blast radius before editing.",
    parameters: Type.Object({
      target: Type.String({
        description: "Existing file or directory being refactored",
      }),
      symbol: Type.String({ minLength: 1, maxLength: 200 }),
      limit: Type.Optional(Type.Integer({ minimum: 10, maximum: 200 })),
    }),
    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      const empty = (
        status: RefactoringImpactDetails["status"],
      ): RefactoringImpactDetails => ({
        status,
        symbol: params.symbol,
        files: 0,
        targetHits: [],
        productionHits: [],
        testHits: [],
        contractHits: [],
        recentTargetCommits: [],
        truncated: false,
      });
      if (signal?.aborted) {
        const details = empty("cancelled");
        return {
          content: [{ type: "text", text: "Impact scan cancelled." }],
          details,
        };
      }
      const target = await repositoryTarget(
        ctx.cwd,
        params.target,
        exec,
        signal,
      );
      if (typeof target === "string") {
        const details = empty(target === "not_found" ? "not_found" : target);
        return {
          content: [{ type: "text", text: `Impact scan failed: ${target}.` }],
          details,
        };
      }
      onUpdate?.({
        content: [{ type: "text", text: "Tracing lexical impact..." }],
        details: {},
      });
      const [grep, history] = await Promise.all([
        exec(
          "git",
          ["grep", "-n", "-I", "-F", "-w", "-e", params.symbol, "--"],
          {
            cwd: target.root,
            signal,
            timeout: 15_000,
          },
        ),
        exec(
          "git",
          ["log", "-n", "8", "--format=%h %s", "--", target.relative],
          {
            cwd: target.root,
            signal,
            timeout: 10_000,
          },
        ),
      ]);
      if (signal?.aborted) {
        const details = empty("cancelled");
        return {
          content: [{ type: "text", text: "Impact scan cancelled." }],
          details,
        };
      }
      const parsed = grep.stdout.split(/\r?\n/).filter(Boolean);
      const max = params.limit ?? 80;
      const lines = parsed.slice(0, max);
      const pathOf = (line: string): string =>
        line.match(/^([^:]+):\d+:/)?.[1] ?? "";
      const underTarget = (path: string): boolean =>
        target.relative === "." ||
        path === target.relative ||
        path.startsWith(`${target.relative}/`);
      const targetHits = lines.filter((line) => underTarget(pathOf(line)));
      const testHits = lines.filter((line) => TEST_PATH.test(pathOf(line)));
      const contractHits = lines.filter((line) =>
        CONTRACT_PATH.test(pathOf(line)),
      );
      const classified = new Set([...targetHits, ...testHits, ...contractHits]);
      const productionHits = lines.filter((line) => !classified.has(line));
      const details: RefactoringImpactDetails = {
        status: lines.length ? "ok" : "not_found",
        repositoryRoot: target.root,
        target: target.relative,
        symbol: params.symbol,
        files: new Set(lines.map(pathOf)).size,
        targetHits,
        productionHits,
        testHits,
        contractHits,
        recentTargetCommits: boundedLines(history.stdout, 8),
        truncated: parsed.length > max,
      };
      const render = (label: string, values: string[]): string =>
        `${label}:\n${values.map((line) => `- ${line}`).join("\n") || "- none"}`;
      return {
        content: [
          {
            type: "text",
            text: [
              `Symbol: ${params.symbol}`,
              `Target: ${target.relative}`,
              `Matched files: ${details.files}${details.truncated ? " (truncated)" : ""}`,
              render("Target", targetHits),
              render("Production dependents", productionHits),
              render("Tests", testHits),
              render("Contract surfaces", contractHits),
              render("Recent target commits", details.recentTargetCommits),
            ].join("\n\n"),
          },
        ],
        details,
      };
    },
  });
}

function commandText(command: VerificationCommand): string {
  return [command.executable, ...command.args].join(" ");
}

function validateCommands(commands: VerificationCommand[]): string | undefined {
  for (const command of commands) {
    if (!SAFE_CHECK_EXECUTABLES.has(basename(command.executable))) {
      return `Unsupported verification executable: ${command.executable}`;
    }
    if (command.args.some((arg) => arg.includes("\0")))
      return "Verification arguments cannot contain NUL bytes.";
  }
}

async function runChecks(
  commands: VerificationCommand[],
  cwd: string,
  exec: Exec,
  signal?: AbortSignal,
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  for (const command of commands) {
    if (signal?.aborted) break;
    const result = await exec(command.executable, command.args, {
      cwd,
      signal,
      timeout: 120_000,
    });
    results.push({
      command: commandText(command),
      code: result.code,
      stdout: truncateHead(result.stdout.trim(), {
        maxBytes: 4_000,
        maxLines: 80,
      }).content,
      stderr: truncateHead(result.stderr.trim(), {
        maxBytes: 4_000,
        maxLines: 80,
      }).content,
    });
  }
  return results;
}

async function changedPaths(
  root: string,
  exec: Exec,
  signal?: AbortSignal,
): Promise<string[]> {
  const [tracked, untracked] = await Promise.all([
    exec("git", ["diff", "--name-only", "HEAD"], {
      cwd: root,
      signal,
      timeout: 10_000,
    }),
    exec("git", ["ls-files", "--others", "--exclude-standard"], {
      cwd: root,
      signal,
      timeout: 10_000,
    }),
  ]);
  return [
    ...new Set([
      ...boundedLines(tracked.stdout, 2_000),
      ...boundedLines(untracked.stdout, 2_000),
    ]),
  ].sort((a, b) => a.localeCompare(b));
}

async function scopeFingerprint(
  root: string,
  paths: string[],
  exec: Exec,
  signal?: AbortSignal,
): Promise<string> {
  const [diff, status] = await Promise.all([
    exec("git", ["diff", "--no-ext-diff", "HEAD", "--", ...paths], {
      cwd: root,
      signal,
      timeout: 15_000,
    }),
    exec("git", ["status", "--porcelain=v1", "--", ...paths], {
      cwd: root,
      signal,
      timeout: 10_000,
    }),
  ]);
  return createHash("sha256")
    .update(`${diff.stdout}\n${status.stdout}`)
    .digest("hex");
}

function pathAllowed(path: string, allowed: string[]): boolean {
  return allowed.some(
    (candidate) =>
      candidate === "." ||
      path === candidate ||
      path.startsWith(`${candidate}/`),
  );
}

function latestEntry<T>(
  ctx: ExtensionContext,
  customType: string,
): T | undefined {
  let value: T | undefined;
  for (const entry of ctx.sessionManager.getBranch()) {
    if (entry.type === "custom" && entry.customType === customType)
      value = entry.data as T;
  }
  return value;
}

function registerCheckpointTool(
  pi: ExtensionAPI,
  getCheckpoint: () => RefactoringCheckpoint | undefined,
  saveCheckpoint: (checkpoint: RefactoringCheckpoint) => void,
): void {
  const exec = pi.exec.bind(pi) as Exec;
  pi.registerTool({
    name: "refactoring_checkpoint",
    label: "Refactoring Checkpoint",
    description:
      "Capture a pre-edit behavior baseline or verify the completed refactor against the same no-shell commands, allowed paths, and stop condition.",
    promptSnippet:
      "Create the behavior baseline before editing and verify it after the refactor.",
    parameters: Type.Object({
      action: Type.Union([
        Type.Literal("start"),
        Type.Literal("status"),
        Type.Literal("verify"),
      ]),
      target: Type.Optional(Type.String()),
      smell: Type.Optional(Type.String()),
      treatment: Type.Optional(Type.String()),
      stopCondition: Type.Optional(Type.String()),
      allowedPaths: Type.Optional(Type.Array(Type.String(), { maxItems: 20 })),
      commands: Type.Optional(
        Type.Array(
          Type.Object({
            executable: Type.String({ minLength: 1, maxLength: 100 }),
            args: Type.Array(Type.String({ maxLength: 500 }), { maxItems: 30 }),
          }),
          { minItems: 1, maxItems: 3 },
        ),
      ),
      stopEvidence: Type.Optional(Type.String({ maxLength: 4_000 })),
    }),
    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      if (signal?.aborted) {
        const details: RefactoringCheckpointDetails = { status: "cancelled" };
        return {
          content: [{ type: "text", text: "Checkpoint cancelled." }],
          details,
        };
      }
      if (params.action === "status") {
        const checkpoint = getCheckpoint();
        const details: RefactoringCheckpointDetails = checkpoint
          ? { status: "started", checkpoint }
          : { status: "missing" };
        return {
          content: [
            {
              type: "text",
              text: checkpoint
                ? `Checkpoint: ${checkpoint.smell} -> ${checkpoint.treatment}`
                : "No refactoring checkpoint exists.",
            },
          ],
          details,
        };
      }
      if (params.action === "start") {
        if (
          !params.target ||
          !params.smell ||
          !params.treatment ||
          !params.stopCondition ||
          !params.commands?.length
        ) {
          const details: RefactoringCheckpointDetails = { status: "invalid" };
          return {
            content: [
              {
                type: "text",
                text: "start requires target, smell, treatment, stopCondition, and at least one verification command.",
              },
            ],
            details,
          };
        }
        const commandError = validateCommands(params.commands);
        if (commandError) {
          const details: RefactoringCheckpointDetails = { status: "invalid" };
          return { content: [{ type: "text", text: commandError }], details };
        }
        const target = await repositoryTarget(
          ctx.cwd,
          params.target,
          exec,
          signal,
        );
        if (typeof target === "string") {
          const details: RefactoringCheckpointDetails = { status: "invalid" };
          return {
            content: [{ type: "text", text: `Checkpoint failed: ${target}.` }],
            details,
          };
        }
        const head = await exec("git", ["rev-parse", "--verify", "HEAD"], {
          cwd: target.root,
          signal,
          timeout: 5_000,
        });
        if (head.code !== 0) {
          const details: RefactoringCheckpointDetails = { status: "invalid" };
          return {
            content: [
              {
                type: "text",
                text: "A committed Git HEAD is required for a refactoring checkpoint.",
              },
            ],
            details,
          };
        }
        const allowedPaths: string[] = [];
        for (const path of [target.relative, ...(params.allowedPaths ?? [])]) {
          const absolute = resolve(target.root, path);
          if (!isWithin(target.root, absolute)) {
            const details: RefactoringCheckpointDetails = { status: "invalid" };
            return {
              content: [
                {
                  type: "text",
                  text: `Allowed path is outside the repository: ${path}`,
                },
              ],
              details,
            };
          }
          allowedPaths.push(relative(target.root, absolute) || ".");
        }
        onUpdate?.({
          content: [
            { type: "text", text: "Running pre-edit behavior baseline..." },
          ],
          details: {},
        });
        const [baselineChecks, baselineChangedPaths, baselineFingerprint] =
          await Promise.all([
            runChecks(params.commands, target.root, exec, signal),
            changedPaths(target.root, exec, signal),
            scopeFingerprint(target.root, allowedPaths, exec, signal),
          ]);
        if (signal?.aborted) {
          const details: RefactoringCheckpointDetails = { status: "cancelled" };
          return {
            content: [{ type: "text", text: "Checkpoint cancelled." }],
            details,
          };
        }
        const checkpoint: RefactoringCheckpoint = {
          repositoryRoot: target.root,
          target: target.relative,
          smell: params.smell,
          treatment: params.treatment,
          stopCondition: params.stopCondition,
          allowedPaths: [...new Set(allowedPaths)],
          commands: params.commands,
          baselineChecks,
          baselineChangedPaths,
          baselineFingerprint,
        };
        saveCheckpoint(checkpoint);
        const failed = baselineChecks.filter((check) => check.code !== 0);
        const details: RefactoringCheckpointDetails = {
          status: failed.length ? "baseline_failed" : "started",
          checkpoint,
          checks: baselineChecks,
        };
        return {
          content: [
            {
              type: "text",
              text: failed.length
                ? `Baseline failed: ${failed.map((check) => check.command).join(", ")}. Do not edit unless the user accepts this baseline.`
                : `Baseline passed. Treat ${checkpoint.smell} with ${checkpoint.treatment}; stop when ${checkpoint.stopCondition}`,
            },
          ],
          details,
        };
      }

      const checkpoint = getCheckpoint();
      if (!checkpoint) {
        const details: RefactoringCheckpointDetails = { status: "missing" };
        return {
          content: [{ type: "text", text: "No pre-edit checkpoint exists." }],
          details,
        };
      }
      if (!params.stopEvidence?.trim()) {
        const details: RefactoringCheckpointDetails = {
          status: "invalid",
          checkpoint,
        };
        return {
          content: [
            { type: "text", text: "verify requires concrete stopEvidence." },
          ],
          details,
        };
      }
      onUpdate?.({
        content: [{ type: "text", text: "Verifying refactoring contract..." }],
        details: {},
      });
      const [checks, currentPaths, fingerprint] = await Promise.all([
        runChecks(checkpoint.commands, checkpoint.repositoryRoot, exec, signal),
        changedPaths(checkpoint.repositoryRoot, exec, signal),
        scopeFingerprint(
          checkpoint.repositoryRoot,
          checkpoint.allowedPaths,
          exec,
          signal,
        ),
      ]);
      if (signal?.aborted) {
        const details: RefactoringCheckpointDetails = {
          status: "cancelled",
          checkpoint,
        };
        return {
          content: [{ type: "text", text: "Verification cancelled." }],
          details,
        };
      }
      const baselinePaths = new Set(checkpoint.baselineChangedPaths);
      // ponytail: pre-existing dirty paths are identity-tracked; fingerprint them too if modifying those files becomes a supported workflow.
      const outsideAllowedPaths = currentPaths.filter(
        (path) =>
          !baselinePaths.has(path) &&
          !pathAllowed(path, checkpoint.allowedPaths),
      );
      const checksPassed =
        checkpoint.baselineChecks.every((check) => check.code === 0) &&
        checks.length === checkpoint.commands.length &&
        checks.every((check) => check.code === 0);
      const scopeChanged = fingerprint !== checkpoint.baselineFingerprint;
      const passed =
        checksPassed && scopeChanged && outsideAllowedPaths.length === 0;
      const details: RefactoringCheckpointDetails = {
        status: passed ? "pass" : "fail",
        checkpoint,
        checks,
        changedPaths: currentPaths,
        outsideAllowedPaths,
        stopEvidence: params.stopEvidence.trim(),
      };
      return {
        content: [
          {
            type: "text",
            text: [
              `Verification: ${passed ? "PASS" : "FAIL"}`,
              `Checks: ${checks.map((check) => `${check.command}=${check.code}`).join(", ")}`,
              `Allowed scope changed: ${scopeChanged ? "yes" : "no"}`,
              `New paths outside scope: ${outsideAllowedPaths.join(", ") || "none"}`,
              `Stop evidence: ${params.stopEvidence.trim()}`,
            ].join("\n"),
          },
        ],
        details,
      };
    },
  });
}

function kickoff(task: string): string {
  return `Refactor this repository task using the complete Refactoring Guru workflow:\n\n${task}\n\nBegin by reading project instructions and tracing the target. Do not edit before a passing refactoring_checkpoint baseline.`;
}

export default async function refactoringGuruExtension(pi: ExtensionAPI) {
  const [miniRules, catalog] = await Promise.all([
    loadText(MINI_PATH, "Refactoring Guru mini rules"),
    loadText(CATALOG_PATH, "Refactoring Guru catalog"),
  ]);
  let agentState: AgentState = { active: false };
  let checkpoint: RefactoringCheckpoint | undefined;

  registerCatalogTool(pi, catalog);
  registerImpactTool(pi);
  registerCheckpointTool(
    pi,
    () => checkpoint,
    (next) => {
      checkpoint = next;
      pi.appendEntry(CHECKPOINT_ENTRY, next);
    },
  );

  const syncSession = (ctx: ExtensionContext): void => {
    agentState = latestEntry<AgentState>(ctx, AGENT_STATE_ENTRY) ?? {
      active: pi.getFlag("refactoring-guru") === true,
    };
    checkpoint = latestEntry<RefactoringCheckpoint>(ctx, CHECKPOINT_ENTRY);
    const active = pi
      .getActiveTools()
      .filter((name) => !ROLE_TOOL_NAMES.includes(name));
    if (agentState.active) {
      const available = new Set(pi.getAllTools().map((tool) => tool.name));
      pi.setActiveTools(
        CURATED_TOOL_NAMES.filter((name) => available.has(name)),
      );
    } else {
      pi.setActiveTools(active);
    }
    ctx.ui.setStatus(
      STATUS_KEY,
      agentState.active ? "Refactoring Guru agent" : undefined,
    );
  };

  pi.registerFlag("refactoring-guru", {
    description:
      "Run the current session as the dedicated Refactoring Guru agent",
    type: "boolean",
    default: false,
  });

  pi.registerCommand("refactoring-guru", {
    description:
      "Start a dedicated repository-grounded refactoring agent session",
    handler: async (args, ctx) => {
      const task = args.trim();
      if (!task) {
        ctx.ui.notify("Usage: /refactoring-guru <refactoring task>", "warning");
        return;
      }
      const state: AgentState = { active: true, task };
      const parentSession = ctx.sessionManager.getSessionFile();
      await ctx.waitForIdle();
      const result = await ctx.newSession({
        parentSession,
        setup: async (sessionManager) => {
          sessionManager.appendCustomEntry(AGENT_STATE_ENTRY, state);
          sessionManager.appendSessionInfo(`Refactor: ${task.slice(0, 72)}`);
        },
        withSession: async (next) => {
          await next.sendUserMessage(kickoff(task));
        },
      });
      if (result.cancelled)
        ctx.ui.notify("Refactoring agent launch cancelled.", "warning");
    },
  });

  pi.on("session_start", async (_event, ctx) => syncSession(ctx));
  pi.on("session_tree", async (_event, ctx) => syncSession(ctx));
  pi.on("before_agent_start", async (event) => {
    if (!agentState.active) return;
    const contextFiles =
      event.systemPromptOptions.contextFiles?.map((file) => file.path) ?? [];
    const repository = await repositorySnapshot(
      event.systemPromptOptions.cwd,
      contextFiles,
      pi.exec.bind(pi) as Exec,
    );
    return {
      systemPrompt: buildAgentSystemPrompt(
        event.systemPrompt,
        miniRules,
        repository,
        agentState.task,
      ),
    };
  });
}
