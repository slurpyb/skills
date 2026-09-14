/**
 * Deterministic RAG — Perplexity Search API → Claude cited answer.
 *
 * You drive the pipeline (best precision per token): search the web for raw results, build a numbered
 * context block, then a single Claude call that answers using ONLY those sources with [n] citations.
 *
 * Run:  PERPLEXITY_API_KEY=… ANTHROPIC_API_KEY=… npx tsx sonar-rag.ts "your question"
 * Deps: npm i @anthropic-ai/sdk   (Perplexity called via fetch)
 */
import Anthropic from '@anthropic-ai/sdk';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
if (!PERPLEXITY_API_KEY) throw new Error('Set PERPLEXITY_API_KEY');

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY
const MODEL = 'claude-haiku-4-5'; // escalate to claude-sonnet-4-6 for harder synthesis
const PH = { Authorization: `Bearer ${PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' };

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  date?: string;
}

async function search(query: string, maxResults = 8): Promise<SearchResult[]> {
  const r = await fetch('https://api.perplexity.ai/search', {
    method: 'POST',
    headers: PH,
    body: JSON.stringify({ query, max_results: maxResults, max_tokens_per_page: 1024 }),
  }).then((r) => r.json());
  if (r.error) throw new Error(`${r.error.type}: ${r.error.message}`);
  return r.results ?? [];
}

async function answer(question: string): Promise<string> {
  const results = await search(question);
  if (results.length === 0) return 'No search results found.';

  const context = results
    .map((d, i) => `[${i + 1}] ${d.title}\n${d.url}\n${d.snippet.slice(0, 1500)}`)
    .join('\n\n');

  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 900,
    system: 'Answer the question using ONLY the numbered sources. Cite claims with [n]. If the sources do not answer it, say so.',
    messages: [{ role: 'user', content: `Sources:\n${context}\n\nQuestion: ${question}` }],
  });

  const text = res.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('');
  const refs = results.map((d, i) => `[${i + 1}] ${d.url}`).join('\n');
  return `${text}\n\nSources:\n${refs}`;
}

async function main() {
  const question = process.argv.slice(2).join(' ') || 'What are the newest features in the latest Claude model?';
  console.log(await answer(question));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
