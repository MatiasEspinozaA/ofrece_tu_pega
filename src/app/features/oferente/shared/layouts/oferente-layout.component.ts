// Oferente Layout Component - Main layout with sidebar and toolbar
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

interface UserInfo {
  name: string;
  email: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-oferente-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  template: `
    <mat-sidenav-container class="oferente-container">
      <!-- Sidebar -->
      <mat-sidenav
        #sidenav
        [mode]="sidenavMode()"
        [opened]="sidenavOpened()"
        class="oferente-sidenav"
      >
        <div class="sidenav-header">
          <div class="brand">
            <mat-icon class="brand-icon">storefront</mat-icon>
            <h2 class="brand-title">Mi Negocio</h2>
          </div>
        </div>

        <mat-divider></mat-divider>

        <mat-nav-list class="nav-menu">
          @for (item of menuItems; track item.route) {
            <a
              mat-list-item
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: false}"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
              @if (item.badge) {
                <span class="badge" matListItemMeta>{{ item.badge }}</span>
              }
            </a>
          }
        </mat-nav-list>

        <div class="sidenav-footer">
          <mat-divider></mat-divider>
          <div class="plan-info">
            <mat-icon>workspace_premium</mat-icon>
            <div>
              <div class="plan-name">Plan Premium</div>
              <div class="plan-status">Activo hasta 31/12/2025</div>
            </div>
          </div>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content>
        <!-- Toolbar -->
        <mat-toolbar class="oferente-toolbar" color="primary">
          <button
            mat-icon-button
            (click)="toggleSidenav()"
            matTooltip="Toggle menu"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <!-- Breadcrumb -->
          <div class="breadcrumb">
            <mat-icon class="breadcrumb-icon">folder</mat-icon>
            <span class="breadcrumb-text">Panel / Productos</span>
          </div>

          <span class="spacer"></span>

          <!-- User Menu -->
          <div class="user-section">
            <!-- Accessibility Menu -->
            <button
              mat-icon-button
              [matMenuTriggerFor]="accessibilityMenu"
              matTooltip="Accesibilidad"
            >
              <mat-icon>accessibility</mat-icon>
            </button>

            <!-- User Menu -->
            <button
              mat-button
              [matMenuTriggerFor]="userMenu"
              class="user-button"
            >
              <div class="user-avatar">
                @if (currentUser().avatarUrl) {
                  <img [src]="currentUser().avatarUrl" [alt]="currentUser().name" />
                } @else {
                  <mat-icon>account_circle</mat-icon>
                }
              </div>
              <span class="user-name">{{ currentUser().name }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
          </div>
        </mat-toolbar>

        <!-- Page Content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <!-- Accessibility Menu -->
    <mat-menu #accessibilityMenu="matMenu">
      <button mat-menu-item>
        <mat-icon>text_increase</mat-icon>
        <span>Aumentar texto</span>
      </button>
      <button mat-menu-item>
        <mat-icon>text_decrease</mat-icon>
        <span>Disminuir texto</span>
      </button>
      <button mat-menu-item>
        <mat-icon>contrast</mat-icon>
        <span>Alto contraste</span>
      </button>
      <button mat-menu-item>
        <mat-icon>invert_colors</mat-icon>
        <span>Modo oscuro</span>
      </button>
    </mat-menu>

    <!-- User Menu -->
    <mat-menu #userMenu="matMenu">
      <div class="user-menu-header">
        <div class="user-menu-name">{{ currentUser().name }}</div>
        <div class="user-menu-email">{{ currentUser().email }}</div>
      </div>
      <mat-divider></mat-divider>
      <button mat-menu-item routerLink="/oferente/profile">
        <mat-icon>person</mat-icon>
        <span>Mi perfil</span>
      </button>
      <button mat-menu-item routerLink="/oferente/settings">
        <mat-icon>settings</mat-icon>
        <span>Configuración</span>
      </button>
      <button mat-menu-item routerLink="/oferente/subscription">
        <mat-icon>credit_card</mat-icon>
        <span>Mi plan</span>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item routerLink="/oferente/help">
        <mat-icon>help</mat-icon>
        <span>Ayuda</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Cerrar sesión</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .oferente-container {
      height: 100vh;
      background-color: #f5f5f5;
    }

    .oferente-sidenav {
      width: 280px;
      border-right: 1px solid rgba(0, 0, 0, 0.12);

      .sidenav-header {
        padding: var(--spacing-lg);

        .brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-primary);

          .brand-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }

          .brand-title {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
          }
        }
      }

      .nav-menu {
        padding-top: var(--spacing-md);

        a.active {
          background-color: rgba(103, 58, 183, 0.1);
          color: var(--color-primary);
          border-left: 4px solid var(--color-primary);

          mat-icon {
            color: var(--color-primary);
          }
        }

        .badge {
          background-color: var(--color-accent);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
      }

      .sidenav-footer {
        position: absolute;
        bottom: 0;
        width: 100%;

        .plan-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background-color: rgba(103, 58, 183, 0.05);

          mat-icon {
            color: var(--color-primary);
          }

          .plan-name {
            font-weight: 600;
            font-size: 14px;
          }

          .plan-status {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }

    .oferente-toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        margin-left: var(--spacing-md);

        .breadcrumb-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        .breadcrumb-text {
          font-size: 14px;
          font-weight: 500;
        }
      }

      .spacer {
        flex: 1;
      }

      .user-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);

        .user-button {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: white;

          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            background-color: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            mat-icon {
              font-size: 32px;
              width: 32px;
              height: 32px;
            }
          }

          .user-name {
            font-size: 14px;
            font-weight: 500;

            @media (max-width: 600px) {
              display: none;
            }
          }
        }
      }
    }

    .page-content {
      padding: var(--spacing-lg);
      min-height: calc(100vh - 64px);
    }

    .user-menu-header {
      padding: var(--spacing-md);
      background-color: #f5f5f5;

      .user-menu-name {
        font-weight: 600;
        font-size: 14px;
      }

      .user-menu-email {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }
    }

    @media (max-width: 768px) {
      .oferente-sidenav {
        width: 240px;
      }
    }
  `]
})
export class OferenteLayoutComponent {
  sidenavOpened = signal(true);
  sidenavMode = signal<'side' | 'over'>('side');

  currentUser = signal<UserInfo>({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    avatarUrl: undefined
  });

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/oferente/dashboard' },
    { label: 'Mi Espacio', icon: 'web', route: '/oferente/space' },
    { label: 'Productos', icon: 'inventory_2', route: '/oferente/products', badge: 12 },
    { label: 'Servicios', icon: 'home_repair_service', route: '/oferente/services', badge: 5 },
    { label: 'Noticias', icon: 'article', route: '/oferente/news' },
    { label: 'Galería', icon: 'photo_library', route: '/oferente/gallery' },
    { label: 'Contactos', icon: 'contacts', route: '/oferente/contacts', badge: 3 },
    { label: 'Branding', icon: 'palette', route: '/oferente/branding' },
    { label: 'Analítica', icon: 'analytics', route: '/oferente/analytics' },
  ];

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  toggleSidenav(): void {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  logout(): void {
    console.log('Cerrando sesión...');
    // TODO: Implement logout logic
  }

  private checkScreenSize(): void {
    if (window.innerWidth < 768) {
      this.sidenavMode.set('over');
      this.sidenavOpened.set(false);
    } else {
      this.sidenavMode.set('side');
      this.sidenavOpened.set(true);
    }
  }
}
