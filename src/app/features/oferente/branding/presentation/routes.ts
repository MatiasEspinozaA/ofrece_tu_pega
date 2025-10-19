/**
 * Branding Feature Routes
 */

import { Routes } from '@angular/router';
import { THEME_PREFERENCES_REPOSITORY, THEME_APPLICATOR, THEME_DEFINITIONS_REPOSITORY } from '../domain/ports';
import { LocalStorageThemePreferencesRepository } from '../infrastructure/localstorage-theme-preferences.repository';
import { DomThemeApplicator } from '../infrastructure/dom-theme.applicator';
import { StaticThemeDefinitionsRepository } from '../infrastructure/theme-definitions.repository';
import { LoadThemePreferencesUseCase } from '../application/load-theme-preferences.use-case';
import { SaveThemePreferencesUseCase } from '../application/save-theme-preferences.use-case';
import { ApplyThemeUseCase } from '../application/apply-theme.use-case';
import { BrandingStore } from './branding.store';

export const BRANDING_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'estilo',
    pathMatch: 'full',
  },
  {
    path: 'estilo',
    loadComponent: () =>
      import('./branding-theme-picker/branding-theme-picker.component').then(
        (m) => m.BrandingThemePickerComponent
      ),
    title: 'Estilo de la Aplicación - Branding',
    providers: [
      // Infrastructure
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
      // Application
      LoadThemePreferencesUseCase,
      SaveThemePreferencesUseCase,
      ApplyThemeUseCase,
      // Presentation
      BrandingStore,
    ],
  },
];
