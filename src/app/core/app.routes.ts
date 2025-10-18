import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'oferente',
    pathMatch: 'full'
  },
  // Oferente Panel (Main route for now)
  {
    path: 'oferente',
    loadChildren: () => import('../features/oferente/oferente.routes').then(m => m.OFERENTE_ROUTES)
  },
  // Original products feature (kept for reference)
  {
    path: 'demo',
    loadComponent: () => import('../shared/ui/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'products',
        loadChildren: () => import('../features/products/presentation/routes').then(m => m.PRODUCTS_ROUTES)
      }
    ]
  }
];
