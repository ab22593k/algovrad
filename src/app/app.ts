import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Puter } from './core/puter';
import { RadarStore } from './core/radar-store';
import { LanguageStore } from './core/language-store';
import { LANGS, Lang } from './core/i18n';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly puter = inject(Puter);
  protected readonly radar = inject(RadarStore);
  protected readonly lang = inject(LanguageStore);
  protected readonly langs = LANGS;

  ngOnInit(): void {
    void this.puter.ensureLoaded();
  }

  toggleAuth(): void {
    if (this.puter.signedIn()) void this.puter.signOut();
    else void this.puter.signIn();
  }

  setLang(l: Lang): void {
    this.lang.setLang(l);
  }
}
