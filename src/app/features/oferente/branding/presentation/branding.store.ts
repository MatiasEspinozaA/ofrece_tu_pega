// Store: State management using Angular Signals for Branding
import { Injectable, signal, computed } from '@angular/core';
import { ThemeId, ThemeMode, ThemeState, FontFamily } from '../domain/entities';

const DEFAULTS: ThemeState = {
  theme: 'violet',
  mode: 'light',
  fontFamily: 'roboto',
} as const;

@Injectable()
export class BrandingStore {
  // Private state signals
  private readonly _theme = signal<ThemeId>(DEFAULTS.theme);
  private readonly _mode = signal<ThemeMode>(DEFAULTS.mode);
  private readonly _fontFamily = signal<FontFamily>(DEFAULTS.fontFamily);

  // Public readonly signals
  readonly theme = this._theme.asReadonly();
  readonly mode = this._mode.asReadonly();
  readonly fontFamily = this._fontFamily.asReadonly();

  // Computed state
  readonly state = computed<ThemeState>(() => ({
    theme: this._theme(),
    mode: this._mode(),
    fontFamily: this._fontFamily(),
  }));

  readonly isDarkMode = computed(() => this._mode() === 'dark');

  // State mutations
  setTheme(themeId: ThemeId): void {
    this._theme.set(themeId);
  }

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
  }

  toggleMode(): void {
    this.setMode(this._mode() === 'light' ? 'dark' : 'light');
  }

  setFont(fontFamily: FontFamily): void {
    this._fontFamily.set(fontFamily);
  }

  setState(state: ThemeState): void {
    this._theme.set(state.theme);
    this._mode.set(state.mode);
    this._fontFamily.set(state.fontFamily);
  }

  resetToDefaults(): void {
    this._theme.set(DEFAULTS.theme);
    this._mode.set(DEFAULTS.mode);
    this._fontFamily.set(DEFAULTS.fontFamily);
  }
}
