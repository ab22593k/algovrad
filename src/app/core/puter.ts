declare global {
  interface Window {
    puter?: any;
  }
}

/**
 * Single source of truth for the AI model used by every Puter.ai call in the
 * app (agent chat, radar scan, ministers re-check, preview translation).
 * Change it here and every call site follows.
 */
export const PUTER_MODEL = 'deepseek-v4.1-flash';

/**
 * Web search on Puter.ai is served by OpenAI models through the built-in
 * `web_search` tool (puter.ai.chat(prompt, { model, tools: [{ type:
 * 'web_search' }] })). DeepSeek-family models do not expose that tool, so
 * live lookups need this separate, OpenAI-routed model.
 */
export const PUTER_WEB_SEARCH_MODEL = 'openai/gpt-5.6-luna';

export interface AiChatOptions {
  /** Override the model entirely. */
  model?: string;
  /** Enable live web search (switches to PUTER_WEB_SEARCH_MODEL). */
  webSearch?: boolean;
  stream?: boolean;
  /**
   * Append a "Sources:" block with web-search citations.
   * Set to false when the caller parses structured output (JSON) from the text.
   */
  appendCitations?: boolean;
}

/** Silence the SDK's "Submit this app to the Puter App Store" console banner. */
function silencePuterBanner(puter: any): void {
  try {
    if (puter && puter.quiet !== true) puter.quiet = true;
  } catch {
    /* non-critical */
  }
}

import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class Puter {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly loaded = signal(false);
  readonly signedIn = signal(false);
  readonly userName = signal<string>('');
  readonly lastError = signal<string>('');

  private loadPromise: Promise<void> | null = null;
  private static readonly SDK_URL = 'https://js.puter.com/v2/';

  /**
   * Lazily injects the Puter.js SDK on first USE (sign-in, AI chat, radar
   * refresh, KV). Never call this on app startup: the SDK opens a socket.io
   * connection to api.puter.com on load, and browsers (notably Firefox) log
   * "can't establish a connection / interrupted while loading" + a benign
   * "forbidden header Origin" warning from the XHR-polling fallback whenever
   * that socket can't be established (tracking protection, adblocker, VPN,
   * offline). Lazy loading keeps plain browsing silent; failures degrade to
   * seed data via the existing fallbacks.
   */
  ensureLoaded(): Promise<void> {
    if (!this.isBrowser) return Promise.resolve();
    if (typeof window !== 'undefined' && window.puter) {
      this.loaded.set(true);
      silencePuterBanner(window.puter);
      return Promise.resolve();
    }
    if (this.loadPromise) return this.loadPromise;
    this.loadPromise = new Promise<void>((resolve) => {
      // Dedupe: a tag may already be in flight (e.g. double call race).
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${Puter.SDK_URL}"]`);
      if (existing) {
        existing.addEventListener('load', () => this.onSdkReady().finally(() => resolve()), {
          once: true,
        });
        existing.addEventListener(
          'error',
          () => {
            this.lastError.set('Puter.js failed to load. Check network.');
            resolve();
          },
          { once: true },
        );
        return;
      }
      const script = document.createElement('script');
      script.src = Puter.SDK_URL;
      script.async = true;
      script.onload = () => {
        this.onSdkReady().finally(() => resolve());
      };
      script.onerror = () => {
        this.lastError.set('Puter.js failed to load. Check network.');
        resolve();
      };
      document.head.appendChild(script);
      // Safety timeout: never block UI
      setTimeout(() => resolve(), 8000);
    });
    return this.loadPromise;
  }

  private async onSdkReady(): Promise<void> {
    this.loaded.set(true);
    silencePuterBanner(window.puter);
    await this.refreshAuthState();
  }

  get api(): any | null {
    if (!this.isBrowser || typeof window === 'undefined') return null;
    return window.puter ?? null;
  }

  async refreshAuthState(): Promise<void> {
    try {
      const puter = this.api;
      if (!puter?.auth) return;
      const yes = await puter.auth.isSignedIn();
      this.signedIn.set(!!yes);
      if (yes) {
        try {
          const u = await puter.auth.getUser();
          this.userName.set(u?.username ?? u?.email ?? 'Puter user');
        } catch {
          this.userName.set('Puter user');
        }
      } else {
        this.userName.set('');
      }
    } catch (e: any) {
      this.lastError.set(e?.message ?? 'Auth check failed');
    }
  }

  async signIn(): Promise<void> {
    await this.ensureLoaded();
    const puter = this.api;
    if (!puter) {
      this.lastError.set('Puter.js unavailable (SSR or offline).');
      return;
    }
    try {
      await puter.auth.signIn();
      await this.refreshAuthState();
    } catch (e: any) {
      this.lastError.set(e?.message ?? 'Sign-in failed');
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.api?.auth?.signOut();
    } finally {
      this.signedIn.set(false);
      this.userName.set('');
    }
  }

  /**
   * Calls puter.ai.chat. Pass `webSearch: true` to give the model live
   * internet access (OpenAI `web_search` tool). Returns plain text; web-search
   * citations are appended as a `Sources:` block unless `appendCitations: false`.
   */
  async aiChat(prompt: string, opts: AiChatOptions = {}): Promise<string> {
    const { text, citations } = await this.runChat(prompt, opts);
    if (opts.appendCitations === false || citations.length === 0) return text;
    return `${text}\n\nSources:\n${citations.map((c) => `- ${c}`).join('\n')}`;
  }

  /** Like {@link aiChat} but returns citations separately from the body text. */
  async aiChatDetailed(
    prompt: string,
    opts: AiChatOptions = {},
  ): Promise<{ text: string; citations: string[] }> {
    return this.runChat(prompt, { ...opts, appendCitations: false });
  }

  /** Single request path shared by aiChat / aiChatDetailed. */
  private async runChat(
    prompt: string,
    opts: AiChatOptions,
  ): Promise<{ text: string; citations: string[] }> {
    await this.ensureLoaded();
    const puter = this.api;
    if (!puter?.ai)
      throw new Error('Puter AI unavailable. Vérifiez la connexion et https://js.puter.com/v2/.');

    const options: Record<string, unknown> = {
      model: opts.model ?? (opts.webSearch ? PUTER_WEB_SEARCH_MODEL : PUTER_MODEL),
      normalize: true,
    };
    if (opts.webSearch) options['tools'] = [{ type: 'web_search' }];
    if (opts.stream) options['stream'] = true;

    const res = await puter.ai.chat(prompt, options);
    const msg = res?.message;
    const citations = this.extractCitations(msg);

    let text: string;
    if (typeof msg?.content === 'string') {
      text = msg.content;
    } else if (Array.isArray(msg?.content)) {
      text = msg.content.map((b: any) => (typeof b === 'string' ? b : (b?.text ?? ''))).join('\n');
    } else if (typeof res === 'string') {
      text = res;
    } else {
      text = String(res?.text ?? JSON.stringify(res).slice(0, 4000));
    }

    return { text, citations };
  }

  /**
   * Web-search citations arrive as `url_citation` / `annotations` parts, or as
   * `message.citations`. Collect whatever shape we get, de-duplicated.
   */
  private extractCitations(msg: any): string[] {
    const out: string[] = [];
    const push = (v: unknown) => {
      const url = typeof v === 'string' ? v : (v as any)?.url;
      if (typeof url === 'string' && /^https?:\/\//.test(url) && !out.includes(url)) out.push(url);
    };
    for (const key of ['citations', 'sources'] as const) {
      const arr = msg?.[key];
      if (Array.isArray(arr)) arr.forEach(push);
    }
    const content = msg?.content;
    if (Array.isArray(content)) {
      for (const block of content) {
        for (const ann of (block as any)?.annotations ?? []) push(ann);
        push((block as any)?.url_citation);
      }
    }
    return out.slice(0, 12);
  }

  /** True when Puter.ai is reachable enough to attempt a call. */
  get aiReady(): boolean {
    return !!this.api?.ai;
  }

  async aiChatStream(
    messages: any[],
    onText: (delta: string) => void,
    opts: AiChatOptions = {},
  ): Promise<string> {
    await this.ensureLoaded();
    const puter = this.api;
    if (!puter?.ai) throw new Error('Puter AI unavailable.');
    const options: Record<string, unknown> = {
      model: opts.model ?? (opts.webSearch ? PUTER_WEB_SEARCH_MODEL : PUTER_MODEL),
      stream: true,
    };
    if (opts.webSearch) options['tools'] = [{ type: 'web_search' }];
    const resp = await puter.ai.chat(messages, options as never);
    let full = '';
    for await (const part of resp) {
      const t = part?.text ?? part?.content ?? '';
      if (t) {
        full += t;
        onText(t);
      }
    }
    return full;
  }

  async kvGet(key: string): Promise<any | null> {
    try {
      await this.ensureLoaded();
      const v = await this.api?.kv?.get(key);
      return v ?? null;
    } catch {
      return null;
    }
  }

  async kvSet(key: string, value: any): Promise<void> {
    try {
      await this.ensureLoaded();
      await this.api?.kv?.set(key, value);
    } catch (e: any) {
      this.lastError.set(e?.message ?? 'KV save failed');
    }
  }

  // CORS-safe fetch via Puter (puter.net.fetch) with fallback to native fetch.
  async netFetchText(url: string): Promise<string> {
    await this.ensureLoaded();
    const puter = this.api;
    if (puter?.net?.fetch) {
      const r = await puter.net.fetch(url);
      return await r.text();
    }
    const r = await fetch(url);
    return await r.text();
  }
}
