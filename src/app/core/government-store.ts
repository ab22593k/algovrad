import { Service, computed, inject, signal } from '@angular/core';
import { Minister, MinisterCategory } from './minister.model';
import { SEED_MINISTERS } from './government-data';
import { MINISTER_ROLE_I18N } from './i18n';
import { PUTER_MODEL, Puter } from './puter';

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
      const hay = (m.name + ' ' + m.roleFr + ' ' + (tr?.ar ?? '') + ' ' + (tr?.en ?? '')).toLowerCase();
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

  async refreshViaPuter(): Promise<void> {
    this.status.set('refreshing');
    this.note.set('Interrogation Puter AI + sources officielles…');
    try {
      const prompt = `Tu es un extracteur factuel. Donne la liste ACTUELLE du Gouvernement algérien (Premier ministre Sifi Ghrieb, décret 25-241 du 14/09/2025 et remaniements ultérieurs éventuels).
Sources à prioriser : https://www.premier-ministre.gov.dz/ , https://www.presidence.dz/ , https://www.aps.dz/.
Retourne UNIQUEMENT du JSON : [{"name":"...","roleFr":"...","category":"premier|ministre-etat|ministre|ministre-delegue|secretaire-etat|wali","isNew":false,"appointedAt":"2025-09-14","decree":"25-241"}].
Inclus toujours appointedAt (date ISO YYYY-MM-DD de nomination) et decree. Si tu n'as pas accès au web, retourne exactement : [].`;
      const raw = await this.puter.aiChat(prompt, { model: PUTER_MODEL });
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
          this.lastChecked.set(today + ' (Puter AI)');
          this.note.set(`Actualisé via Puter AI le ${today} : ${next.length} entrées avec dates. Toujours contre-vérifier sur premier-ministre.gov.dz.`);
          await this.puter.kvSet('algovrad-ministers', { at: new Date().toISOString(), count: next.length });
          return;
        }
      }
      this.status.set('seed');
      this.note.set(
        'Puter AI n’a pas retourné de JSON exploitable (modèle sans web ou hors-ligne). Seed JORADP conservé — vérifiez manuellement les 6 sources officielles ci-dessous.',
      );
    } catch (e: any) {
      this.status.set('error');
      this.note.set(`Échec Puter AI : ${e?.message ?? e}. Seed conservé. Connectez-vous à Puter (User-Pays) puis réessayez.`);
    }
  }
}
