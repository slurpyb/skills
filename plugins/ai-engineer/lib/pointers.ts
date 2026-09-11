export const LOOP = "codegraph → gather_materials → prompt_template fill → review_prompt → fanout_tasks";

export const GUIDELINES = [
	"Run AI Engineer as a loop, not four unrelated tools: codegraph understand, then gather_materials, then prompt_template fill, then review_prompt, then fanout_tasks.",
	"Use codegraph before spawning gatherers so workers inherit a map instead of guessing paths.",
	"Use gather_materials for the first fan-out (read-only recon). Do not implement during gather.",
	"Use prompt_template to fill a sealed worker packet from gathered materials. Keep SKILL.md-style surfaces short.",
	"Use review_prompt on every draft before fanout_tasks. fanout_tasks refuses unapproved prompts.",
	"When pi-lens tools are active, use symbol_search → module_report → read_symbol for deep reads after codegraph orients.",
];

export const SKILL_POINTERS = [
	"orchestration skill: skills/orchestration/SKILL.md",
	"iterative-retrieval: DISPATCH → EVALUATE → REFINE, max 3 cycles (bundled as gatherer instructions)",
	"writing-for-agents: short always-loaded surface, depth one level down in references/",
	"prompt-creation / prompt-optimization / prompt-library: template and rubric sources",
	"agent-design: fresh-eyes packets, one objective per worker",
	"octocode-subagent lobby: sealed packets, parent owns synthesis (if that plugin is installed)",
	"pi-lens: real codegraph when npm:pi-lens is enabled",
];
