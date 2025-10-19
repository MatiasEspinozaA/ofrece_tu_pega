// Use case: Load saved theme preferences
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeState } from '../domain/entities';
import { IThemePreferencesRepository, THEME_PREFERENCES_REPOSITORY } from '../domain/ports';

export class LoadThemePreferencesUseCase {
  private readonly repository: IThemePreferencesRepository = inject(THEME_PREFERENCES_REPOSITORY);

  execute(): Observable<ThemeState> {
    return this.repository.loadPreferences();
  }
}
