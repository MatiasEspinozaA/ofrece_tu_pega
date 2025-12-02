// Branding providers - Configure all dependencies for the branding feature
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { BrandingStore } from './presentation/branding.store';
import { LoadThemePreferencesUseCase } from './application/load-theme-preferences.use-case';
import { SaveThemePreferencesUseCase } from './application/save-theme-preferences.use-case';
import { ApplyThemeUseCase } from './application/apply-theme.use-case';
import { GetThemeDefinitionsUseCase } from './application/get-theme-definitions.use-case';
import { LocalStorageThemePreferencesRepository } from './infrastructure/localstorage-theme-preferences.repository';
import { DomThemeApplicator } from './infrastructure/dom-theme.applicator';
import { StaticThemeDefinitionsRepository } from './infrastructure/theme-definitions.repository';
import {
  THEME_PREFERENCES_REPOSITORY,
  THEME_APPLICATOR,
  THEME_DEFINITIONS_REPOSITORY,
} from './domain/ports';

/**
 * Provides all dependencies for the branding feature
 * Use in app.config.ts to configure branding services globally
 */
export function provideBranding(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Store
    BrandingStore,

    // Use Cases
    LoadThemePreferencesUseCase,
    SaveThemePreferencesUseCase,
    ApplyThemeUseCase,
    GetThemeDefinitionsUseCase,

    // Infrastructure - bind to tokens
    {
      provide: THEME_PREFERENCES_REPOSITORY,
      useClass: LocalStorageThemePreferencesRepository,
    },
    {
      provide: THEME_APPLICATOR,
      useClass: DomThemeApplicator,
    },
    {
      provide: THEME_DEFINITIONS_REPOSITORY,
      useClass: StaticThemeDefinitionsRepository,
    },
  ]);
}
