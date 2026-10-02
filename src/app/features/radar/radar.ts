import { Component, inject } from '@angular/core';
import { RadarStore } from '../../core/radar-store';
import { LanguageStore } from '../../core/language-store';
import { SourcePreview } from '../../core/source-preview';
import { OFFICIAL_SOURCES } from '../../core/government-data';
import { Button } from '../../shared/ui/button';
import { Chip } from '../../shared/ui/chip';

@Component({
  selector: 'app-radar',
  imports: [Button, Chip],
  templateUrl: './radar.html',
})
export class Radar {
  protected readonly store = inject(RadarStore);
  protected readonly lang = inject(LanguageStore);
  protected readonly sources = OFFICIAL_SOURCES;
  protected readonly preview = inject(SourcePreview);
}
