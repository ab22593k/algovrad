import { Component, inject } from '@angular/core';
import { GovernmentStore } from '../../core/government-store';
import { LanguageStore } from '../../core/language-store';
import { SourcePreview } from '../../core/source-preview';
import { GOV_FORMATION_DATE, GOV_DECREE_REF } from '../../core/government-data';
import { Button } from '../../shared/ui/button';
import { Chip } from '../../shared/ui/chip';

@Component({
  selector: 'app-ministers',
  imports: [Button, Chip],
  templateUrl: './ministers.html',
})
export class Ministers {
  protected readonly store = inject(GovernmentStore);
  protected readonly lang = inject(LanguageStore);
  protected readonly formationDate = GOV_FORMATION_DATE;
  protected readonly decreeRef = GOV_DECREE_REF;
  protected readonly preview = inject(SourcePreview);

  onSearch(v: string) {
    this.store.setQuery(v);
  }
}
