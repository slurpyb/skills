/**
 * Angle A — Claude (Anthropic SDK) calls Perplexity as tools.
 *
 * Claude drives a multi-turn tool-use loop with two tools:
 *   - perplexity_search → Search API (/search): raw ranked results
 *   - perplexity_ask    → Sonar (/chat/completions): a cited, web-grounded answer
 *
 * Run:  PERPLEXITY_API_KEY=… ANTHROPIC_API_KEY=… npx tsx perplexity-claude-agent.ts "your question"
 * Deps: npm i @anthropic-ai/sdk   (Perplexity called via fetch — zero extra deps)
 */
import Anthropic from '@anthropic-ai/sdk';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
if (!PERPLEXITY_API_KEY) throw new Error('Set PERPLEXITY_API_KEY');

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY
const MODEL = 'claude-haiku-4-5'; // surface the choice; escalate to sonnet/opus for hard synthesis
const MAX_TURNS = 6;
const PH = { Authorization: `Bearer ${PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' };

const tools: Anthropic.Tool[] = [
  {
    name: 'perplexity_search',
    description: 'Search the live web. Returns ranked results with title, url, and snippet. Use when you want sources to read or cite yourself.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        max_results: { type: 'integer', description: '1-20, default 5' },
        recency: { type: 'string', enum: ['day', 'week', 'month', 'year'] },
      },
      required: ['query'],
    },
  },
  {
    name: 'perplexity_ask',
    description: 'Ask Perplexity Sonar for a synthesized, web-grounded answer with citations. Use for a quick grounded summary rather than raw links.',
    input_schema: {
      type: 'object',
      properties: { question: { type: 'string' } },
      required: ['question'],
    },
  },
];

async function runTool(name: string, input: any): Promise<string> {
  if (name === 'perplexity_search') {
    const r = await fetch('https://api.perplexity.ai/search', {
      method: 'POST',
      headers: PH,
      body: JSON.stringify({
        query: input.query,
        max_results: input.max_results ?? 5,
        ...(input.recency ? { search_recency_filter: input.recency } : {}),
      }),
    }).then((r) => r.json());
    // Return compact JSON — titles + urls + short snippets, not full pages.
    return JSON.stringify(
      (r.results ?? []).map((d: any) => ({ title: d.title, url: d.url, snippet: (d.snippet ?? '').slice(0, 300) })),
    );
  }
  if (name === 'perplexity_ask') {
    const r = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: PH,
      body: JSON.stringify({ model: 'sonar', messages: [{ role: 'user', content: input.question }] }),
    }).then((r) => r.json());
    return JSON.stringify({ answer: r.choices?.[0]?.message?.content, sources: r.search_results });
  }
  throw new Error(`unknown tool: ${name}`);
}

const textOf = (m: Anthropic.Message) =>
  m.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('');

async function main() {
  const question = process.argv.slice(2).join(' ') || 'What is the latest Claude model, and what improved? Cite sources.';
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: question }];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const res = await anthropic.messages.create({ model: MODEL, max_tokens: 1024, tools, messages });
    messages.push({ role: 'assistant', content: res.content }); // push assistant turn WITH its blocks

    if (res.stop_reason !== 'tool_use') {
      console.log('\n' + textOf(res));
      return;
    }

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== 'tool_use') continue;
      process.stderr.write(`  → ${block.name}(${JSON.stringify(block.input)})\n`);
      try {
        results.push({ type: 'tool_result', tool_use_id: block.id, content: await runTool(block.name, block.input) });
      } catch (e) {
        results.push({ type: 'tool_result', tool_use_id: block.id, content: String(e), is_error: true });
      }
    }
    messages.push({ role: 'user', content: results }); // every tool_use → matching tool_result
  }
  console.error(`Stopped after ${MAX_TURNS} turns without a final answer.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
