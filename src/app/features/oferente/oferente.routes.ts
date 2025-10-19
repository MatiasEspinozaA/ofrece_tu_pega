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
        loadChildren: () =>
          import('./dashboard/presentation/routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./products/presentation/routes').then(m => m.OFERENTE_PRODUCTS_ROUTES),
      },
      // TODO: Add more routes as features are developed
      {
        path: 'services',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'news',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'branding',
        loadChildren: () =>
          import('./branding/presentation/routes').then(m => m.BRANDING_ROUTES),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'space',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./dashboard/presentation/dashboard.page').then(m => m.OferenteDashboardPageComponent), // Placeholder
      },
    ],
  },
];
