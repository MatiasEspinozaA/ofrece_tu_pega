// Facade: Simplifies interaction between UI and business logic
import { Injectable, effect } from '@angular/core';
import { BrandingStore } from './branding.store';
import { LoadThemePreferencesUseCase } from '../application/load-theme-preferences.use-case';
import { SaveThemePreferencesUseCase } from '../application/save-theme-preferences.use-case';
import { ApplyThemeUseCase } from '../application/apply-theme.use-case';
import { GetThemeDefinitionsUseCase } from '../application/get-theme-definitions.use-case';
import { ThemeId, ThemeMode, FontFamily, ThemeDefinition } from '../domain/entities';

// ViewModel exposes signals that can be used directly in templates
export type BrandingViewModel = {
  readonly theme: BrandingStore['theme'];
  readonly mode: BrandingStore['mode'];
  readonly fontFamily: BrandingStore['fontFamily'];
  readonly state: BrandingStore['state'];
  readonly isDarkMode: BrandingStore['isDarkMode'];
  readonly themeIds: BrandingStore['themeIds'];
  readonly themeDefinitions: BrandingStore['themeDefinitions'];
  readonly fontOptions: BrandingStore['fontOptions'];
};

@Injectable({
  providedIn: 'root', // Global service for theme management
})
export class BrandingFacade {
  // Expose a simple ViewModel for the UI
  readonly vm: BrandingViewModel;

  constructor(
    private readonly store: BrandingStore,
    private readonly loadPreferencesUseCase: LoadThemePreferencesUseCase,
    private readonly savePreferencesUseCase: SaveThemePreferencesUseCase,
    private readonly applyThemeUseCase: ApplyThemeUseCase,
    private readonly getThemeDefinitionsUseCase: GetThemeDefinitionsUseCase
  ) {
    this.vm = {
      theme: this.store.theme,
      mode: this.store.mode,
      fontFamily: this.store.fontFamily,
      state: this.store.state,
      isDarkMode: this.store.isDarkMode,
      themeIds: this.store.themeIds,
      themeDefinitions: this.store.themeDefinitions,
      fontOptions: this.store.fontOptions,
    };

    // Load theme definitions on init
    this.loadThemeDefinitions();

    // Load preferences on init
    this.loadPreferences();

    // Auto-apply and save on state changes
    effect(() => {
      const currentState = this.store.state();
      this.applyTheme();
      this.savePreferences();
    });
  }

  /**
   * Load theme definitions (themes and fonts)
   */
  private loadThemeDefinitions(): void {
    const { themes, fonts } = this.getThemeDefinitionsUseCase.execute();
    this.store.setThemeDefinitions(themes);
    this.store.setFontOptions(fonts);
  }

  /**
   * Load saved theme preferences
   */
  loadPreferences(): void {
    this.loadPreferencesUseCase.execute().subscribe({
      next: state => {
        this.store.setState(state);
      },
      error: err => {
        console.warn('Failed to load theme preferences:', err);
        this.store.resetToDefaults();
      },
    });
  }

  /**
   * Save current theme preferences
   */
  private savePreferences(): void {
    const state = this.store.state();
    this.savePreferencesUseCase.execute(state).subscribe({
      error: err => {
        console.warn('Failed to save theme preferences:', err);
      },
    });
  }

  /**
   * Apply current theme to document
   */
  applyTheme(): void {
    const state = this.store.state();
    this.applyThemeUseCase.execute(state.theme, state.mode, state.fontFamily);
  }

  /**
   * Set theme
   */
  setTheme(themeId: ThemeId): void {
    this.store.setTheme(themeId);
  }

  /**
   * Set mode
   */
  setMode(mode: ThemeMode): void {
    this.store.setMode(mode);
  }

  /**
   * Toggle between light and dark mode
   */
  toggleMode(): void {
    this.store.toggleMode();
  }

  /**
   * Set font family
   */
  setFont(fontFamily: FontFamily): void {
    this.store.setFont(fontFamily);
  }

  /**
   * Reset to default theme
   */
  resetToDefaults(): void {
    this.store.resetToDefaults();
  }

  /**
   * Get current theme ID
   */
  getTheme(): ThemeId {
    return this.store.theme();
  }

  /**
   * Get current mode
   */
  getMode(): ThemeMode {
    return this.store.mode();
  }

  /**
   * Get current font family
   */
  getFont(): FontFamily {
    return this.store.fontFamily();
  }

  /**
   * Get theme definition by ID
   */
  getThemeById(id: ThemeId): ThemeDefinition | undefined {
    return this.store.getThemeById(id);
  }
}
