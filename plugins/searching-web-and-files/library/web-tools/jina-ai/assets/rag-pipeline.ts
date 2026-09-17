/**
 * Jina RAG pipeline — search → read → rerank → Claude cited answer.
 *
 * Deterministic (you drive the steps); best precision per token. One Claude call at the end.
 *
 * Run:
 *   npm install @anthropic-ai/sdk
 *   # set JINA_API_KEY and ANTHROPIC_API_KEY (see .env.example)
 *   node --env-file=.env rag-pipeline.ts "your question"   # or: npx tsx rag-pipeline.ts "..."
 */
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-6'; // synthesis benefits from a stronger model; confirm per task
const SEARCH_N = 10;               // candidates from the SERP
const READ_TOP = 5;                // how many to actually read
const RERANK_TOP = 3;              // how many to feed Claude

const anthropic = new Anthropic();
const JH = { Authorization: `Bearer ${process.env.JINA_API_KEY}`, 'Content-Type': 'application/json' };

async function jina(url: string, init: RequestInit): Promise<any> {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`${url} → ${r.status}: ${await r.text()}`);
  return r.json();
}

async function rag(question: string): Promise<string> {
  // 1. cheap metadata-only SERP
  const hits = await jina('https://s.jina.ai/', {
    method: 'POST',
    headers: { ...JH, Accept: 'application/json', 'X-Respond-With': 'no-content' },
    body: JSON.stringify({ q: question, num: SEARCH_N }),
  });
  const urls: string[] = (hits.data ?? []).slice(0, READ_TOP).map((d: any) => d.url);
  if (!urls.length) return 'No search results.';

  // 2. read the top URLs to clean markdown (capped)
  const docs = (await Promise.all(urls.map(async (u) => {
    try {
      const d = await jina(`https://r.jina.ai/${u}`, { headers: { ...JH, Accept: 'application/json', 'X-Token-Budget': '8000' } });
      return { url: u, text: (d.data?.content ?? '') as string };
    } catch { return { url: u, text: '' }; }
  }))).filter((d) => d.text);
  if (!docs.length) return 'Could not read any sources.';

  // 3. rerank the read passages against the question, keep the best
  const rr = await jina('https://api.jina.ai/v1/rerank', {
    method: 'POST', headers: JH,
    body: JSON.stringify({ model: 'jina-reranker-v3', query: question, documents: docs.map((d) => d.text), top_n: RERANK_TOP }),
  });
  const context = rr.results
    .map((x: any, i: number) => `[${i + 1}] ${docs[x.index].url}\n${docs[x.index].text}`)
    .join('\n\n---\n\n');

  // 4. one Claude call: answer strictly from sources, with citations
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: 'Answer the question using ONLY the provided sources. Cite each claim with [n]. If the sources do not contain the answer, say so.',
    messages: [{ role: 'user', content: `Question: ${question}\n\nSources:\n${context}` }],
  });
  const t = msg.content.find((b) => b.type === 'text');
  return t?.type === 'text' ? t.text : '';
}

const question = process.argv.slice(2).join(' ') || 'What are the main differences between jina-reranker-v2 and v3?';
rag(question)
  .then((a) => console.log('\n' + a))
  .catch((err) => { console.error('RAG failed:', err); process.exit(1); });
