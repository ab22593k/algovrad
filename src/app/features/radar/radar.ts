import { Component, inject } from '@angular/core';
import { RadarStore } from '../../core/radar-store';
import { LanguageStore } from '../../core/language-store';
import { OFFICIAL_SOURCES } from '../../core/government-data';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.html',
})
export class Radar {
  protected readonly store = inject(RadarStore);
  protected readonly lang = inject(LanguageStore);
  protected readonly sources = OFFICIAL_SOURCES;
}
