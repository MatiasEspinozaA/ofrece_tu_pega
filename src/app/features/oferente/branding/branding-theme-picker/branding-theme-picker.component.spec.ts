import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BrandingThemePickerComponent } from './branding-theme-picker.component';
import { ThemeService } from '../services/theme.service';
import { signal } from '@angular/core';

describe('BrandingThemePickerComponent', () => {
  let component: BrandingThemePickerComponent;
  let fixture: ComponentFixture<BrandingThemePickerComponent>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    mockThemeService = jasmine.createSpyObj('ThemeService', [
      'setTheme',
      'toggleMode',
      'setFont',
      'applyToDocument',
    ]);

    // Mock signals
    Object.defineProperty(mockThemeService, 'theme', {
      get: () => signal('default'),
    });
    Object.defineProperty(mockThemeService, 'mode', {
      get: () => signal('light'),
    });
    Object.defineProperty(mockThemeService, 'fontFamily', {
      get: () => signal('inter'),
    });

    await TestBed.configureTestingModule({
      imports: [BrandingThemePickerComponent, NoopAnimationsModule],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandingThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should apply theme to document on init', () => {
      expect(mockThemeService.applyToDocument).toHaveBeenCalled();
    });

    it('should have theme IDs loaded', () => {
      expect(component.themeIds.length).toBeGreaterThan(0);
    });

    it('should have font options loaded', () => {
      expect(component.fontOptions.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Selection', () => {
    it('should select a theme', () => {
      component.selectTheme('ocean');
      expect(mockThemeService.setTheme).toHaveBeenCalledWith('ocean');
    });

    it('should get theme by id', () => {
      const theme = component.getTheme('default');
      expect(theme).toBeDefined();
      expect(theme.id).toBe('default');
    });
  });

  describe('Dark Mode', () => {
    it('should toggle dark mode', () => {
      component.toggleDarkMode();
      expect(mockThemeService.toggleMode).toHaveBeenCalled();
    });

    it('should compute dark mode state correctly', () => {
      expect(component.isDarkMode()).toBe(false);
    });
  });

  describe('Font Selection', () => {
    it('should set font family', () => {
      component.setFont('roboto');
      expect(mockThemeService.setFont).toHaveBeenCalledWith('roboto');
    });
  });

  describe('Internationalization', () => {
    it('should have i18n texts', () => {
      expect(component.i18n.title).toBeDefined();
      expect(component.i18n.subtitle).toBeDefined();
      expect(component.i18n.darkModeLabel).toBeDefined();
    });
  });
});
