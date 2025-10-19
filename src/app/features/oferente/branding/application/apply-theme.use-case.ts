// Use case: Apply theme to the application
import { inject } from '@angular/core';
import { ThemeId, ThemeMode, FontFamily } from '../domain/entities';
import { IThemeApplicator, THEME_APPLICATOR } from '../domain/ports';

export class ApplyThemeUseCase {
  private readonly applicator: IThemeApplicator = inject(THEME_APPLICATOR);

  execute(themeId: ThemeId, mode: ThemeMode, fontFamily: FontFamily): void {
    this.applicator.applyTheme(themeId, mode);
    this.applicator.applyFont(fontFamily);
  }
}
