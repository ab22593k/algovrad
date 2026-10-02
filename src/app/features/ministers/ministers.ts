import { Component, inject } from '@angular/core';
import { GovernmentStore } from '../../core/government-store';
import { LanguageStore } from '../../core/language-store';
import { GOV_FORMATION_DATE, GOV_DECREE_REF } from '../../core/government-data';

@Component({
  selector: 'app-ministers',
  templateUrl: './ministers.html',
})
export class Ministers {
  protected readonly store = inject(GovernmentStore);
  protected readonly lang = inject(LanguageStore);
  protected readonly formationDate = GOV_FORMATION_DATE;
  protected readonly decreeRef = GOV_DECREE_REF;

  onSearch(v: string) {
    this.store.setQuery(v);
  }
}
