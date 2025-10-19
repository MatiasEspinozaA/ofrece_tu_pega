/**
 * Theme Service
 * Manages theme selection, mode switching, and persistence
 */

import { Injectable, signal, computed, effect } from '@angular/core';
import { ThemeId, ThemeMode, ThemeState, FontFamily } from '../domain/entities';
import { THEME_DEFINITIONS, getFontById } from '../infrastructure/theme-definitions.repository';

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

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // State signals
  private readonly _theme = signal<ThemeId>(this.loadTheme());
  private readonly _mode = signal<ThemeMode>(this.loadMode());
  private readonly _fontFamily = signal<FontFamily>(this.loadFont());

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

  constructor() {
    // Apply theme on init
    this.applyToDocument();

    // Auto-apply on changes
    effect(() => {
      const currentState = this.state();
      this.applyToDocument();
      this.persistState(currentState);
    });
  }

  /**
   * Get current theme ID
   */
  getTheme(): ThemeId {
    return this._theme();
  }

  /**
   * Set theme
   */
  setTheme(themeId: ThemeId): void {
    if (THEME_DEFINITIONS[themeId]) {
      this._theme.set(themeId);
    } else {
      console.warn(`Theme "${themeId}" not found, keeping current theme`);
    }
  }

  /**
   * Get current mode
   */
  getMode(): ThemeMode {
    return this._mode();
  }

  /**
   * Set mode
   */
  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
  }

  /**
   * Toggle between light and dark mode
   */
  toggleMode(): void {
    this.setMode(this._mode() === 'light' ? 'dark' : 'light');
  }

  /**
   * Get current font family
   */
  getFont(): FontFamily {
    return this._fontFamily();
  }

  /**
   * Set font family
   */
  setFont(fontFamily: FontFamily): void {
    this._fontFamily.set(fontFamily);
  }

  /**
   * Apply current theme and mode to document
   */
  applyToDocument(): void {
    const root = document.documentElement;
    const currentTheme = this._theme();
    const currentMode = this._mode();
    const currentFont = this._fontFamily();

    // Set data attributes
    root.setAttribute('data-theme', currentTheme);
    root.setAttribute('data-mode', currentMode);

    // Apply token overrides
    this.applyTokens(currentTheme, currentMode);

    // Apply font family
    this.applyFont(currentFont);
  }

  /**
   * Apply font family to document
   */
  private applyFont(fontFamily: FontFamily): void {
    const fontOption = getFontById(fontFamily);
    if (!fontOption) return;

    const root = document.documentElement;
    root.style.setProperty('--font-family-base', fontOption.cssValue);
    document.body.style.fontFamily = fontOption.cssValue;
  }

  /**
   * Apply CSS custom properties to document
   */
  private applyTokens(themeId: ThemeId, mode: ThemeMode): void {
    const theme = THEME_DEFINITIONS[themeId];
    if (!theme) return;

    const tokens = mode === 'light' ? theme.light : theme.dark;
    const root = document.documentElement;

    // Apply each token
    Object.entries(tokens).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Load theme from localStorage
   */
  private loadTheme(): ThemeId {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored && this.isValidThemeId(stored)) {
        return stored as ThemeId;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    return DEFAULTS.theme;
  }

  /**
   * Load mode from localStorage
   */
  private loadMode(): ThemeMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MODE);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to load mode from localStorage:', error);
    }
    return DEFAULTS.mode;
  }

  /**
   * Load font family from localStorage
   */
  private loadFont(): FontFamily {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FONT);
      if (stored && this.isValidFontId(stored)) {
        return stored as FontFamily;
      }
    } catch (error) {
      console.warn('Failed to load font from localStorage:', error);
    }
    return DEFAULTS.fontFamily;
  }

  /**
   * Persist current state to localStorage
   */
  private persistState(state: ThemeState): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
      localStorage.setItem(STORAGE_KEYS.MODE, state.mode);
      localStorage.setItem(STORAGE_KEYS.FONT, state.fontFamily);
    } catch (error) {
      console.warn('Failed to persist theme state:', error);
    }
  }

  /**
   * Validate theme ID
   */
  private isValidThemeId(id: string): boolean {
    return id in THEME_DEFINITIONS;
  }

  /**
   * Validate font ID
   */
  private isValidFontId(id: string): boolean {
    return getFontById(id as FontFamily) !== undefined;
  }

  /**
   * Reset to default theme
   */
  resetToDefaults(): void {
    this._theme.set(DEFAULTS.theme);
    this._mode.set(DEFAULTS.mode);
    this._fontFamily.set(DEFAULTS.fontFamily);
  }

  /**
   * Utility: Calculate light/dark variants of a color
   * Adjusts HSL luminance for --color-primary-light/dark
   */
  static calculateColorVariants(hexColor: string): {
    light: string;
    dark: string;
  } {
    // Convert hex to RGB
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return { light: hexColor, dark: hexColor };

    // Convert RGB to HSL
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Calculate variants
    const lightHsl = { ...hsl, l: Math.min(hsl.l + 0.15, 0.85) };
    const darkHsl = { ...hsl, l: Math.max(hsl.l - 0.15, 0.15) };

    return {
      light: this.hslToHex(lightHsl.h, lightHsl.s, lightHsl.l),
      dark: this.hslToHex(darkHsl.h, darkHsl.s, darkHsl.l),
    };
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  private static rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h, s, l };
  }

  private static hslToHex(h: number, s: number, l: number): string {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number): string => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}
