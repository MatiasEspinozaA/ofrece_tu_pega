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
import { getAllThemeIds, getThemeById, getAllFonts } from './services/theme.registry';
import { ThemeCardComponent } from './components/theme-card.component';
import { ThemeId, FontFamily } from './models/theme.types';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

// i18n texts (ready for ngx-translate)
const BRANDING_I18N = {
  title: 'Estilo de la Aplicación',
  subtitle: 'Personaliza los colores y apariencia de tu espacio',
  darkModeLabel: 'Modo Oscuro',
  darkModeHint: 'Alternar entre tema claro y oscuro',
  fontLabel: 'Tipografía',
  fontHint: 'Selecciona la fuente para tu aplicación',
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
    MatSelectModule,
    MatFormFieldModule,
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
            <div class="col-md-4">
              <div class="settings-controls">
                <!-- Font Selector -->
                <mat-form-field appearance="outline" class="font-selector">
                  <mat-label>
                    <mat-icon>font_download</mat-icon>
                    {{ i18n.fontLabel }}
                  </mat-label>
                  <mat-select
                    [value]="currentFont()"
                    (selectionChange)="setFont($event.value)"
                    [matTooltip]="i18n.fontHint"
                  >
                    @for (font of fontOptions; track font.id) {
                      <mat-option [value]="font.id">
                        <span class="font-option" [style.font-family]="font.cssValue">
                          {{ font.name }}
                        </span>
                        <small class="font-description">{{ font.description }}</small>
                      </mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <!-- Dark Mode Toggle -->
                <mat-slide-toggle
                  [checked]="isDarkMode()"
                  (change)="toggleDarkMode()"
                  [matTooltip]="i18n.darkModeHint"
                  color="primary"
                  class="dark-mode-toggle"
                >
                  <mat-icon>{{ isDarkMode() ? 'dark_mode' : 'light_mode' }}</mat-icon>
                  {{ i18n.darkModeLabel }}
                </mat-slide-toggle>
              </div>
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

      .settings-controls {
        display: flex;
        gap: var(--spacing-lg);
        align-items: flex-start;
        justify-content: flex-end;
        flex-wrap: wrap;
      }

      .font-selector {
        min-width: 250px;
        max-width: 300px;
        margin-bottom: 0;

        ::ng-deep {
          .mat-mdc-form-field {
            margin-bottom: 0;
          }

          .mat-mdc-text-field-wrapper {
            padding-bottom: 0;
          }

          .mat-mdc-form-field-label {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            color: var(--text-primary);

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: var(--color-primary);
            }
          }

          .mat-mdc-select {
            color: var(--text-primary);
          }

          .mat-mdc-select-value {
            color: var(--text-primary);
          }

          .mdc-notched-outline__leading,
          .mdc-notched-outline__notch,
          .mdc-notched-outline__trailing {
            border-color: var(--border-color) !important;
          }

          .mat-mdc-form-field.mat-focused {
            .mdc-notched-outline__leading,
            .mdc-notched-outline__notch,
            .mdc-notched-outline__trailing {
              border-color: var(--color-primary) !important;
            }
          }
        }
      }

      .dark-mode-toggle {
        display: inline-flex;
        align-items: center;
        color: var(--text-primary);
        margin-top: 8px;

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
            color: var(--text-primary) !important;
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
              color: var(--text-primary) !important;
            }
          }

          .mdc-switch {
            margin: 0;

            .mdc-switch__track {
              background-color: var(--border-color) !important;
              border-color: var(--border-color) !important;
            }

            .mdc-switch__handle-track {
              background-color: var(--bg-elevated) !important;
            }

            &.mdc-switch--selected {
              .mdc-switch__track {
                background-color: var(--color-primary) !important;
                border-color: var(--color-primary) !important;
              }

              .mdc-switch__handle-track {
                background-color: var(--color-primary) !important;
              }
            }
          }
        }
      }
    }

    ::ng-deep {
      .font-option {
        display: block;
        font-size: var(--font-size-base);
        margin-bottom: 2px;
        color: var(--text-primary);
      }

      .font-description {
        display: block;
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
        font-style: italic;
      }

      // Estilos para el panel de opciones del select
      .mat-mdc-select-panel {
        background-color: var(--bg-elevated) !important;

        .mat-mdc-option {
          color: var(--text-primary) !important;

          &:hover {
            background-color: var(--color-primary-hover) !important;
          }

          &.mat-mdc-option-active {
            background-color: var(--color-primary-bg) !important;
          }

          &.mdc-list-item--selected {
            background-color: var(--color-primary-hover) !important;
            color: var(--color-primary) !important;
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

  // Font Options
  readonly fontOptions = getAllFonts();

  // Current state from service
  readonly currentTheme = this.themeService.theme;
  readonly currentMode = this.themeService.mode;
  readonly currentFont = this.themeService.fontFamily;

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

  /**
   * Set font family
   */
  setFont(fontFamily: FontFamily): void {
    this.themeService.setFont(fontFamily);
  }
}
