// Use case: Load dashboard data
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardData } from '../domain/entities';
import { IDashboardRepository, DASHBOARD_REPOSITORY } from '../domain/ports';

export class LoadDashboardUseCase {
  private readonly repository: IDashboardRepository = inject(DASHBOARD_REPOSITORY);

  execute(): Observable<DashboardData> {
    return this.repository.getDashboardData();
  }
}
