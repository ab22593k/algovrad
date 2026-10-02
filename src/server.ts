import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import {
  AGENT_SYSTEM,
  CM_LAST_DATE,
  GOV_DECREE_REF,
  GOV_FORMATION_DATE,
  OFFICIAL_SOURCES,
  SEED_MINISTERS,
  SEED_RADAR,
} from './app/core/government-data';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

/**
 * Single-source-of-truth API bridge.
 * Serves the SAME seed modules the Angular stores use (government-data.ts),
 * so external agents (e.g. a DeepSeek-Harness plugin or any HTTP client)
 * read identical ministers / radar / sources data — no duplicated lists.
 * Puter.js (AI, KV, FS, User-Pays auth) stays client-side in the browser;
 * dsh calls these endpoints, then uses puter.ai.chat for live re-verification.
 */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'algovrad', runtime: 'bun', time: new Date().toISOString() });
});

app.get('/api/ministers', (_req, res) => {
  res.json({
    formationDate: GOV_FORMATION_DATE,
    decreeRef: GOV_DECREE_REF,
    count: SEED_MINISTERS.length,
    ministers: SEED_MINISTERS,
  });
});

app.get('/api/radar', (_req, res) => {
  res.json({ lastCouncilDate: CM_LAST_DATE, count: SEED_RADAR.length, items: SEED_RADAR });
});

app.get('/api/sources', (_req, res) => {
  res.json({ count: OFFICIAL_SOURCES.length, sources: OFFICIAL_SOURCES });
});

app.get('/api/agent-system', (_req, res) => {
  res.json({ system: AGENT_SYSTEM });
});

/** Hostnames users may preview in-app — monitored sources + ministry sites. */
const PREVIEW_HOSTS = new Set<string>();
for (const u of [
  ...OFFICIAL_SOURCES.flatMap((s) => [s.url, ...(s.keyPages ?? [])]),
  ...SEED_MINISTERS.map((m) => m.ministryUrl).filter((u): u is string => !!u),
]) {
  try {
    PREVIEW_HOSTS.add(new URL(u).hostname.toLowerCase());
  } catch {
    /* ignore malformed seed URL */
  }
}

interface PreviewCacheEntry {
  at: number;
  body: unknown;
}
const previewCache = new Map<string, PreviewCacheEntry>();
const PREVIEW_TTL_MS = 10 * 60 * 1000;

function decodeEntities(s: string): string {
  const entities: Record<string, string> = {
    nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'",
    eacute: 'é', egrave: 'è', ecirc: 'ê', euml: 'ë',
    agrave: 'à', acirc: 'â', ccedil: 'ç', icirc: 'î', ocirc: 'ô',
    ucirc: 'û', ugrave: 'ù', laquo: '«', raquo: '»',
    rsquo: '’', lsquo: '‘', ndash: '–', mdash: '—', hellip: '…',
  };
  return s.replace(/&([a-zA-Z#0-9]+);/g, (m, name: string) => entities[name] ?? ' ');
}

function extractPreview(html: string): { title: string; text: string } {
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]{0,300})<\/title>/i)?.[1] ?? '').trim();
  const noScripts = html
    .replace(/<script[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style\s*>/gi, ' ');
  const text = decodeEntities(noScripts)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000);
  return { title, text };
}

/**
 * GET /api/preview?url=<absolute-url>
 * Fetches an allowlisted official page server-side (no browser CORS wall)
 * and returns readable text, so users preview sources INSIDE the app
 * instead of jumping blindly to external pages.
 */
app.get('/api/preview', async (req, res) => {
  const raw = typeof req.query['url'] === 'string' ? req.query['url'] : '';
  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    res.status(400).json({ error: 'Missing or invalid ?url=' });
    return;
  }
  if (target.protocol !== 'https:' && target.protocol !== 'http:') {
    res.status(400).json({ error: 'Only http(s) URLs may be previewed.' });
    return;
  }
  if (!PREVIEW_HOSTS.has(target.hostname.toLowerCase())) {
    res.status(403).json({ error: 'URL host is not a monitored official source.' });
    return;
  }
  const key = target.href;
  const hit = previewCache.get(key);
  if (hit && Date.now() - hit.at < PREVIEW_TTL_MS) {
    res.json({ ...(hit.body as object), cached: true });
    return;
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const upstream = await fetch(target.href, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'AlgoVrad-preview/1.0 (+https://developer.puter.com)' },
    });
    clearTimeout(timer);
    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream responded ${upstream.status}.` });
      return;
    }
    const html = await upstream.text();
    const { title, text } = extractPreview(html);
    const body = { url: target.href, title, text, fetchedAt: new Date().toISOString(), cached: false };
    previewCache.set(key, { at: Date.now(), body });
    res.json(body);
  } catch (e) {
    res.status(504).json({ error: e instanceof Error ? e.message : 'Fetch failed.' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Bun Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
