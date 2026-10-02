import { Service, computed, inject, signal } from '@angular/core';
import { Minister, MinisterCategory } from './minister.model';
import { SEED_MINISTERS } from './government-data';
import { MINISTER_ROLE_I18N } from './i18n';
import { Puter } from './puter';

export type GovStatus = 'seed' | 'refreshing' | 'live' | 'error';

@Service()
export class GovernmentStore {
  private readonly puter = inject(Puter);

  readonly ministers = signal<Minister[]>(SEED_MINISTERS);
  readonly query = signal('');
  readonly category = signal<'all' | MinisterCategory>('all');
  readonly onlyNew = signal(false);
  readonly status = signal<GovStatus>('seed');
  readonly lastChecked = signal<string>('2026-09-28 (seed JORADP 25-241)');
  readonly note = signal<string>(
    'Données seed issues du décret 25-241 du 14/09/2025. Cliquez « Revérifier via Puter AI » pour confronter à premier-ministre.gov.dz / APS.',
  );

  readonly categoryIds = signal<Array<'all' | MinisterCategory>>([
    'all',
    'premier',
    'ministre-etat',
    'ministre',
    'ministre-delegue',
    'secretaire-etat',
    'wali',
  ]);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.category();
    const onlyNew = this.onlyNew();
    return this.ministers().filter((m) => {
      if (cat !== 'all' && m.category !== cat) return false;
      if (onlyNew && !m.isNew) return false;
      if (!q) return true;
      const tr = MINISTER_ROLE_I18N[m.id];
      const hay = (
        m.name +
        ' ' +
        m.roleFr +
        ' ' +
        (tr?.ar ?? '') +
        ' ' +
        (tr?.en ?? '')
      ).toLowerCase();
      return hay.includes(q);
    });
  });

  readonly totalCount = computed(() => this.ministers().length);
  readonly newCount = computed(() => this.ministers().filter((m) => m.isNew).length);
  readonly ministersEtatCount = computed(
    () => this.ministers().filter((m) => m.category === 'ministre-etat').length,
  );

  setQuery(v: string) {
    this.query.set(v);
  }

  setCategory(v: 'all' | MinisterCategory) {
    this.category.set(v);
  }

  toggleOnlyNew() {
    this.onlyNew.update((v) => !v);
  }

  /** Live web search via Puter.ai (OpenAI `web_search` tool). */
  readonly webSearch = signal(true);

  async refreshViaPuter(): Promise<void> {
    this.status.set('refreshing');
    const live = this.webSearch();
    this.note.set(
      live
        ? 'Puter AI + recherche web en direct sur les sources officielles…'
        : 'Puter AI sans web — seed JORADP conservé.',
    );
    try {
      const prompt = `Tu es un extracteur factuel. Donne la liste ACTUELLE du Gouvernement algérien (Premier ministre Sifi Ghrieb, décret 25-241 du 14/09/2025 et remaniements ultérieurs éventuels).
Sources à prioriser : https://premier-ministre.gov.dz/fr/gouvernement/composition , https://www.presidence.dz/ , https://www.aps.dz/fr/presidence-news .
Retourne UNIQUEMENT du JSON : [{"name":"...","roleFr":"...","category":"premier|ministre-etat|ministre|ministre-delegue|secretaire-etat|wali","isNew":false,"appointedAt":"2025-09-14","decree":"25-241"}].
Inclus toujours appointedAt (date ISO YYYY-MM-DD de nomination) et decree. N'invente rien : si tu n'as pas accès au web ou ne trouves rien de plus récent, retourne exactement : [].`;
      const { text: raw, citations } = await this.puter.aiChatDetailed(prompt, { webSearch: live });
      const jsonStart = raw.indexOf('[');
      const jsonEnd = raw.lastIndexOf(']');
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as Array<{
          name: string;
          roleFr: string;
          category: MinisterCategory;
          isNew?: boolean;
          appointedAt?: string;
          decree?: string;
        }>;
        if (Array.isArray(parsed) && parsed.length >= 10) {
          const today = new Date().toISOString().slice(0, 10);
          const next: Minister[] = parsed.slice(0, 60).map((m, i) => ({
            id: `live-${i}-${m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            name: m.name,
            roleFr: m.roleFr,
            category: m.category,
            isNew: m.isNew,
            appointedAt: m.appointedAt ?? '2025-09-14',
            decree: m.decree ?? '25-241',
          }));
          this.ministers.set(next);
          this.status.set('live');
          this.lastChecked.set(today + (live ? ' (Puter AI + web)' : ' (Puter AI)'));
          const src = citations[0] ? ` Source consultée : ${citations[0]}.` : '';
          this.note.set(
            `Actualisé via Puter AI le ${today} : ${next.length} entrées avec dates.${src} Toujours contre-vérifier sur premier-ministre.gov.dz.`,
          );
          await this.puter.kvSet('algovrad-ministers', {
            at: new Date().toISOString(),
            count: next.length,
            citations,
          });
          return;
        }
      }
      this.status.set('seed');
      this.note.set(
        live
          ? `Aucun changement renvoyé par Puter AI + web${citations.length ? ` (source : ${citations[0]})` : ''}. Seed JORADP 25-241 conservé — vérifiez manuellement les sources officielles.`
          : 'Web désactivé : Puter AI n’a rien retourné d’exploitable. Seed JORADP conservé.',
      );
    } catch (e: any) {
      this.status.set('error');
      this.note.set(
        `Échec Puter AI : ${e?.message ?? e}. Seed conservé. Connectez-vous à Puter (User-Pays) puis réessayez.`,
      );
    }
  }
}
