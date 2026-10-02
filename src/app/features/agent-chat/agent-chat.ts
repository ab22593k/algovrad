import { Component, inject, signal, effect } from '@angular/core';
import { form, FormField, required, minLength, submit } from '@angular/forms/signals';
import { GovAgent } from '../../core/agent';
import { Puter } from '../../core/puter';
import { LanguageStore } from '../../core/language-store';

@Component({
  selector: 'app-agent-chat',
  imports: [FormField],
  templateUrl: './agent-chat.html',
})
export class AgentChat {
  protected readonly agent = inject(GovAgent);
  protected readonly puter = inject(Puter);
  protected readonly lang = inject(LanguageStore);

  protected readonly model = signal({ question: '' });

  protected readonly chatForm = form(this.model, (s) => {
    required(s.question, { message: 'Écrivez une question.' });
    minLength(s.question, 3, { message: '3 caractères minimum.' });
  });

  constructor() {
    effect(() => {
      // Refresh welcome message when language changes
      this.lang.lang();
      this.agent.ensureWelcomeLang();
    });
  }

  protected send() {
    submit(this.chatForm, async () => {
      const q = this.model().question;
      this.model.update((m) => ({ ...m, question: '' }));
      await this.agent.ask(q);
    });
  }

  protected askExample(q: string) {
    this.agent.ask(q);
  }

  protected exampleQuestions(): string[] {
    const l = this.lang.lang();
    if (l === 'ar')
      return [
        'من هو وزير الصحة ؟',
        'لخص مجلس الوزراء 21/09/2026',
        'ما مناقصات هذا الأسبوع ؟',
        'هل كان هناك تعديل حكومي بعد 14/09/2025 ؟',
      ];
    if (l === 'en')
      return [
        'Who is the Health Minister?',
        'Summarize the 09/21/2026 Council of Ministers',
        'Which tenders to watch this week?',
        'Was there a reshuffle after 09/14/2025?',
      ];
    return [
      'Qui est le ministre de la Santé ?',
      'Résume le Conseil des ministres du 21/09/2026',
      'Quels appels d’offres surveiller cette semaine ?',
      'Y a-t-il eu un remaniement après le 14/09/2025 ?',
    ];
  }
}
