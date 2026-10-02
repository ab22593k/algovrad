import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovernmentStore } from '../../core/government-store';
import { RadarStore } from '../../core/radar-store';
import { LanguageStore } from '../../core/language-store';
import { OFFICIAL_SOURCES, GOV_FORMATION_DATE, GOV_DECREE_REF, CM_LAST_DATE } from '../../core/government-data';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly gov = inject(GovernmentStore);
  protected readonly radar = inject(RadarStore);
  protected readonly lang = inject(LanguageStore);
  protected readonly sources = OFFICIAL_SOURCES;
  protected readonly formationDate = GOV_FORMATION_DATE;
  protected readonly decreeRef = GOV_DECREE_REF;
  protected readonly lastCouncilDate = CM_LAST_DATE;
}
