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

  /** Live web search via Puter.ai (OpenAI `web_search` tool). */
  readonly webSearch = signal(true);

  readonly kindIds = signal<Array<'all' | RadarKind>>([
    'all',
    'nomination',
    'decret',
    'conseil-ministres',
    'communique',
    'appel-offre',
    'attribution',
    'infructuosite',
    'annulation',
    'mise-en-demeure',
    'prorogation',
  ]);

  /** Business filter: only notices that free/re-open a public contract. */
  readonly opportunityOnly = signal(false);

  /** Count of live commercial opportunities across all filters. */
  readonly opportunityCount = computed(() => this.items().filter((i) => i.opportunity).length);

  readonly filtered = computed(() => {
    const k = this.kindFilter();
    const q = this.search().trim().toLowerCase();
    const onlyOpp = this.opportunityOnly();
    return this.items().filter((it) => {
      if (k !== 'all' && it.kind !== k) return false;
      if (onlyOpp && !it.opportunity) return false;
      if (!q) return true;
      const tr = RADAR_I18N[it.id];
      const hay = (
        it.titleFr +
        ' ' +
        it.summaryFr +
        ' ' +
        (tr?.arTitle ?? '') +
        ' ' +
        (tr?.enTitle ?? '') +
        ' ' +
        it.tags.join(' ') +
        ' ' +
        (it.client ?? '') +
        ' ' +
        (it.ref ?? '')
      ).toLowerCase();
      return hay.includes(q);
    });
  });

  toggleOpportunities(): void {
    this.opportunityOnly.update((v) => !v);
  }

  readonly unreadCount = computed(
    () => this.items().filter((i) => i.isNew && !this.readIds().includes(i.id)).length,
  );

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
    const live = this.webSearch();
    this.message.set(
      live
        ? 'Radar : Puter AI + recherche web en direct (présidence, APS, JORADP, ANEP)…'
        : 'Radar : Puter AI sans web (sources ci-dessous uniquement)…',
    );
    try {
      const prompt = `Radar Algérie. Liste les 8 dernières nouveautés officielles postérieures au 21/09/2026 :
1) décrets, lois et règlements sectoriels (environnement, santé, agriculture, industrie pharmaceutique) ;
2) nominations et communiqués du Conseil des ministres ;
3) cycle de vie des marchés publics : appels d'offres, consultations, attributions provisoires, infructuosités, annulations d'attribution, mises en demeure, prorogations de délai.
Sources prioritaires : joradp.dz, miph.gov.dz/fr/textes-juridiques/decrets/, me.gov.dz/fr/reglementation/, presidence.dz, aps.dz/fr, premier-ministre.gov.dz, marches-publics.gov.dz/fr/trends, bomop.anep.dz, algerie54.dz/anep, casbahtribune.dz/anep/, safqatic.dz, bereg.dz, mf.gov.dz.
Règle : mets "opportunity":true pour tout avis qui libère ou rouvre une opportunity (infructuosité, annulation d'attribution, prorogation, 2ème avis, mise en demeure par risque de résiliation).
Retourne UNIQUEMENT du JSON : [{"kind":"decret|communique|appel-offre|conseil-ministres|nomination|attribution|infructuosite|annulation|mise-en-demeure|prorogation","titleFr":"...","summaryFr":"...","source":"...","sourceUrl":"https://...","publishedAt":"2026-..-..","ref":"...","client":"...","opportunity":false,"tags":[]}].
Sinon retourne [].`;
      const { text: raw, citations } = await this.puter.aiChatDetailed(prompt, { webSearch: live });
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
              ref: p.ref,
              client: p.client,
              opportunity: p.opportunity,
              isNew: true,
            });
          });
          if (fresh.length > 0) {
            this.items.update((list) => [...fresh, ...list].slice(0, 40));
            added = fresh.length;
          }
        }
      }
      this.lastCheck.set(
        new Date().toISOString().slice(0, 16).replace('T', ' ') +
          (added ? ` — ${added} nouveauté(s)` : ' — aucune nouveauté'),
      );
      const cited = citations.slice(0, 5);
      this.message.set(
        added > 0
          ? `${added} nouveauté(s) détectée(s) via Puter AI${live ? ' + web' : ''}. Vérifiez chaque lien officiel.`
          : live
            ? `Aucune nouveauté au-delà du seed${cited.length ? ` (${cited.length} source(s) web consultée(s) : ${cited[0]})` : ''}. Vérifiez APS + JORADP.`
            : 'Web désactivé : scan limité au seed. Activez 🌐 Web ON pour une recherche en direct.',
      );
      await this.puter.kvSet('algovrad-radar-check', {
        at: new Date().toISOString(),
        added,
        citations,
      });
    } catch (err: any) {
      this.message.set(
        `Échec radar : ${err?.message ?? err}. Astuce : connectez-vous à Puter puis réessayez.`,
      );
    } finally {
      this.isChecking.set(false);
    }
  }
}
