/**
 * Theme Card Component
 * Displays a theme preview card with color palette and selection button
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeDefinition, ThemeMode } from '../models/theme.types';
import { getThemePalette } from '../services/theme.registry';

@Component({
  selector: 'app-theme-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card
      class="theme-card"
      [class.active]="isActive"
      [attr.role]="'radio'"
      [attr.aria-checked]="isActive"
      [attr.aria-label]="theme.title + ': ' + theme.subtitle"
    >
      <mat-card-header>
        <div mat-card-avatar class="theme-icon">
          <mat-icon [style.color]="palette.primary">{{ theme.icon || 'palette' }}</mat-icon>
        </div>
        <mat-card-title>{{ theme.title }}</mat-card-title>
        <mat-card-subtitle>{{ theme.subtitle }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <!-- Color Preview -->
        <div class="color-preview" [attr.aria-label]="'Vista previa de colores'">
          <div class="preview-header" [style.background-color]="palette.primary">
            <div class="preview-toolbar">
              <div class="preview-dot"></div>
              <div class="preview-dot"></div>
              <div class="preview-dot"></div>
            </div>
          </div>
          <div class="preview-content" [style.background-color]="palette.background">
            <div class="preview-chip" [style.background-color]="palette.accent"></div>
            <div class="preview-text" [style.color]="palette.text">
              <div class="preview-line"></div>
              <div class="preview-line short"></div>
            </div>
          </div>
        </div>

        <!-- Color Swatches -->
        <div class="color-swatches">
          <div
            class="swatch"
            [style.background-color]="palette.primary"
            [attr.aria-label]="'Color primario'"
            [title]="palette.primary"
          ></div>
          <div
            class="swatch"
            [style.background-color]="palette.accent"
            [attr.aria-label]="'Color acento'"
            [title]="palette.accent"
          ></div>
          <div
            class="swatch"
            [style.background-color]="palette.background"
            [attr.aria-label]="'Color fondo'"
            [title]="palette.background"
          ></div>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button
          mat-raised-button
          [color]="isActive ? 'primary' : undefined"
          (click)="selectTheme.emit(theme.id)"
          [attr.aria-pressed]="isActive"
        >
          <mat-icon>{{ isActive ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
          {{ isActive ? 'Activo' : 'Usar este tema' }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .theme-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: all var(--transition-base);
      cursor: pointer;
      background-color: var(--bg-elevated);
      color: var(--text-primary);
      border: 2px solid var(--border-color);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--color-primary);
      }

      &.active {
        border: 2px solid var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-bg);
      }
    }

    ::ng-deep .mat-mdc-card-header {
      padding: var(--spacing-md) var(--spacing-md) 0 var(--spacing-md);
    }

    ::ng-deep .mat-mdc-card-title,
    ::ng-deep .mat-card-title {
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

    .theme-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }

    mat-card-content {
      flex: 1;
      padding: var(--spacing-md) !important;
    }

    .color-preview {
      border-radius: var(--border-radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--spacing-md);
    }

    .preview-header {
      padding: var(--spacing-sm);
      display: flex;
      align-items: center;
    }

    .preview-toolbar {
      display: flex;
      gap: 4px;
    }

    .preview-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.8);
    }

    .preview-content {
      padding: var(--spacing-md);
      min-height: 80px;
    }

    .preview-chip {
      width: 60px;
      height: 24px;
      border-radius: 12px;
      margin-bottom: var(--spacing-sm);
    }

    .preview-text {
      .preview-line {
        height: 8px;
        background-color: currentColor;
        opacity: 0.6;
        border-radius: 4px;
        margin-bottom: 6px;

        &.short {
          width: 60%;
        }
      }
    }

    .color-swatches {
      display: flex;
      gap: var(--spacing-sm);
    }

    .swatch {
      flex: 1;
      height: 32px;
      border-radius: var(--border-radius-sm);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition: transform var(--transition-fast);

      &:hover {
        transform: scale(1.1);
      }
    }

    mat-card-actions {
      padding: var(--spacing-md) !important;

      button {
        width: 100%;
      }
    }
  `],
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
