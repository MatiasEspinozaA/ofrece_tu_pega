// Domain ports - Interfaces that define contracts with external layers
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeId, ThemeMode, ThemeState, FontFamily, ThemeDefinition, FontOption } from './entities';

/**
 * Repository for theme preferences persistence
 */
export interface IThemePreferencesRepository {
  loadPreferences(): Observable<ThemeState>;
  savePreferences(state: ThemeState): Observable<void>;
}

/**
 * Service for applying theme to the DOM
 */
export interface IThemeApplicator {
  applyTheme(themeId: ThemeId, mode: ThemeMode): void;
  applyFont(fontFamily: FontFamily): void;
}

/**
 * Repository for theme definitions
 */
export interface IThemeDefinitionsRepository {
  getAllThemes(): ThemeDefinition[];
  getThemeById(id: ThemeId): ThemeDefinition | undefined;
  getAllFonts(): readonly FontOption[];
}

export const THEME_PREFERENCES_REPOSITORY = new InjectionToken<IThemePreferencesRepository>(
  'IThemePreferencesRepository'
);

export const THEME_APPLICATOR = new InjectionToken<IThemeApplicator>(
  'IThemeApplicator'
);

export const THEME_DEFINITIONS_REPOSITORY = new InjectionToken<IThemeDefinitionsRepository>(
  'IThemeDefinitionsRepository'
);
