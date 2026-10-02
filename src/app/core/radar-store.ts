import { Service, computed, inject, signal } from '@angular/core';
import { RadarItem, RadarKind } from './minister.model';
import { SEED_RADAR } from './government-data';
import { RADAR_I18N } from './i18n';
import { Puter } from './puter';

@Service()
export class RadarStore {
  private readonly puter = inject(Puter);

  readonly items = signal<RadarItem[]>(SEED_RADAR);
  readonly kindFilter = signal<'all' | RadarKind>('all');
  readonly search = signal('');
  readonly isChecking = signal(false);
  readonly lastCheck = signal<string>('2026-09-28 — seed + Conseil ministres 21/09/2026');
  readonly message = signal<string>('');
  readonly readIds = signal<string[]>([]);

  readonly kindIds = signal<Array<'all' | RadarKind>>([
    'all',
    'nomination',
    'decret',
    'conseil-ministres',
    'communique',
    'appel-offre',
  ]);

  readonly filtered = computed(() => {
    const k = this.kindFilter();
    const q = this.search().trim().toLowerCase();
    return this.items().filter((it) => {
      if (k !== 'all' && it.kind !== k) return false;
      if (!q) return true;
      const tr = RADAR_I18N[it.id];
      const hay = (it.titleFr + ' ' + it.summaryFr + ' ' + (tr?.arTitle ?? '') + ' ' + (tr?.enTitle ?? '') + ' ' + it.tags.join(' ')).toLowerCase();
      return hay.includes(q);
    });
  });

  readonly unreadCount = computed(() => this.items().filter((i) => i.isNew && !this.readIds().includes(i.id)).length);

  setKind(k: 'all' | RadarKind) {
    this.kindFilter.set(k);
  }

  setSearch(v: string) {
    this.search.set(v);
  }

  markAllRead() {
    this.readIds.set(this.items().map((i) => i.id));
    this.items.update((list) => list.map((i) => ({ ...i, isNew: false })));
  }

  async checkForUpdates(): Promise<void> {
    this.isChecking.set(true);
    this.message.set('Radar : interrogation Puter AI (présidence, APS, JORADP, ANEP)…');
    try {
      const prompt = `Radar Algérie. Liste les 5 dernières nouveautés officielles (décrets JORADP, Conseil des ministres, nominations, appels d'offres ANEP) postérieures au 21/09/2026.
Sources : presidence.dz, aps.dz, joradp.dz, anep.com.dz, premier-ministre.gov.dz.
Retourne UNIQUEMENT du JSON : [{"kind":"decret|communique|appel-offre|conseil-ministres|nomination","titleFr":"...","summaryFr":"...","source":"...","sourceUrl":"https://...","publishedAt":"2026-..-..","tags":[]}].
Sinon retourne [].`;
      const raw = await this.puter.aiChat(prompt, { model: 'gpt-5-nano' });
      const s = raw.indexOf('[');
      const e = raw.lastIndexOf(']');
      let added = 0;
      if (s >= 0 && e > s) {
        const parsed = JSON.parse(raw.slice(s, e + 1)) as Omit<RadarItem, 'id'>[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existing = new Set(this.items().map((i) => i.titleFr.toLowerCase()));
          const fresh: RadarItem[] = [];
          parsed.slice(0, 8).forEach((p, idx) => {
            if (!p.titleFr || existing.has(p.titleFr.toLowerCase())) return;
            fresh.push({
              id: `live-${Date.now()}-${idx}`,
              kind: (p.kind as RadarKind) ?? 'communique',
              titleFr: p.titleFr,
              summaryFr: p.summaryFr ?? '',
              source: p.source ?? 'Puter AI',
              sourceUrl: p.sourceUrl ?? 'https://www.aps.dz/',
              publishedAt: p.publishedAt ?? new Date().toISOString().slice(0, 10),
              tags: p.tags ?? [],
              isNew: true,
            });
          });
          if (fresh.length > 0) {
            this.items.update((list) => [...fresh, ...list].slice(0, 40));
            added = fresh.length;
          }
        }
      }
      this.lastCheck.set(new Date().toISOString().slice(0, 16).replace('T', ' ') + (added ? ` — ${added} nouveauté(s)` : ' — aucune nouveauté'));
      this.message.set(
        added > 0
          ? `${added} nouveauté(s) détectée(s) via Puter AI. Vérifiez chaque lien officiel.`
          : 'Aucune nouveauté retournée (modèle sans web ou à jour). Seed conservé. Vérifiez APS + JORADP manuellement.',
      );
      await this.puter.kvSet('algovrad-radar-check', { at: new Date().toISOString(), added });
    } catch (err: any) {
      this.message.set(`Échec radar : ${err?.message ?? err}. Astuce : connectez-vous à Puter puis réessayez.`);
    } finally {
      this.isChecking.set(false);
    }
  }
}
