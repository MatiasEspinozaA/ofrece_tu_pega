// Oferente Routes
import { Routes } from '@angular/router';
import { OferenteLayoutComponent } from './shared/layouts/oferente-layout/oferente-layout.component';

export const OFERENTE_ROUTES: Routes = [
  {
    path: '',
    component: OferenteLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/products.page').then(m => m.OferenteProductsPageComponent),
      },
      // TODO: Add more routes as features are developed
      {
        path: 'services',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'news',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'branding',
        loadChildren: () =>
          import('./branding/branding.routes').then(m => m.BRANDING_ROUTES),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'space',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
    ],
  },
];
