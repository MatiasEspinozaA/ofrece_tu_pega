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
import { BrandingFacade } from '../branding.facade';
import { getAllThemeIds, getThemeById, getAllFonts } from '../../infrastructure/theme-definitions.repository';
import { ThemeCardComponent } from '../components/theme-card/theme-card.component';
import { ThemeId, FontFamily } from '../../domain/entities';
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
  templateUrl: './branding-theme-picker.component.html',
  styleUrl: './branding-theme-picker.component.scss',
})
export class BrandingThemePickerComponent implements OnInit {
  private readonly facade = inject(BrandingFacade);

  // i18n
  readonly i18n = BRANDING_I18N;

  // Theme IDs
  readonly themeIds = getAllThemeIds();

  // Font Options
  readonly fontOptions = getAllFonts();

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
    return getThemeById(id);
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
