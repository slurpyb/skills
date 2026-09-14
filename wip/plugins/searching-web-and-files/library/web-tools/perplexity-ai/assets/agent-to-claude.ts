/**
 * Angle B — Perplexity's Agent API routes to Claude (or any provider) with web search built in.
 *
 * One endpoint, one key (no Anthropic key needed). Swap `model` to A/B Claude vs GPT vs Gemini
 * with identical code. Returns an OpenAI-Responses object: read `output_text` + `usage.cost`.
 *
 * Run:  PERPLEXITY_API_KEY=… npx tsx agent-to-claude.ts "your question"
 * Deps: none (zero-dep fetch).
 */
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
if (!PERPLEXITY_API_KEY) throw new Error('Set PERPLEXITY_API_KEY');

const PH = { Authorization: `Bearer ${PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' };

// Pick the model deliberately — any id from GET /v1/models. Surface this choice; don't hardcode blindly.
const MODEL = process.env.PPLX_AGENT_MODEL ?? 'anthropic/claude-sonnet-4-6';

/** Aggregate assistant text from the Responses `output[]` blocks (SDKs expose this as output_text). */
function outputText(resp: any): string {
  if (typeof resp.output_text === 'string') return resp.output_text;
  return (resp.output ?? [])
    .filter((b: any) => b.type === 'message')
    .flatMap((b: any) => b.content ?? [])
    .filter((c: any) => c.type === 'output_text')
    .map((c: any) => c.text)
    .join('');
}

async function ask(input: string, model = MODEL) {
  const resp = await fetch('https://api.perplexity.ai/v1/agent', {
    method: 'POST',
    headers: PH,
    body: JSON.stringify({
      model, // or: models: ['anthropic/claude-sonnet-4-6', 'openai/gpt-5.5']  for automatic fallback
      input,
      tools: [{ type: 'web_search', search_context_size: 'medium' }],
      instructions: 'Search for current, source-grounded information before answering. Cite sources.',
    }),
  }).then((r) => r.json());

  if (resp.error) throw new Error(`${resp.error.type}: ${resp.error.message}`);
  return { model: resp.model, answer: outputText(resp), cost: resp.usage?.cost?.total_cost };
}

async function main() {
  const question = process.argv.slice(2).join(' ') || 'What is the latest Claude model, and what improved? Cite sources.';
  const { model, answer, cost } = await ask(question);
  console.log(`\n[${model}]  (cost: $${cost ?? '?'})\n`);
  console.log(answer);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
