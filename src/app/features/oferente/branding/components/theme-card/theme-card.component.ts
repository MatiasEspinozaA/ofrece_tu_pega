/**
 * Theme Card Component
 * Displays a theme preview card with color palette and selection button
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeDefinition, ThemeMode } from '../../domain/entities';
import { getThemePalette } from '../../infrastructure/theme-definitions.repository';

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

  get palette() {
    return getThemePalette(this.theme.id, this.mode);
  }
}
