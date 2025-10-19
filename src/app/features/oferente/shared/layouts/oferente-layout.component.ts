/**
 * Oferente Layout Component
 * Main layout for the oferente (business owner) panel
 * Features: Responsive sidebar, accessibility options, user menu
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil, filter } from 'rxjs';
import { MenuItem, UserInfo, AccessibilitySettings } from './oferente-layout.types';
import { ThemeService } from '../../branding/services/theme.service';

@Component({
  selector: 'app-oferente-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './oferente-layout.component.html',
  styleUrl: './oferente-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OferenteLayoutComponent implements OnInit, OnDestroy {
  // Dependency Injection
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly themeService = inject(ThemeService);
  private readonly destroy$ = new Subject<void>();

  // Component State
  readonly sidenavOpened = signal<boolean>(true);
  readonly sidenavMode = signal<'side' | 'over'>('side');
  readonly currentRoute = signal<string>('');

  // User Information
  readonly currentUser = signal<UserInfo>({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    avatarUrl: undefined,
    role: 'Oferente',
  });

  // Font Size Setting (separate from theme service)
  readonly fontSize = signal<'small' | 'normal' | 'large'>('normal');

  // Accessibility Settings from Theme Service
  readonly currentMode = this.themeService.mode;
  readonly isDarkMode = computed(() => this.currentMode() === 'dark');

  // Menu Items Configuration
  readonly menuItems: readonly MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/oferente/dashboard',
      ariaLabel: 'Ir al panel principal',
    },
    {
      id: 'space',
      label: 'Mi Espacio',
      icon: 'web',
      route: '/oferente/space',
      ariaLabel: 'Gestionar mi espacio web',
    },
    {
      id: 'products',
      label: 'Productos',
      icon: 'inventory_2',
      route: '/oferente/products',
      badge: 12,
      ariaLabel: 'Gestionar productos (12 activos)',
    },
    {
      id: 'services',
      label: 'Servicios',
      icon: 'home_repair_service',
      route: '/oferente/services',
      badge: 5,
      ariaLabel: 'Gestionar servicios (5 activos)',
    },
    {
      id: 'news',
      label: 'Noticias',
      icon: 'article',
      route: '/oferente/news',
      ariaLabel: 'Publicar noticias y novedades',
    },
    {
      id: 'gallery',
      label: 'Galería',
      icon: 'photo_library',
      route: '/oferente/gallery',
      ariaLabel: 'Administrar galería de imágenes',
    },
    {
      id: 'contacts',
      label: 'Contactos',
      icon: 'contacts',
      route: '/oferente/contacts',
      badge: 3,
      ariaLabel: 'Ver mensajes de contacto (3 nuevos)',
    },
    {
      id: 'branding',
      label: 'Branding',
      icon: 'palette',
      route: '/oferente/branding',
      ariaLabel: 'Personalizar marca y diseño',
    },
    {
      id: 'analytics',
      label: 'Analítica',
      icon: 'analytics',
      route: '/oferente/analytics',
      ariaLabel: 'Ver métricas y estadísticas',
    },
  ];

  // Computed Properties
  readonly isMobile = computed(() => this.sidenavMode() === 'over');

  ngOnInit(): void {
    this.setupResponsiveLayout();
    this.setupRouterTracking();
    this.loadFontSizeSetting();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup responsive layout based on screen size
   */
  private setupResponsiveLayout(): void {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.matches) {
          // Mobile/Tablet - overlay mode
          this.sidenavMode.set('over');
          this.sidenavOpened.set(false);
        } else {
          // Desktop - side mode
          this.sidenavMode.set('side');
          this.sidenavOpened.set(true);
        }
      });
  }

  /**
   * Track current route for breadcrumb
   */
  private setupRouterTracking(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
      });
  }

  /**
   * Load font size setting from localStorage
   */
  private loadFontSizeSetting(): void {
    const saved = localStorage.getItem('accessibility.fontSize');
    if (saved && (saved === 'small' || saved === 'normal' || saved === 'large')) {
      this.fontSize.set(saved);
      this.applyFontSize(saved);
    }
  }

  /**
   * Save font size setting to localStorage
   */
  private saveFontSizeSetting(size: 'small' | 'normal' | 'large'): void {
    localStorage.setItem('accessibility.fontSize', size);
  }

  /**
   * Apply font size setting to document
   */
  private applyFontSize(size: 'small' | 'normal' | 'large'): void {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-normal', 'font-large');
    root.classList.add(`font-${size}`);
  }

  /**
   * Toggle sidebar open/close
   */
  toggleSidenav(): void {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  /**
   * Check if a route is currently active
   */
  isActiveRoute(route: string): boolean {
    return this.currentRoute().includes(route);
  }

  /**
   * Set specific font size
   */
  setFontSize(size: 'small' | 'normal' | 'large'): void {
    this.fontSize.set(size);
    this.applyFontSize(size);
    this.saveFontSizeSetting(size);
  }

  /**
   * Increase font size
   */
  increaseFontSize(): void {
    const current = this.fontSize();
    const newSize = current === 'small' ? 'normal' : 'large';
    this.setFontSize(newSize);
  }

  /**
   * Decrease font size
   */
  decreaseFontSize(): void {
    const current = this.fontSize();
    const newSize = current === 'large' ? 'normal' : 'small';
    this.setFontSize(newSize);
  }

  /**
   * Toggle dark mode - delegates to ThemeService
   */
  toggleDarkMode(): void {
    this.themeService.toggleMode();
  }

  /**
   * Reset all accessibility settings to defaults
   */
  resetAccessibilitySettings(): void {
    // Reset font size
    this.setFontSize('normal');

    // Reset theme to defaults via ThemeService
    this.themeService.resetToDefaults();
  }

  /**
   * Logout user
   */
  logout(): void {
    // TODO: Implement actual logout logic
    console.log('Cerrando sesión...');

    // Clear accessibility settings if needed
    // localStorage.removeItem('accessibility-settings');

    // Navigate to login
    // this.router.navigate(['/login']);
  }

  /**
   * TrackBy function for menu items (performance optimization)
   */
  trackByMenuItem(index: number, item: MenuItem): string {
    return item.id;
  }
}
