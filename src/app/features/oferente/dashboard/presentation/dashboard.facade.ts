// Facade: Simplifies interaction between UI and business logic
import { Injectable } from '@angular/core';
import { DashboardStore } from './dashboard.store';
import { LoadDashboardUseCase } from '../application/load-dashboard.use-case';

// ViewModel exposes signals that can be used directly in templates
export type DashboardViewModel = {
  readonly data: DashboardStore['data'];
  readonly stats: DashboardStore['stats'];
  readonly quickActions: DashboardStore['quickActions'];
  readonly recentActivity: DashboardStore['recentActivity'];
  readonly loading: DashboardStore['loading'];
  readonly error: DashboardStore['error'];
};

@Injectable()
export class DashboardFacade {
  // Expose a simple ViewModel for the UI
  readonly vm: DashboardViewModel;

  constructor(
    private readonly store: DashboardStore,
    private readonly loadDashboardUseCase: LoadDashboardUseCase
  ) {
    this.vm = {
      data: this.store.data,
      stats: this.store.stats,
      quickActions: this.store.quickActions,
      recentActivity: this.store.recentActivity,
      loading: this.store.loading,
      error: this.store.error,
    };
  }

  loadDashboard(): void {
    this.store.setLoading(true);
    this.loadDashboardUseCase.execute().subscribe({
      next: data => {
        this.store.setDashboardData(data);
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError(err.message || 'Failed to load dashboard data');
      },
    });
  }

  clearError(): void {
    this.store.clearError();
  }
}
