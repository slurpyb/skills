/**
 * Firecrawl × Claude tool-use agent — complete multi-turn loop.
 *
 * Claude decides when to search the web and when to scrape a page. The loop runs until Claude
 * stops requesting tools (stop_reason !== 'tool_use'), then prints its final answer.
 *
 * Run:
 *   npm install firecrawl @anthropic-ai/sdk
 *   # set FIRECRAWL_API_KEY and ANTHROPIC_API_KEY (e.g. in .env, see .env.example)
 *   node --env-file=.env tool-use-agent.ts          # Node 20+ with a TS-aware runtime
 *   # or: npx tsx tool-use-agent.ts
 */
import Anthropic from '@anthropic-ai/sdk';
import { Firecrawl } from 'firecrawl';

const MODEL = 'claude-haiku-4-5';
const MAX_TURNS = 8;            // hard stop to prevent runaway loops
const MAX_TOOL_CHARS = 50_000;  // cap tool output fed back to Claude

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY
const firecrawl = new Firecrawl(); // reads FIRECRAWL_API_KEY

const tools: Anthropic.Tool[] = [
  {
    name: 'search_web',
    description: 'Search the web and return a list of relevant results (title, url, snippet). Use this to find pages before scraping them.',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string' }, limit: { type: 'number', description: 'max results, default 5' } },
      required: ['query'],
    },
  },
  {
    name: 'scrape_website',
    description: 'Scrape one URL and return its main content as markdown. Use after finding a promising URL.',
    input_schema: {
      type: 'object',
      properties: { url: { type: 'string' } },
      required: ['url'],
    },
  },
];

async function runTool(name: string, input: any): Promise<string> {
  switch (name) {
    case 'search_web': {
      const results = await firecrawl.search(input.query, { limit: input.limit ?? 5 });
      const compact = (results.web ?? []).map((r: any) => ({
        title: r.title,
        url: r.url,
        snippet: (r.description ?? r.snippet ?? '').slice(0, 300),
      }));
      return JSON.stringify(compact, null, 2);
    }
    case 'scrape_website': {
      const doc = await firecrawl.scrape(input.url, { formats: ['markdown'], onlyMainContent: true });
      return (doc.markdown ?? '').slice(0, MAX_TOOL_CHARS);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function agent(prompt: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const res = await anthropic.messages.create({ model: MODEL, max_tokens: 1024, tools, messages });
    messages.push({ role: 'assistant', content: res.content }); // preserve tool_use blocks + ids

    if (res.stop_reason !== 'tool_use') {
      const text = res.content.find((b) => b.type === 'text');
      return text?.type === 'text' ? text.text : '';
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== 'tool_use') continue;
      console.error(`→ tool: ${block.name} ${JSON.stringify(block.input)}`);
      try {
        const out = await runTool(block.name, block.input);
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: out });
      } catch (e) {
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: `Error: ${(e as Error).message}`,
          is_error: true, // surface the error so Claude can adapt
        });
      }
    }
    messages.push({ role: 'user', content: toolResults });
  }

  return `Stopped after ${MAX_TURNS} turns without a final answer.`;
}

const question = process.argv.slice(2).join(' ') || 'What is Firecrawl? Check firecrawl.dev';
agent(question)
  .then((answer) => console.log('\n' + answer))
  .catch((err) => { console.error('Agent failed:', err); process.exit(1); });
