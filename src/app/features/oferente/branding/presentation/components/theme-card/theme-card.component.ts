/**
 * Theme Card Component
 * Displays a theme preview card with color palette and selection button
 *
 * Follows Clean Architecture:
 * - Receives theme data via Input (no direct infrastructure imports)
 * - Is a "dumb" component that only displays data
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeDefinition, ThemeMode, ThemePalette } from '../../../domain/entities';

@Component({
  selector: 'app-theme-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './theme-card.component.html',
  styleUrl: './theme-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeCardComponent {
  @Input({ required: true }) theme!: ThemeDefinition;
  @Input() mode: ThemeMode = 'light';
  @Input() isActive = false;
  @Output() selectTheme = new EventEmitter<string>();

  /**
   * Get theme palette based on current mode
   * Extracted from theme tokens directly (no infrastructure dependency)
   */
  get palette(): ThemePalette {
    const tokens = this.mode === 'light' ? this.theme.light : this.theme.dark;
    return {
      primary: tokens['--color-primary'],
      accent: tokens['--color-accent'],
      background: tokens['--bg-secondary'],
      text: tokens['--text-primary'],
    };
  }
}
