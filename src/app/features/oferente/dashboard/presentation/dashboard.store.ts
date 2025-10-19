// Store: State management using Angular Signals
import { Injectable, signal, computed } from '@angular/core';
import { DashboardData } from '../domain/entities';

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

@Injectable()
export class DashboardStore {
  // Private state signal
  private readonly state = signal<DashboardState>(initialState);

  // Public computed selectors
  readonly data = computed(() => this.state().data);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly stats = computed(() => this.state().data?.stats ?? null);
  readonly quickActions = computed(() => this.state().data?.quickActions ?? []);
  readonly recentActivity = computed(() => this.state().data?.recentActivity ?? []);

  // State mutations
  setDashboardData(data: DashboardData): void {
    this.state.update(state => ({ ...state, data, error: null }));
  }

  setLoading(loading: boolean): void {
    this.state.update(state => ({ ...state, loading }));
  }

  setError(error: string): void {
    this.state.update(state => ({ ...state, error, loading: false }));
  }

  clearError(): void {
    this.state.update(state => ({ ...state, error: null }));
  }
}
