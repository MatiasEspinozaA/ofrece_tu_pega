// Use case: Save theme preferences
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeState } from '../domain/entities';
import { IThemePreferencesRepository, THEME_PREFERENCES_REPOSITORY } from '../domain/ports';

export class SaveThemePreferencesUseCase {
  private readonly repository: IThemePreferencesRepository = inject(THEME_PREFERENCES_REPOSITORY);

  execute(state: ThemeState): Observable<void> {
    return this.repository.savePreferences(state);
  }
}
