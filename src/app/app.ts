import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Puter } from './core/puter';
import { RadarStore } from './core/radar-store';
import { LanguageStore } from './core/language-store';
import { ThemeStore } from './core/theme-store';
import { LANGS, Lang } from './core/i18n';
import { SourcePreviewDialog } from './shared/source-preview/source-preview';
import { Button } from './shared/ui/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SourcePreviewDialog, Button],
  templateUrl: './app.html',
})
export class App {
  protected readonly puter = inject(Puter);
  protected readonly radar = inject(RadarStore);
  protected readonly lang = inject(LanguageStore);
  protected readonly theme = inject(ThemeStore);
  protected readonly langs = LANGS;

  // NOTE: no eager puter.ensureLoaded() here. Puter.js (and its socket.io
  // connection to api.puter.com) loads lazily on first user action that needs
  // it, so plain browsing never triggers websocket console noise.

  toggleAuth(): void {
    if (this.puter.signedIn()) void this.puter.signOut();
    else void this.puter.signIn();
  }

  setLang(l: Lang): void {
    this.lang.setLang(l);
  }
}
