import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
export type ButtonSize = 'sm' | 'md';

/**
 * M3 Expressive button. Renders a native <button> so it works in forms,
 * supports disabled/aria natively, and exposes M3 variants + spring press.
 */
@Component({
  selector: 'app-button',
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-pressed]="ariaPressed() === null ? null : ariaPressed()"
      [class]="classes()"
    >
      <ng-content />
    </button>
  `,
})
export class Button {
  readonly variant = input<ButtonVariant>('filled');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly full = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string>('');
  /** null = omit the attribute entirely (plain buttons). */
  readonly ariaPressed = input<boolean | null>(null);

  protected readonly classes = computed(() => {
    const base =
      'press inline-flex items-center justify-center gap-2 rounded-full font-medium select-none ' +
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
      'disabled:pointer-events-none disabled:opacity-45';
    const sizing =
      this.size() === 'sm'
        ? 'min-h-10 px-4 text-label-medium'
        : 'min-h-12 px-6 text-label-large';
    const width = this.full() ? 'w-full' : '';
    const variants: Record<ButtonVariant, string> = {
      filled: 'bg-primary text-on-primary shadow-level-1 hover:shadow-level-2 active:scale-[0.97]',
      tonal: 'bg-secondary-container text-on-secondary-container hover:brightness-[1.04] active:scale-[0.97]',
      elevated: 'bg-surface-container-low text-primary shadow-level-2 hover:shadow-level-3 active:scale-[0.97]',
      outlined: 'border border-outline text-primary hover:bg-primary/8 active:scale-[0.97]',
      text: 'text-primary hover:bg-primary/8 active:scale-[0.97]',
    };
    return `${base} ${sizing} ${width} ${variants[this.variant()]}`;
  });
}