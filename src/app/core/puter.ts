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
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${Puter.SDK_URL}"]`,
      );
      if (existing) {
        existing.addEventListener('load', () => this.onSdkReady().finally(() => resolve()), { once: true });
        existing.addEventListener('error', () => {
          this.lastError.set('Puter.js failed to load. Check network.');
          resolve();
        }, { once: true });
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

  async aiChat(prompt: string, opts: { model?: string; stream?: boolean } = {}): Promise<string> {
    await this.ensureLoaded();
    const puter = this.api;
    if (!puter?.ai) throw new Error('Puter AI unavailable. Vérifiez la connexion et https://js.puter.com/v2/.');
    const res = await puter.ai.chat(prompt, { model: opts.model ?? PUTER_MODEL, normalize: true });
    // Normalized + legacy shapes
    const msg = res?.message;
    if (typeof msg?.content === 'string') return msg.content;
    if (Array.isArray(msg?.content)) {
      return msg.content.map((b: any) => b?.text ?? '').join('\n');
    }
    if (typeof res === 'string') return res;
    return String(res?.text ?? res?.message?.content ?? JSON.stringify(res).slice(0, 4000));
  }

  async aiChatStream(
    messages: any[],
    onText: (delta: string) => void,
    opts: { model?: string } = {},
  ): Promise<string> {
    await this.ensureLoaded();
    const puter = this.api;
    if (!puter?.ai) throw new Error('Puter AI unavailable.');
    const resp = await puter.ai.chat(messages, { model: opts.model ?? PUTER_MODEL, stream: true });
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
