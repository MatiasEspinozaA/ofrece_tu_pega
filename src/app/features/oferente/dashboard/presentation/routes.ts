// Routes configuration with scoped providers
import { Routes } from '@angular/router';
import { DASHBOARD_REPOSITORY } from '../domain/ports';
import { HttpDashboardRepository } from '../infrastructure/http-dashboard.repository';
import { LoadDashboardUseCase } from '../application/load-dashboard.use-case';
import { DashboardStore } from './dashboard.store';
import { DashboardFacade } from './dashboard.facade';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.page').then(m => m.OferenteDashboardPageComponent),
    providers: [
      // Infrastructure
      {
        provide: DASHBOARD_REPOSITORY,
        useClass: HttpDashboardRepository,
      },
      // Application
      LoadDashboardUseCase,
      // Presentation
      DashboardStore,
      DashboardFacade,
    ],
  },
];
