/**
 * Theme Preview Panel Component
 * Live preview of how the selected theme looks in a mini application layout
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-theme-preview-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="preview-panel">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>visibility</mat-icon>
          Vista Previa en Vivo
        </mat-card-title>
        <mat-card-subtitle>Así se verá tu aplicación</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="mock-app">
          <!-- Mock Toolbar -->
          <div class="mock-toolbar" [style.background-color]="'var(--color-primary)'">
            <mat-icon [style.color]="'var(--text-inverse)'">menu</mat-icon>
            <span class="mock-title" [style.color]="'var(--text-inverse)'">Mi Aplicación</span>
            <div class="spacer"></div>
            <mat-icon [style.color]="'var(--text-inverse)'">account_circle</mat-icon>
          </div>

          <!-- Mock Sidebar + Content -->
          <div class="mock-body">
            <!-- Sidebar -->
            <div class="mock-sidebar" [style.background-color]="'var(--bg-elevated)'">
              <div
                class="mock-nav-item"
                *ngFor="let item of mockNavItems"
                [class.active]="item.active"
                [style.background-color]="item.active ? 'var(--color-primary-hover)' : 'transparent'"
                [style.color]="item.active ? 'var(--color-primary)' : 'var(--text-secondary)'"
              >
                <mat-icon>{{ item.icon }}</mat-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>

            <!-- Content Area -->
            <div class="mock-content" [style.background-color]="'var(--bg-secondary)'">
              <!-- Mock Card -->
              <div class="mock-card" [style.background-color]="'var(--bg-elevated)'">
                <div class="mock-card-header">
                  <div class="mock-card-title" [style.color]="'var(--text-primary)'">Tarjeta de Ejemplo</div>
                  <div class="mock-card-subtitle" [style.color]="'var(--text-secondary)'">Subtítulo informativo</div>
                </div>

                <div class="mock-card-content">
                  <div class="mock-text-line" [style.background-color]="'var(--text-primary)'"></div>
                  <div class="mock-text-line short" [style.background-color]="'var(--text-secondary)'"></div>
                  <div class="mock-text-line medium" [style.background-color]="'var(--text-secondary)'"></div>
                </div>

                <div class="mock-card-actions">
                  <button mat-raised-button color="primary" class="mock-button">
                    Acción Principal
                  </button>
                  <button mat-button class="mock-button">Cancelar</button>
                </div>
              </div>

              <!-- Mock Chips -->
              <div class="mock-chips">
                <div class="mock-chip" [style.background-color]="'var(--color-primary-bg)'" [style.color]="'var(--color-primary)'">
                  <mat-icon>check</mat-icon>
                  Activo
                </div>
                <div class="mock-chip" [style.background-color]="'var(--color-accent)'" [style.color]="'var(--text-inverse)'">
                  <mat-icon>star</mat-icon>
                  Destacado
                </div>
              </div>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .preview-panel {
      height: 100%;
      position: sticky;
      top: var(--spacing-lg);
      background-color: var(--bg-elevated);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    ::ng-deep .mat-mdc-card-header {
      padding: var(--spacing-md);
    }

    ::ng-deep .mat-mdc-card-title,
    ::ng-deep .mat-card-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--text-primary) !important;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: 4px;
    }

    ::ng-deep .mat-mdc-card-subtitle,
    ::ng-deep .mat-card-subtitle {
      color: var(--text-secondary) !important;
      font-size: var(--font-size-sm);
    }

    .mock-app {
      border-radius: var(--border-radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
    }

    .mock-toolbar {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      min-height: 56px;
    }

    .mock-title {
      font-weight: 500;
      font-size: var(--font-size-lg);
    }

    .spacer {
      flex: 1;
    }

    .mock-body {
      display: flex;
      min-height: 300px;
    }

    .mock-sidebar {
      width: 200px;
      padding: var(--spacing-sm);
      border-right: 1px solid var(--border-color);
    }

    .mock-nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-sm);
      margin-bottom: var(--spacing-xs);
      font-size: var(--font-size-sm);
      transition: all var(--transition-fast);

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      &:hover {
        background-color: var(--state-hover) !important;
      }
    }

    .mock-content {
      flex: 1;
      padding: var(--spacing-lg);
    }

    .mock-card {
      border-radius: var(--border-radius-md);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--spacing-md);
    }

    .mock-card-header {
      margin-bottom: var(--spacing-md);
    }

    .mock-card-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin-bottom: 4px;
    }

    .mock-card-subtitle {
      font-size: var(--font-size-sm);
    }

    .mock-card-content {
      margin-bottom: var(--spacing-md);
    }

    .mock-text-line {
      height: 12px;
      border-radius: 6px;
      margin-bottom: 8px;
      opacity: 0.6;

      &.short {
        width: 40%;
      }

      &.medium {
        width: 70%;
      }
    }

    .mock-card-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .mock-button {
      font-size: var(--font-size-sm);
    }

    .mock-chips {
      display: flex;
      gap: var(--spacing-sm);
    }

    .mock-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px var(--spacing-sm);
      border-radius: var(--border-radius-full);
      font-size: var(--font-size-xs);
      font-weight: 500;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    @media (max-width: 768px) {
      .mock-sidebar {
        width: 60px;

        span {
          display: none;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePreviewPanelComponent {
  readonly mockNavItems = [
    { icon: 'dashboard', label: 'Dashboard', active: true },
    { icon: 'people', label: 'Usuarios', active: false },
    { icon: 'settings', label: 'Configuración', active: false },
  ];
}
