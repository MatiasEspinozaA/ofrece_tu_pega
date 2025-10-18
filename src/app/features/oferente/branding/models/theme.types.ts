/**
 * Theme System Type Definitions
 * Design tokens-based theming with light/dark mode support
 */

/**
 * Available theme identifiers
 */
export type ThemeId = 'nature' | 'ocean' | 'fire' | 'carbon' | 'snow' | 'violet' | 'sunshine' | 'sunset';

/**
 * Theme display modes
 */
export type ThemeMode = 'light' | 'dark';

/**
 * CSS Custom Property overrides
 * Maps CSS variable names to their values
 */
export type TokenOverrides = Record<string, string>;

/**
 * Complete theme definition
 */
export interface ThemeDefinition {
  /** Unique theme identifier */
  readonly id: ThemeId;

  /** Display name for UI */
  readonly title: string;

  /** Short description */
  readonly subtitle: string;

  /** Icon name for Material Icons */
  readonly icon?: string;

  /** Token overrides for light mode */
  readonly light: TokenOverrides;

  /** Token overrides for dark mode */
  readonly dark: TokenOverrides;
}

/**
 * Current theme state
 */
export interface ThemeState {
  /** Currently active theme */
  theme: ThemeId;

  /** Current display mode */
  mode: ThemeMode;
}

/**
 * Theme preview color palette
 * Used for visual representation in theme cards
 */
export interface ThemePalette {
  primary: string;
  accent: string;
  background: string;
  text: string;
}
