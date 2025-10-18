/**
 * Branding Theme Picker Component
 * Main page for theme selection and customization
 */

import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from './services/theme.service';
import { getAllThemeIds, getThemeById } from './services/theme.registry';
import { ThemeCardComponent } from './components/theme-card.component';
import { ThemeId } from './models/theme.types';

// i18n texts (ready for ngx-translate)
const BRANDING_I18N = {
  title: 'Estilo de la Aplicación',
  subtitle: 'Personaliza los colores y apariencia de tu espacio',
  darkModeLabel: 'Modo Oscuro',
  darkModeHint: 'Alternar entre tema claro y oscuro',
  themesSection: 'Temas Disponibles',
  themesHint: 'Selecciona el tema que mejor represente tu marca',
} as const;

@Component({
  selector: 'app-branding-theme-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    ThemeCardComponent,
  ],
  template: `
    <div class="branding-page">
      <div class="container-fluid">
        <!-- Page Header -->
        <div class="page-header">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1>
                <mat-icon>palette</mat-icon>
                {{ i18n.title }}
              </h1>
              <p class="subtitle">{{ i18n.subtitle }}</p>
            </div>
            <div class="col-md-4 text-end">
              <mat-slide-toggle
                [checked]="isDarkMode()"
                (change)="toggleDarkMode()"
                [matTooltip]="i18n.darkModeHint"
                color="primary"
              >
                <mat-icon>{{ isDarkMode() ? 'dark_mode' : 'light_mode' }}</mat-icon>
                {{ i18n.darkModeLabel }}
              </mat-slide-toggle>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="row">
          <!-- Theme Grid -->
          <div class="col-12">
            <div class="section-header">
              <h2>{{ i18n.themesSection }}</h2>
              <p>{{ i18n.themesHint }}</p>
            </div>

            <div
              class="themes-grid row"
              role="radiogroup"
              [attr.aria-label]="i18n.themesSection"
            >
              @for (themeId of themeIds; track themeId) {
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                  <app-theme-card
                    [theme]="getTheme(themeId)"
                    [mode]="currentMode()"
                    [isActive]="currentTheme() === themeId"
                    (selectTheme)="selectTheme($event)"
                  />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .branding-page {
      padding: var(--spacing-lg);
      min-height: 100vh;
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }

    .page-header {
      margin-bottom: var(--spacing-xl);
      padding: var(--spacing-lg);
      background-color: var(--bg-elevated);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);

      h1 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin: 0;
        font-size: var(--font-size-xxxl);
        color: var(--text-primary);
        font-weight: var(--font-weight-semibold);

        mat-icon {
          font-size: 36px;
          width: 36px;
          height: 36px;
          color: var(--color-primary);
        }
      }

      .subtitle {
        margin: var(--spacing-xs) 0 0;
        color: var(--text-secondary);
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-normal);
      }

      mat-slide-toggle {
        display: inline-flex;
        align-items: center;
        color: var(--text-primary);

        ::ng-deep {
          .mdc-form-field {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
          }

          .mdc-label {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            padding-left: var(--spacing-sm);
            color: var(--text-primary);
            font-size: var(--font-size-base);
            font-weight: var(--font-weight-medium);
            line-height: 1;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .mdc-switch {
            margin: 0;
          }
        }
      }
    }

    .section-header {
      margin-bottom: var(--spacing-lg);
      padding: var(--spacing-sm) 0;

      h2 {
        margin: 0 0 var(--spacing-xs) 0;
        font-size: var(--font-size-xxl);
        color: var(--text-primary);
        font-weight: var(--font-weight-semibold);
      }

      p {
        margin: 0;
        color: var(--text-secondary);
        font-size: var(--font-size-base);
      }
    }

    .themes-grid {
      margin-bottom: var(--spacing-xl);
    }

    @media (max-width: 768px) {
      .branding-page {
        padding: var(--spacing-md);
      }

      .page-header {
        h1 {
          font-size: var(--font-size-xxl);
        }

        .text-end {
          text-align: left !important;
          margin-top: var(--spacing-md);
        }
      }
    }
  `],
})
export class BrandingThemePickerComponent implements OnInit {
  private readonly themeService = inject(ThemeService);

  // i18n
  readonly i18n = BRANDING_I18N;

  // Theme IDs
  readonly themeIds = getAllThemeIds();

  // Current state from service
  readonly currentTheme = this.themeService.theme;
  readonly currentMode = this.themeService.mode;

  // Computed
  readonly isDarkMode = computed(() => this.currentMode() === 'dark');

  ngOnInit(): void {
    // Ensure theme is applied on init
    this.themeService.applyToDocument();
  }

  /**
   * Get theme definition by ID
   */
  getTheme(id: ThemeId) {
    return getThemeById(id);
  }

  /**
   * Select a theme
   */
  selectTheme(themeId: string): void {
    this.themeService.setTheme(themeId as ThemeId);
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    this.themeService.toggleMode();
  }
}
