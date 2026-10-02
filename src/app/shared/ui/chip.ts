import { Component, computed, input } from '@angular/core';

/** M3 Expressive filter chip with selected state. */
@Component({
  selector: 'app-chip',
  template: `
    <button type="button" [attr.aria-pressed]="selected()" [class]="classes()">
      <ng-content />
    </button>
  `,
})
export class Chip {
  readonly selected = input<boolean>(false);
  readonly tone = input<'neutral' | 'accent'>('neutral');

  protected readonly classes = computed(() => {
    const base =
      'press inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-label-large font-medium ' +
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
    if (!this.selected()) {
      return `${base} border border-outline-variant bg-transparent text-on-surface-variant hover:bg-on-surface/6 active:scale-[0.96]`;
    }
    return this.tone() === 'accent'
      ? `${base} bg-tertiary-container text-on-tertiary-container shadow-level-1 active:scale-[0.96]`
      : `${base} bg-secondary-container text-on-secondary-container shadow-level-1 active:scale-[0.96]`;
  });
}
