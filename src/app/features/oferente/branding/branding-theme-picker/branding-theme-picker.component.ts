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
import { ThemeService } from '../services/theme.service';
import { getAllThemeIds, getThemeById, getAllFonts } from '../services/theme.registry';
import { ThemeCardComponent } from '../components/theme-card/theme-card.component';
import { ThemeId, FontFamily } from '../models/theme.types';
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
