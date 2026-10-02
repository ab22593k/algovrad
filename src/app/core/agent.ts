import { Service, inject, signal } from '@angular/core';
import { AgentMessage } from './minister.model';
import { AGENT_SYSTEM, SEED_MINISTERS, SEED_RADAR } from './government-data';
import { Puter } from './puter';
import { LanguageStore } from './language-store';
import type { Lang } from './i18n';

let msgSeq = 0;

const WELCOME: Record<Lang, string> = {
  fr: 'Salem 👋 Je suis AlgoVrad. Pose-moi : « Qui est le ministre de la Santé ? », « Résume le Conseil des ministres du 21/09/2026 », « Quels appels d’offres cette semaine ? ». Je cite toujours les sites officiels.',
  ar: 'سلام 👋 أنا AlgoVrad. اسألني : « من هو وزير الصحة ؟ »، « لخص مجلس الوزراء 21/09/2026 »، « ما مناقصات هذا الأسبوع ؟ ». أذكر المصادر الرسمية دائماً.',
  en: 'Hello 👋 I am AlgoVrad. Ask me: “Who is the Health Minister?”, “Summarize the 09/21/2026 Council of Ministers”, “Which tenders this week?”. I always cite official sites.',
};

@Service()
export class GovAgent {
  private readonly puter = inject(Puter);
  private readonly langStore = inject(LanguageStore, { optional: true });

  readonly messages = signal<AgentMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      at: new Date().toISOString(),
      text: WELCOME['fr'],
    },
  ]);
  readonly isThinking = signal(false);
  readonly error = signal('');
  readonly useLiveContext = signal(true);
  /** Live web search for time-sensitive questions (remaniements, JORADP, offres). */
  readonly webSearch = signal(false);
  private welcomedLang: Lang | null = 'fr';

  private currentLang(): Lang {
    return this.langStore?.lang() ?? 'fr';
  }

  ensureWelcomeLang(): void {
    const l = this.currentLang();
    if (
      this.welcomedLang !== l &&
      this.messages().length === 1 &&
      this.messages()[0].id === 'welcome'
    ) {
      this.messages.set([
        { id: 'welcome', role: 'assistant', at: new Date().toISOString(), text: WELCOME[l] },
      ]);
    }
    this.welcomedLang = l;
  }

  private contextBlock(): string {
    const mins = SEED_MINISTERS.map(
      (m) =>
        `- ${m.name} : ${m.roleFr} (nommé le ${m.appointedAt}, décret ${m.decree ?? '25-241'})`,
    ).join('\n');
    const radar = SEED_RADAR.map(
      (r) => `- [${r.kind}] ${r.titleFr} (publié le ${r.publishedAt}) ${r.sourceUrl}`,
    ).join('\n');
    return `CONTEXTE VÉRIFIÉ (seed JORADP 25-241 du 2025-09-14 + CM 2026-09-21) :\nMINISTRES :\n${mins}\nRADAR :\n${radar}\n`;
  }

  private localAnswer(question: string): string | null {
    const q = question.toLowerCase();
    const l = this.currentLang();
    const hit = SEED_MINISTERS.find(
      (m) =>
        q.includes(m.name.toLowerCase().split(' ')[0]) ||
        m.roleFr
          .toLowerCase()
          .split(' ')
          .some((w) => w.length > 4 && q.includes(w)),
    );
    if (q.includes('santé') || q.includes('sante') || q.includes('الصحة') || q.includes('health')) {
      const m = SEED_MINISTERS.find((x) => x.roleFr.includes('Santé'));
      if (l === 'ar')
        return `وزير الصحة (المرسوم 25-241، 14/09/2025) : **${m?.name}**. المصدر : premier-ministre.gov.dz + الجريدة الرسمية.`;
      if (l === 'en')
        return `Health Minister (decree 25-241, 09/14/2025): **${m?.name}**. Source: premier-ministre.gov.dz + JORADP.`;
      return `Ministre de la Santé (décret 25-241, 14/09/2025) : **${m?.name}**. Source : premier-ministre.gov.dz + JORADP. Cliquez « Revérifier via Puter AI » sur l’onglet Ministres pour confronter en live.`;
    }
    if (
      q.includes('premier ministre') ||
      q.includes('الوزير الأول') ||
      q.includes('prime minister') ||
      q === 'pm'
    ) {
      if (l === 'ar')
        return `الوزير الأول : **سيفي غريب** (عُيّن 14/09/2025). المصدر : APS + premier-ministre.gov.dz.`;
      if (l === 'en')
        return `Prime Minister: **Sifi Ghrieb** (appointed 09/14/2025). Source: APS + premier-ministre.gov.dz.`;
      return `Premier ministre : **Sifi Ghrieb** (nommé 14/09/2025). Source : APS + premier-ministre.gov.dz.`;
    }
    if (
      q.includes('conseil des ministres') ||
      q.includes('مجلس الوزراء') ||
      q.includes('council') ||
      q.includes('21/09')
    ) {
      if (l === 'ar')
        return `مجلس الوزراء 21/09/2026 (رئاسة تبون) : قانون الحماية المدنية، التشغيل البيني الرقمي، حصيلة الحصاد 2025-2026 + نشرة شهرية للفلاحة. المصدر : news.radioalgerie.dz/en/node/94808.`;
      if (l === 'en')
        return `Council of Ministers 09/21/2026 (Tebboune presidency): Civil Protection statute, digital interoperability, 2025-2026 harvest review + monthly Agriculture bulletin. Source: news.radioalgerie.dz/en/node/94808.`;
      return `Conseil des ministres 21/09/2026 (Présidence Tebboune) : statut Protection civile, interopérabilité numérique, bilan moisson 2025-2026 + bulletin mensuel Agriculture. Source : news.radioalgerie.dz/en/node/94808.`;
    }
    if (
      q.includes('appel') ||
      q.includes('offre') ||
      q.includes('anep') ||
      q.includes('مناقص') ||
      q.includes('tender')
    ) {
      if (l === 'ar')
        return `رادار العروض : راقب https://www.anep.com.dz/ + APS. صفِّ حسب القطاع (الري، الأشغال، الاتصالات).`;
      if (l === 'en')
        return `Tenders radar: watch https://www.anep.com.dz/ + APS. Filter by sector (hydraulics, works, telecoms).`;
      return `Radar offres : surveillez https://www.anep.com.dz/ + APS. Filtrez par secteur (hydraulique, travaux publics, télécoms). Le radar Puter (onglet Radar → Vérifier) détecte les nouveaux avis.`;
    }
    if (hit)
      return `${hit.name} — ${hit.roleFr} (nommé le ${hit.appointedAt}, décret ${hit.decree ?? '25-241'}). Source seed JORADP 25-241. À confirmer sur ${hit.ministryUrl ?? 'premier-ministre.gov.dz'}.`;
    return null;
  }

  async ask(question: string): Promise<void> {
    const q = question.trim();
    if (!q || this.isThinking()) return;
    this.error.set('');
    this.messages.update((list) => [
      ...list,
      { id: `u-${++msgSeq}`, role: 'user', text: q, at: new Date().toISOString() },
    ]);
    this.isThinking.set(true);
    const assistantId = `a-${++msgSeq}`;
    this.messages.update((list) => [
      ...list,
      { id: assistantId, role: 'assistant', text: '…', at: new Date().toISOString() },
    ]);

    try {
      const l = this.currentLang();
      const langInstruction =
        l === 'ar'
          ? 'Réponds en arabe (avec noms français entre parenthèses).'
          : l === 'en'
            ? 'Answer in English (with French names in parentheses).'
            : 'Réponds en français.';
      const web = this.webSearch();
      const webInstruction = web
        ? 'Tu as accès au web : vérifie les faits datés et cite les URL officielles consultées. Si le web contredit le contexte, le web gagne.'
        : 'Pas d’accès web : réponds uniquement à partir du contexte fourni et signale ce qui doit être vérifié.';
      const fullPrompt = `${AGENT_SYSTEM}\n${langInstruction}\n${webInstruction}\n\n${this.useLiveContext() ? this.contextBlock() : ''}\nQuestion: ${q}`;
      const answer = await this.puter.aiChat(fullPrompt, { webSearch: web });
      this.messages.update((list) =>
        list.map((m) => (m.id === assistantId ? { ...m, text: answer } : m)),
      );
    } catch (e: any) {
      const fallback = this.localAnswer(q);
      const l = this.currentLang();
      const text =
        fallback ??
        (l === 'ar'
          ? `تعذر Puter AI ‏(${e?.message ?? e}). أعمل في وضع offline : اسأل « الصحة »، « الوزير الأول »، « مجلس الوزراء »، « المناقصات ».`
          : l === 'en'
            ? `Puter AI unavailable (${e?.message ?? e}). Offline seed mode: ask “health”, “prime minister”, “council”, “tenders”.`
            : `Puter AI indisponible (${e?.message ?? e}). Je fonctionne en mode seed offline : demandez « santé », « premier ministre », « conseil des ministres », « appels d’offres ». Connectez-vous à Puter (bouton en haut) pour le live.`);
      this.messages.update((list) => list.map((m) => (m.id === assistantId ? { ...m, text } : m)));
      if (!fallback) this.error.set(e?.message ?? 'AI failed');
    } finally {
      this.isThinking.set(false);
    }
  }

  clear() {
    this.messages.set([]);
  }
}
