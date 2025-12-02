/**
 * Get Theme Definitions Use Case
 * Retrieves all available theme definitions and font options
 */
import { inject, Injectable } from '@angular/core';
import { ThemeDefinition, FontOption, ThemeId } from '../domain/entities';
import { IThemeDefinitionsRepository, THEME_DEFINITIONS_REPOSITORY } from '../domain/ports';

export interface ThemeDefinitionsResult {
  readonly themes: ThemeDefinition[];
  readonly themeIds: ThemeId[];
  readonly fonts: readonly FontOption[];
}

@Injectable()
export class GetThemeDefinitionsUseCase {
  private readonly repository = inject(THEME_DEFINITIONS_REPOSITORY);

  execute(): ThemeDefinitionsResult {
    const themes = this.repository.getAllThemes();
    const themeIds = themes.map(t => t.id);

    // Get fonts from repository (we'll add this method)
    const fonts = this.repository.getAllFonts?.() ?? [];

    return {
      themes,
      themeIds,
      fonts,
    };
  }

  getThemeById(id: ThemeId): ThemeDefinition | undefined {
    return this.repository.getThemeById(id);
  }
}
