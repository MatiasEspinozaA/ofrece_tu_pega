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
  templateUrl: './theme-preview-panel.component.html',
  styleUrl: './theme-preview-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePreviewPanelComponent {
  readonly mockNavItems = [
    { icon: 'dashboard', label: 'Dashboard', active: true },
    { icon: 'people', label: 'Usuarios', active: false },
    { icon: 'settings', label: 'Configuración', active: false },
  ];
}
