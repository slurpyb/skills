/**
 * Firecrawl webhook receiver with HMAC-SHA256 verification.
 *
 * Verifies the X-Firecrawl-Signature header against the RAW request body, acks within 10s, then
 * processes events out of band (where you'd call Claude). Handles crawl + batch_scrape events.
 *
 * Run:
 *   npm install express firecrawl @anthropic-ai/sdk
 *   # set FIRECRAWL_WEBHOOK_SECRET (account settings → Advanced), see .env.example
 *   node --env-file=.env webhook-server.ts     # or: npx tsx webhook-server.ts
 *
 * Point a crawl/batch job's webhook.url at https://<your-host>/webhook/firecrawl
 */
import crypto from 'crypto';
import express from 'express';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const SECRET = process.env.FIRECRAWL_WEBHOOK_SECRET ?? '';

// Raw body parser ONLY for the webhook route — signature is computed over raw bytes.
app.use('/webhook/firecrawl', express.raw({ type: 'application/json' }));

function verifySignature(rawBody: Buffer, header: string | undefined): boolean {
  if (!header || !SECRET) return false;
  const [algo, hash] = header.split('=');
  if (algo !== 'sha256' || !hash) return false;
  const expected = crypto.createHmac('sha256', SECRET).update(rawBody).digest('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b); // timing-safe compare
}

// Dedupe: delivery is at-least-once. Swap this Set for Redis/DB in production.
const seen = new Set<string>();

app.post('/webhook/firecrawl', (req, res) => {
  const rawBody = req.body as Buffer;
  if (!verifySignature(rawBody, req.get('X-Firecrawl-Signature'))) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(rawBody.toString('utf8'));

  // ACK FAST — must return 2xx within 10s. Do heavy work (Claude, DB) after responding.
  res.status(200).send('ok');

  void handleEvent(event);
});

async function handleEvent(event: any): Promise<void> {
  const dedupeKey = `${event.id}:${event.type}:${event.data?.[0]?.metadata?.url ?? ''}`;
  if (seen.has(dedupeKey)) return;
  seen.add(dedupeKey);

  switch (event.type) {
    case 'crawl.page':
    case 'batch_scrape.page':
      for (const page of event.data ?? []) {
        console.log(`page: ${page.metadata?.url} (${page.markdown?.length ?? 0} chars)`);
        // → enqueue for a Claude worker: summarize/extract page.markdown, store keyed by event.id
      }
      break;
    case 'crawl.completed':
    case 'batch_scrape.completed':
      console.log(`job ${event.id} completed`);
      // → finalize: build index, notify, etc.
      break;
    case 'extract.completed':
      console.log(`extract ${event.id} done:`, event.data?.[0]?.data);
      break;
    default:
      if (event.success === false) console.error(`failure ${event.type}: ${event.error}`);
      else console.log(`event: ${event.type}`);
  }
}

app.listen(PORT, () => console.log(`Firecrawl webhook receiver on :${PORT}/webhook/firecrawl`));
