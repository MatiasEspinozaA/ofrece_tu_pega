// Infrastructure: LocalStorage implementation for theme preferences
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IThemePreferencesRepository } from '../domain/ports';
import { ThemeState, ThemeId, ThemeMode, FontFamily } from '../domain/entities';

const STORAGE_KEYS = {
  THEME: 'app.theme',
  MODE: 'app.mode',
  FONT: 'app.font',
} as const;

const DEFAULTS: ThemeState = {
  theme: 'violet',
  mode: 'light',
  fontFamily: 'roboto',
} as const;

@Injectable()
export class LocalStorageThemePreferencesRepository implements IThemePreferencesRepository {
  loadPreferences(): Observable<ThemeState> {
    try {
      const theme = this.loadTheme();
      const mode = this.loadMode();
      const fontFamily = this.loadFont();

      return of({ theme, mode, fontFamily });
    } catch (error) {
      console.warn('Failed to load theme preferences:', error);
      return of(DEFAULTS);
    }
  }

  savePreferences(state: ThemeState): Observable<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
      localStorage.setItem(STORAGE_KEYS.MODE, state.mode);
      localStorage.setItem(STORAGE_KEYS.FONT, state.fontFamily);
      return of(void 0);
    } catch (error) {
      console.warn('Failed to save theme preferences:', error);
      return of(void 0);
    }
  }

  private loadTheme(): ThemeId {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    return (stored as ThemeId) ?? DEFAULTS.theme;
  }

  private loadMode(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEYS.MODE);
    return (stored === 'light' || stored === 'dark') ? stored : DEFAULTS.mode;
  }

  private loadFont(): FontFamily {
    const stored = localStorage.getItem(STORAGE_KEYS.FONT);
    return (stored as FontFamily) ?? DEFAULTS.fontFamily;
  }
}
