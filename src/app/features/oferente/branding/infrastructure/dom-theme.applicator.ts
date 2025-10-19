// Infrastructure: DOM theme applicator
import { Injectable } from '@angular/core';
import { IThemeApplicator } from '../domain/ports';
import { ThemeId, ThemeMode, FontFamily } from '../domain/entities';
import { THEME_DEFINITIONS, getFontById } from './theme-definitions.repository';

@Injectable()
export class DomThemeApplicator implements IThemeApplicator {
  applyTheme(themeId: ThemeId, mode: ThemeMode): void {
    const root = document.documentElement;
    const theme = THEME_DEFINITIONS[themeId];

    if (!theme) {
      console.warn(`Theme "${themeId}" not found`);
      return;
    }

    // Set data attributes
    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-mode', mode);

    // Apply CSS custom properties
    const tokens = mode === 'light' ? theme.light : theme.dark;
    Object.entries(tokens).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  applyFont(fontFamily: FontFamily): void {
    const fontOption = getFontById(fontFamily);
    if (!fontOption) {
      console.warn(`Font "${fontFamily}" not found`);
      return;
    }

    const root = document.documentElement;
    root.style.setProperty('--font-family-base', fontOption.cssValue);
    document.body.style.fontFamily = fontOption.cssValue;
  }
}
