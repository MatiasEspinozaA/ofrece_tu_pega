/**
 * Branding Feature Routes
 */

import { Routes } from '@angular/router';

export const BRANDING_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'estilo',
    pathMatch: 'full',
  },
  {
    path: 'estilo',
    loadComponent: () =>
      import('./branding-theme-picker.component').then(
        (m) => m.BrandingThemePickerComponent
      ),
    title: 'Estilo de la Aplicación - Branding',
  },
];
