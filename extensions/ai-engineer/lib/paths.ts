import path from "node:path";
import { fileURLToPath } from "node:url";

export const EXT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const TEMPLATES_DIR = path.join(EXT_ROOT, "templates");
export const AGENTS_DIR = path.join(EXT_ROOT, "agents");
export const SKILLS_DIR = path.join(EXT_ROOT, "skills");
export const LIBRARY_TEMPLATES_DIR = path.join(SKILLS_DIR, "prompt-library", "templates");
export const ORCHESTRATION_SKILL = path.join(SKILLS_DIR, "orchestration", "SKILL.md");
