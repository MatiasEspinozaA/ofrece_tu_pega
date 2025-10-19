// Domain ports - Interfaces that define contracts with external layers
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardData } from './entities';

export interface IDashboardRepository {
  getDashboardData(): Observable<DashboardData>;
}

export const DASHBOARD_REPOSITORY = new InjectionToken<IDashboardRepository>(
  'IDashboardRepository'
);
