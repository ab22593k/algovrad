import { Service, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'system' | 'light' | 'dark';

const KEY = 'algovrad-theme';

@Service()
export class ThemeStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly mode = signal<ThemeMode>('system');
  readonly systemPrefersDark = signal(false);

  /** Effective scheme currently applied to the document. */
  readonly resolved = computed<'light' | 'dark'>(() => {
    const mode = this.mode();
    if (mode === 'dark') return 'dark';
    if (mode === 'light') return 'light';
    return this.systemPrefersDark() ? 'dark' : 'light';
  });

  constructor() {
    if (this.isBrowser) {
      try {
        const saved = localStorage.getItem(KEY) as ThemeMode | null;
        if (saved === 'light' || saved === 'dark' || saved === 'system') this.mode.set(saved);
      } catch { /* ignore */ }
      const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
      if (mq) {
        this.systemPrefersDark.set(mq.matches);
        mq.addEventListener('change', (e) => this.systemPrefersDark.set(e.matches));
      }
    }

    effect(() => {
      const r = this.resolved();
      if (!this.isBrowser) return;
      try {
        localStorage.setItem(KEY, this.mode());
      } catch { /* ignore */ }
      const root = document.documentElement;
      root.dataset['theme'] = r;
      root.style.colorScheme = r;
    });
  }

  /** Cycles light → dark → system for a single-icon toggle. */
  toggle(): void {
    this.mode.set(this.resolved() === 'dark' ? 'light' : 'dark');
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
  }
}