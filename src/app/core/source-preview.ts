import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PUTER_MODEL, Puter } from './puter';
import { LanguageStore } from './language-store';

export type PreviewStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface PreviewData {
  url: string;
  title: string;
  text: string;
  fetchedAt: string;
  cached: boolean;
}

@Service()
export class SourcePreview {
  private readonly http = inject(HttpClient);
  private readonly puter = inject(Puter);
  private readonly langStore = inject(LanguageStore, { optional: true });
  private autoDone = '';

  readonly isOpen = signal(false);
  readonly status = signal<PreviewStatus>('idle');
  readonly label = signal('');
  readonly data = signal<PreviewData | null>(null);
  readonly error = signal('');
  /** Translation of the fetched text into the chosen UI language (via Puter AI). */
  readonly translatedText = signal('');
  readonly translatedLang = signal('');
  readonly translating = signal(false);
  readonly translateError = signal('');

  /** Detected language of the fetched page text: 'ar' | 'fr' | 'en'. */
  readonly pageLang = signal<'ar' | 'fr' | 'en' | 'unknown'>('unknown');

  private detectPageLang(text: string): 'ar' | 'fr' | 'en' | 'unknown' {
    const sample = text.slice(0, 600);
    const arabic = (sample.match(/[\u0600-\u06FF\u0750-\u077F]/g) ?? []).length;
    const latin = (sample.match(/[A-Za-zÀ-ÿ]/g) ?? []).length;
    if (arabic > 10) return 'ar';
    if (latin <= 10) return 'unknown';
    return 'fr';
  }

  async open(url: string, label: string): Promise<void> {
    this.label.set(label);
    this.data.set(null);
    this.error.set('');
    this.translatedText.set('');
    this.translatedLang.set('');
    this.autoDone = '';
    this.translating.set(false);
    this.status.set('loading');
    this.isOpen.set(true);
    try {
      const data = await firstValueFrom(
        this.http.get<PreviewData>('/api/preview', { params: { url } }),
      );
      this.data.set(data);
      this.pageLang.set(this.detectPageLang(data.text));
      this.status.set('ready');
      void this.autoTranslateIfNeeded();
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Preview failed.');
      this.status.set('error');
    }
  }

  /**
   * Auto-translate when the fetched page language differs from the chosen UI
   * language. Runs once per (page, target language) pair; manual clicks can
   * still force a retranslation.
   */
  async autoTranslateIfNeeded(): Promise<void> {
    const lang = this.langStore?.lang() ?? 'fr';
    const page = this.pageLang();
    const d = this.data();
    if (!d?.text || this.translating()) return;
    if (page === 'unknown') return;
    if (page === lang) return;
    const key = `${d.url}|${lang}`;
    if (this.autoDone === key) return;
    this.autoDone = key;
    await this.translate(lang);
  }

  close(): void {
    this.isOpen.set(false);
    this.status.set('idle');
  }

  /** Translate the fetched excerpt into the chosen UI language (or `forceLang`). */
  async translate(forceLang?: 'fr' | 'ar' | 'en'): Promise<void> {
    const d = this.data();
    if (!d?.text || this.translating()) return;
    const lang = forceLang ?? this.langStore?.lang() ?? 'fr';
    this.translating.set(true);
    this.translateError.set('');
    try {
      const target = lang === 'ar' ? 'Arabic' : lang === 'en' ? 'English' : 'French';
      const out = await this.puter.aiChat(
        `Translate the following official-page excerpt into ${target}. Preserve facts, dates, numbers, acronyms and URLs exactly. Keep the layout readable. Return ONLY the translation, no commentary:\n\n${d.text.slice(0, 3000)}`,
        { model: PUTER_MODEL },
      );
      this.translatedText.set(out);
      this.translatedLang.set(lang);
    } catch (e) {
      this.translateError.set(e instanceof Error ? e.message : 'Translation failed.');
    } finally {
      this.translating.set(false);
    }
  }
}
