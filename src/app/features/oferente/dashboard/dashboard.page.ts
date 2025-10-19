// Oferente Dashboard Component
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
  route?: string;
}

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
  template: `
    <div class="dashboard-page">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p class="subtitle">Bienvenido de vuelta, aquí está el resumen de tu negocio</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid row">
        @for (card of statsCards; track card.title) {
          <div class="col-12 col-md-6 col-lg-3 mb-4">
            <mat-card class="stat-card" [style.border-left-color]="card.color">
              <div class="stat-icon" [style.background-color]="card.color + '20'">
                <mat-icon [style.color]="card.color">{{ card.icon }}</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-label">{{ card.title }}</div>
                <div class="stat-value">{{ card.value }}</div>
                @if (card.change) {
                  <div class="stat-change" [class.positive]="card.change.includes('+')">
                    {{ card.change }}
                  </div>
                }
              </div>
            </mat-card>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="section">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid row">
          @for (action of quickActions; track action.title) {
            <div class="col-12 col-md-6 col-lg-4 mb-4">
              <mat-card class="action-card" [routerLink]="action.route">
                <mat-icon [style.color]="action.color">{{ action.icon }}</mat-icon>
                <h3>{{ action.title }}</h3>
                <p>{{ action.description }}</p>
              </mat-card>
            </div>
          }
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="section">
        <h2>Actividad Reciente</h2>
        <mat-card class="activity-card">
          @for (activity of recentActivity; track activity.id) {
            <div class="activity-item">
              <div class="activity-icon">
                <mat-icon>{{ activity.icon }}</mat-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <mat-icon>inbox</mat-icon>
              <p>No hay actividad reciente</p>
            </div>
          }
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      .page-header {
        margin-bottom: var(--spacing-xl);

        h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .subtitle {
          margin: var(--spacing-xs) 0 0;
          color: var(--text-secondary);
          font-size: 16px;
        }
      }

      .section {
        margin-bottom: var(--spacing-xl);

        h2 {
          margin: 0 0 var(--spacing-md) 0;
          font-size: 20px;
          font-weight: 500;
          color: var(--text-primary);
        }
      }

      .stats-grid {
        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          border-left: 4px solid;
          transition: transform 0.2s, box-shadow 0.2s;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;

            mat-icon {
              font-size: 32px;
              width: 32px;
              height: 32px;
            }
          }

          .stat-content {
            flex: 1;

            .stat-label {
              font-size: 14px;
              color: var(--text-secondary);
              margin-bottom: 4px;
            }

            .stat-value {
              font-size: 28px;
              font-weight: 600;
              color: var(--text-primary);
            }

            .stat-change {
              font-size: 12px;
              color: var(--color-warn);
              margin-top: 4px;

              &.positive {
                color: var(--color-success);
              }
            }
          }
        }
      }

      .actions-grid {
        .action-card {
          padding: var(--spacing-lg);
          text-align: center;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          mat-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
            margin-bottom: var(--spacing-sm);
          }

          h3 {
            margin: var(--spacing-sm) 0;
            font-size: 18px;
            font-weight: 500;
          }

          p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 14px;
          }
        }
      }

      .activity-card {
        padding: var(--spacing-md);

        .activity-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);

          &:last-child {
            border-bottom: none;
          }

          .activity-icon {
            width: 40px;
            height: 40px;
            background-color: var(--color-primary-bg);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            mat-icon {
              color: var(--color-primary);
            }
          }

          .activity-content {
            flex: 1;

            .activity-title {
              font-size: 14px;
              color: var(--text-primary);
            }

            .activity-time {
              font-size: 12px;
              color: var(--text-secondary);
              margin-top: 4px;
            }
          }
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-xl);

          mat-icon {
            font-size: 64px;
            width: 64px;
            height: 64px;
            color: var(--text-disabled);
          }

          p {
            margin-top: var(--spacing-md);
            color: var(--text-secondary);
          }
        }
      }
    }
  `]
})
export class OferenteDashboardPageComponent {
  statsCards: DashboardCard[] = [
    {
      title: 'Visitas este mes',
      value: '1,234',
      icon: 'visibility',
      color: 'var(--color-primary)',
      change: '+12.5%',
    },
    {
      title: 'Productos activos',
      value: 12,
      icon: 'inventory_2',
      color: 'var(--color-primary)',
      route: '/oferente/products',
    },
    {
      title: 'Mensajes nuevos',
      value: 8,
      icon: 'mail',
      color: 'var(--color-accent)',
      change: '+3',
      route: '/oferente/contacts',
    },
    {
      title: 'Servicios',
      value: 5,
      icon: 'home_repair_service',
      color: 'var(--color-primary)',
      route: '/oferente/services',
    },
  ];

  quickActions = [
    {
      title: 'Agregar Producto',
      description: 'Crea un nuevo producto para tu catálogo',
      icon: 'add_shopping_cart',
      color: 'var(--color-primary)',
      route: '/oferente/products',
    },
    {
      title: 'Publicar Noticia',
      description: 'Comparte novedades con tus clientes',
      icon: 'article',
      color: 'var(--color-primary)',
      route: '/oferente/news',
    },
    {
      title: 'Editar Mi Espacio',
      description: 'Personaliza tu sitio web',
      icon: 'web',
      color: 'var(--color-accent)',
      route: '/oferente/space',
    },
    {
      title: 'Ver Analítica',
      description: 'Revisa las métricas de tu negocio',
      icon: 'analytics',
      color: 'var(--color-primary)',
      route: '/oferente/analytics',
    },
    {
      title: 'Configurar Marca',
      description: 'Ajusta logo, colores y diseño',
      icon: 'palette',
      color: 'var(--color-accent)',
      route: '/oferente/branding',
    },
    {
      title: 'Ver Mi Plan',
      description: 'Gestiona tu suscripción',
      icon: 'workspace_premium',
      color: 'var(--color-primary)',
      route: '/oferente/subscription',
    },
  ];

  recentActivity = [
    {
      id: 1,
      title: 'Nuevo mensaje de Juan Pérez',
      time: 'Hace 5 minutos',
      icon: 'mail',
    },
    {
      id: 2,
      title: 'Producto "Notebook HP" fue visto 15 veces',
      time: 'Hace 1 hora',
      icon: 'visibility',
    },
    {
      id: 3,
      title: 'Tu sitio fue visitado 45 veces hoy',
      time: 'Hace 3 horas',
      icon: 'trending_up',
    },
    {
      id: 4,
      title: 'Actualizaste el producto "Mouse Logitech"',
      time: 'Hace 1 día',
      icon: 'edit',
    },
  ];
}
