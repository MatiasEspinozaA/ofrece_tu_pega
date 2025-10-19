import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BrandingThemePickerComponent } from './branding-theme-picker.component';
import { BrandingFacade } from '../branding.facade';
import { signal, computed } from '@angular/core';

describe('BrandingThemePickerComponent', () => {
  let component: BrandingThemePickerComponent;
  let fixture: ComponentFixture<BrandingThemePickerComponent>;
  let mockBrandingFacade: jasmine.SpyObj<BrandingFacade>;

  beforeEach(async () => {
    mockBrandingFacade = jasmine.createSpyObj('BrandingFacade', [
      'setTheme',
      'toggleMode',
      'setFont',
    ]);

    // Mock the vm property with signals
    const mockTheme = signal<any>('violet');
    const mockMode = signal<'light' | 'dark'>('light');
    const mockFontFamily = signal<any>('roboto');
    const mockIsDarkMode = computed(() => mockMode() === 'dark');

    Object.defineProperty(mockBrandingFacade, 'vm', {
      get: () => ({
        theme: mockTheme.asReadonly(),
        mode: mockMode.asReadonly(),
        fontFamily: mockFontFamily.asReadonly(),
        isDarkMode: mockIsDarkMode,
      }),
    });

    await TestBed.configureTestingModule({
      imports: [BrandingThemePickerComponent, NoopAnimationsModule],
      providers: [{ provide: BrandingFacade, useValue: mockBrandingFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandingThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
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
      expect(mockBrandingFacade.setTheme).toHaveBeenCalledWith('ocean');
    });

    it('should get theme by id', () => {
      const theme = component.getTheme('violet');
      expect(theme).toBeDefined();
      expect(theme.id).toBe('violet');
    });
  });

  describe('Dark Mode', () => {
    it('should toggle dark mode', () => {
      component.toggleDarkMode();
      expect(mockBrandingFacade.toggleMode).toHaveBeenCalled();
    });

    it('should compute dark mode state correctly', () => {
      expect(component.isDarkMode()).toBe(false);
    });
  });

  describe('Font Selection', () => {
    it('should set font family', () => {
      component.setFont('roboto');
      expect(mockBrandingFacade.setFont).toHaveBeenCalledWith('roboto');
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
