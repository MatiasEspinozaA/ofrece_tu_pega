/**
 * Branding Theme Picker Component
 * Main page for theme selection and customization
 *
 * Follows Clean Architecture:
 * - Gets all data through the Facade (no direct infrastructure imports)
 * - Uses ViewModel signals for reactive UI
 */

import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrandingFacade } from '../branding.facade';
import { ThemeCardComponent } from '../components/theme-card/theme-card.component';
import { ThemeId, FontFamily } from '../../domain/entities';

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
  templateUrl: './branding-theme-picker.component.html',
  styleUrl: './branding-theme-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandingThemePickerComponent implements OnInit {
  private readonly facade = inject(BrandingFacade);

  // i18n
  readonly i18n = BRANDING_I18N;

  // Theme IDs from Facade ViewModel (reactive)
  readonly themeIds = this.facade.vm.themeIds;

  // Font Options from Facade ViewModel (reactive)
  readonly fontOptions = this.facade.vm.fontOptions;

  // Current state from facade
  readonly currentTheme = this.facade.vm.theme;
  readonly currentMode = this.facade.vm.mode;
  readonly currentFont = this.facade.vm.fontFamily;

  // Computed
  readonly isDarkMode = this.facade.vm.isDarkMode;

  ngOnInit(): void {
    // Theme is already applied by facade on init
  }

  /**
   * Get theme definition by ID
   */
  getTheme(id: ThemeId) {
    return this.facade.getThemeById(id);
  }

  /**
   * Select a theme
   */
  selectTheme(themeId: string): void {
    this.facade.setTheme(themeId as ThemeId);
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    this.facade.toggleMode();
  }

  /**
   * Set font family
   */
  setFont(fontFamily: FontFamily): void {
    this.facade.setFont(fontFamily);
  }
}
