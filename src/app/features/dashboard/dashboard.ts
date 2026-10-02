import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovernmentStore } from '../../core/government-store';
import { RadarStore } from '../../core/radar-store';
import { LanguageStore } from '../../core/language-store';
import { SourcePreview } from '../../core/source-preview';
import {
  OFFICIAL_SOURCES,
  GOV_FORMATION_DATE,
  GOV_DECREE_REF,
  CM_LAST_DATE,
} from '../../core/government-data';
import { Button } from '../../shared/ui/button';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, Button],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly gov = inject(GovernmentStore);
  protected readonly radar = inject(RadarStore);
  protected readonly lang = inject(LanguageStore);
  protected readonly sources = OFFICIAL_SOURCES;
  protected readonly preview = inject(SourcePreview);
  protected readonly formationDate = GOV_FORMATION_DATE;
  protected readonly decreeRef = GOV_DECREE_REF;
  protected readonly lastCouncilDate = CM_LAST_DATE;
}
