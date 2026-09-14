/**
 * Jina × Claude research agent — complete multi-turn tool-use loop.
 *
 * Claude decides when to search the web (s.jina.ai) and when to read a URL (r.jina.ai). Loops until
 * it stops requesting tools, then prints the final answer.
 *
 * Run:
 *   npm install @anthropic-ai/sdk
 *   # set JINA_API_KEY and ANTHROPIC_API_KEY (see .env.example)
 *   node --env-file=.env jina-claude-agent.ts "your question"   # or: npx tsx jina-claude-agent.ts "..."
 */
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-4-5';   // confirm per task; escalate synthesis to claude-sonnet-4-6
const MAX_TURNS = 8;
const READ_BUDGET = '50000';        // X-Token-Budget per page

const anthropic = new Anthropic(); // ANTHROPIC_API_KEY
const JH = { Authorization: `Bearer ${process.env.JINA_API_KEY}` };

const tools: Anthropic.Tool[] = [
  {
    name: 'search_web',
    description: 'Search the web; returns a JSON list of {title, url, snippet}. Use to find pages before reading them.',
    input_schema: { type: 'object', properties: { query: { type: 'string' }, num: { type: 'number' } }, required: ['query'] },
  },
  {
    name: 'read_url',
    description: 'Read one URL and return its main content as clean markdown. Use after finding a promising URL.',
    input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
  },
];

async function runTool(name: string, input: any): Promise<string> {
  if (name === 'search_web') {
    const r = await fetch('https://s.jina.ai/', {
      method: 'POST',
      headers: { ...JH, 'Content-Type': 'application/json', Accept: 'application/json', 'X-Respond-With': 'no-content' },
      body: JSON.stringify({ q: input.query, num: input.num ?? 5 }),
    });
    if (!r.ok) throw new Error(`search ${r.status}: ${await r.text()}`);
    const j = await r.json();
    return JSON.stringify((j.data ?? []).map((d: any) => ({ title: d.title, url: d.url, snippet: d.description })));
  }
  if (name === 'read_url') {
    const r = await fetch(`https://r.jina.ai/${input.url}`, {
      headers: { ...JH, Accept: 'application/json', 'X-Token-Budget': READ_BUDGET },
    });
    if (!r.ok) throw new Error(`read ${r.status}: ${await r.text()}`);
    const j = await r.json();
    return (j.data?.content ?? '').slice(0, 50_000);
  }
  throw new Error(`Unknown tool: ${name}`);
}

async function agent(prompt: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const res = await anthropic.messages.create({ model: MODEL, max_tokens: 1024, tools, messages });
    messages.push({ role: 'assistant', content: res.content }); // preserve tool_use blocks + ids

    if (res.stop_reason !== 'tool_use') {
      const t = res.content.find((b) => b.type === 'text');
      return t?.type === 'text' ? t.text : '';
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== 'tool_use') continue;
      console.error(`→ ${block.name} ${JSON.stringify(block.input)}`);
      try {
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: await runTool(block.name, block.input) });
      } catch (e) {
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: `Error: ${(e as Error).message}`, is_error: true });
      }
    }
    messages.push({ role: 'user', content: toolResults });
  }
  return `Stopped after ${MAX_TURNS} turns without a final answer.`;
}

const question = process.argv.slice(2).join(' ') || 'What is the latest Jina reranker model and what changed?';
agent(question)
  .then((a) => console.log('\n' + a))
  .catch((err) => { console.error('Agent failed:', err); process.exit(1); });
