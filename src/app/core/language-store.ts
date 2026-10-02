import { Service, computed, effect, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Lang, STRINGS, MINISTER_ROLE_I18N, CATEGORY_I18N, KIND_I18N, RADAR_I18N } from './i18n';
import type { Minister, OfficialSource, RadarItem } from './minister.model';

const KEY = 'algovrad-lang';

@Service()
export class LanguageStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly lang = signal<Lang>('fr');

  readonly dir = computed(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly dict = computed(() => STRINGS[this.lang()]);
  readonly isRtl = computed(() => this.lang() === 'ar');

  constructor() {
    if (this.isBrowser) {
      try {
        const saved = localStorage.getItem(KEY) as Lang | null;
        if (saved === 'fr' || saved === 'ar' || saved === 'en') this.lang.set(saved);
        else {
          const nav = navigator.language?.slice(0, 2);
          if (nav === 'ar') this.lang.set('ar');
          else if (nav === 'en') this.lang.set('en');
        }
      } catch {
        /* ignore */
      }
    }
    effect(() => {
      const l = this.lang();
      const d = l === 'ar' ? 'rtl' : 'ltr';
      if (this.isBrowser) {
        try {
          localStorage.setItem(KEY, l);
        } catch {
          /* ignore */
        }
        document.documentElement.lang = l;
        document.documentElement.dir = d;
      }
    });
  }

  setLang(l: Lang) {
    this.lang.set(l);
  }

  t(key: string): string {
    return this.dict()[key] ?? STRINGS['fr'][key] ?? key;
  }

  ministerRole(m: Minister): string {
    const l = this.lang();
    if (l === 'fr') return m.roleFr;
    const tr = MINISTER_ROLE_I18N[m.id];
    if (!tr) return m.roleFr;
    return l === 'ar' ? tr.ar : tr.en;
  }

  categoryLabel(id: string): string {
    const l = this.lang();
    const e = CATEGORY_I18N[id];
    if (!e) return id;
    return l === 'ar' ? e.ar : l === 'en' ? e.en : e.fr;
  }

  kindLabel(id: string): string {
    const l = this.lang();
    const e = KIND_I18N[id];
    if (!e) return id;
    return l === 'ar' ? e.ar : l === 'en' ? e.en : e.fr;
  }

  radarTitle(it: RadarItem): string {
    const l = this.lang();
    if (l === 'fr') return it.titleFr;
    const tr = RADAR_I18N[it.id];
    if (!tr) return it.titleFr;
    return l === 'ar' ? tr.arTitle : tr.enTitle;
  }

  radarSummary(it: RadarItem): string {
    const l = this.lang();
    if (l === 'fr') return it.summaryFr;
    const tr = RADAR_I18N[it.id];
    if (!tr) return it.summaryFr;
    return l === 'ar' ? tr.arSummary : tr.enSummary;
  }

  sourceLabel(s: OfficialSource): string {
    const l = this.lang();
    if (l === 'ar' && s.labelAr) return s.labelAr;
    if (l === 'en' && s.labelEn) return s.labelEn;
    return s.label;
  }

  sourceDescription(s: OfficialSource): string {
    const l = this.lang();
    if (l === 'ar' && s.descriptionAr) return s.descriptionAr;
    if (l === 'en' && s.descriptionEn) return s.descriptionEn;
    return s.description;
  }

  sourceWatch(s: OfficialSource): string {
    const l = this.lang();
    if (l === 'ar' && s.watchAr) return s.watchAr;
    if (l === 'en' && s.watchEn) return s.watchEn;
    return s.watch;
  }

  sourceFrequency(s: OfficialSource): string {
    const l = this.lang();
    if (l === 'ar' && s.frequencyAr) return s.frequencyAr;
    if (l === 'en' && s.frequencyEn) return s.frequencyEn;
    return s.frequency;
  }

  /** Localized date: 2025-09-14 -> 14 sept. 2025 / 14 سبتمبر 2025 / 14 Sept 2025. Falls back to raw ISO. */
  formatDate(iso: string): string {
    if (!iso) return '';
    const dateOnly = iso.slice(0, 10);
    const d = new Date(dateOnly + 'T12:00:00Z');
    if (isNaN(d.getTime())) return iso;
    const locale = this.lang() === 'ar' ? 'ar-DZ' : this.lang() === 'en' ? 'en-GB' : 'fr-FR';
    try {
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateOnly;
    }
  }
}
