/**
 * Oferente Dashboard Page - Refactored with Clean Architecture
 * Main dashboard view for business owners
 */

import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DashboardFacade } from './dashboard.facade';

@Component({
  selector: 'app-oferente-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class OferenteDashboardPageComponent implements OnInit {
  constructor(readonly facade: DashboardFacade) {}

  // Computed properties from facade
  get statsCards() {
    return computed(() => {
      const stats = this.facade.vm.stats();
      if (!stats) return [];

      return [
        {
          title: 'Visitas este mes',
          value: stats.visits.toLocaleString('es-CL'),
          icon: 'visibility',
          color: 'var(--color-primary)',
          change: stats.visitsChange,
        },
        {
          title: 'Productos activos',
          value: stats.activeProducts,
          icon: 'inventory_2',
          color: 'var(--color-primary)',
          route: '/oferente/products',
        },
        {
          title: 'Mensajes nuevos',
          value: stats.newMessages,
          icon: 'mail',
          color: 'var(--color-accent)',
          change: stats.messagesChange,
          route: '/oferente/contacts',
        },
        {
          title: 'Servicios',
          value: stats.activeServices,
          icon: 'home_repair_service',
          color: 'var(--color-primary)',
          route: '/oferente/services',
        },
      ];
    });
  }

  get quickActions() {
    return this.facade.vm.quickActions;
  }

  get recentActivity() {
    return this.facade.vm.recentActivity;
  }

  ngOnInit(): void {
    this.facade.loadDashboard();
  }
}
