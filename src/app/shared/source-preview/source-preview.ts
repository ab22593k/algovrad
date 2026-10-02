import { Component, effect, inject } from '@angular/core';
import { SourcePreview } from '../../core/source-preview';
import { LanguageStore } from '../../core/language-store';
import { Button } from '../ui/button';

@Component({
  selector: 'app-source-preview',
  imports: [Button],
  templateUrl: './source-preview.html',
})
export class SourcePreviewDialog {
  protected readonly preview = inject(SourcePreview);
  protected readonly lang = inject(LanguageStore);

  constructor() {
    // Re-translate automatically when the user switches language with the
    // dialog open, so the preview always follows the chosen language.
    effect(() => {
      const l = this.lang.lang();
      if (this.preview.isOpen() && this.preview.status() === 'ready' && this.preview.translatedLang() !== l) {
        void this.preview.autoTranslateIfNeeded();
      }
    });
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.preview.close();
  }
}
