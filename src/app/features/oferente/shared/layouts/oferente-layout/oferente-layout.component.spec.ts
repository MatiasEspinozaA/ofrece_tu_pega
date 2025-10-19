import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of, signal, computed } from 'rxjs';

import { OferenteLayoutComponent } from './oferente-layout.component';
import { BrandingFacade } from '../../../branding/presentation/branding.facade';

describe('OferenteLayoutComponent', () => {
  let component: OferenteLayoutComponent;
  let fixture: ComponentFixture<OferenteLayoutComponent>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let mockBrandingFacade: jasmine.SpyObj<BrandingFacade>;

  beforeEach(async () => {
    // Create mocks
    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    mockBreakpointObserver.observe.and.returnValue(of({ matches: false, breakpoints: {} }));

    // Create mock BrandingFacade with vm property
    mockBrandingFacade = jasmine.createSpyObj('BrandingFacade', [
      'toggleMode',
      'resetToDefaults',
    ]);
    // Mock the vm property with signals
    const mockMode = signal<'light' | 'dark'>('light');
    const mockIsDarkMode = computed(() => mockMode() === 'dark');
    Object.defineProperty(mockBrandingFacade, 'vm', {
      get: () => ({
        mode: mockMode.asReadonly(),
        isDarkMode: mockIsDarkMode,
      }),
    });

    await TestBed.configureTestingModule({
      imports: [
        OferenteLayoutComponent,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: BrandingFacade, useValue: mockBrandingFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OferenteLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default sidenav opened', () => {
      expect(component.sidenavOpened()).toBe(true);
    });

    it('should initialize with side mode', () => {
      expect(component.sidenavMode()).toBe('side');
    });

    it('should load font size from localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('large');
      component.ngOnInit();
      expect(component.fontSize()).toBe('large');
    });
  });

  describe('Responsive Layout', () => {
    it('should switch to overlay mode on mobile', () => {
      mockBreakpointObserver.observe.and.returnValue(
        of({ matches: true, breakpoints: {} })
      );

      component.ngOnInit();

      expect(component.sidenavMode()).toBe('over');
      expect(component.sidenavOpened()).toBe(false);
    });

    it('should switch to side mode on desktop', () => {
      mockBreakpointObserver.observe.and.returnValue(
        of({ matches: false, breakpoints: {} })
      );

      component.ngOnInit();

      expect(component.sidenavMode()).toBe('side');
      expect(component.sidenavOpened()).toBe(true);
    });
  });

  describe('Sidenav', () => {
    it('should toggle sidenav opened state', () => {
      const initialState = component.sidenavOpened();
      component.toggleSidenav();
      expect(component.sidenavOpened()).toBe(!initialState);
    });

    it('should identify active routes correctly', () => {
      component['currentRoute'].set('/oferente/dashboard');
      expect(component.isActiveRoute('/oferente/dashboard')).toBe(true);
      expect(component.isActiveRoute('/oferente/products')).toBe(false);
    });
  });

  describe('Font Size', () => {
    it('should increase font size from small to normal', () => {
      component['fontSize'].set('small');
      component.increaseFontSize();
      expect(component.fontSize()).toBe('normal');
    });

    it('should increase font size from normal to large', () => {
      component['fontSize'].set('normal');
      component.increaseFontSize();
      expect(component.fontSize()).toBe('large');
    });

    it('should not increase beyond large', () => {
      component['fontSize'].set('large');
      component.increaseFontSize();
      expect(component.fontSize()).toBe('large');
    });

    it('should decrease font size from large to normal', () => {
      component['fontSize'].set('large');
      component.decreaseFontSize();
      expect(component.fontSize()).toBe('normal');
    });

    it('should decrease font size from normal to small', () => {
      component['fontSize'].set('normal');
      component.decreaseFontSize();
      expect(component.fontSize()).toBe('small');
    });

    it('should not decrease below small', () => {
      component['fontSize'].set('small');
      component.decreaseFontSize();
      expect(component.fontSize()).toBe('small');
    });

    it('should save font size to localStorage', () => {
      spyOn(localStorage, 'setItem');
      component.setFontSize('large');
      expect(localStorage.setItem).toHaveBeenCalledWith('accessibility.fontSize', 'large');
    });
  });

  describe('Dark Mode', () => {
    it('should delegate dark mode toggle to BrandingFacade', () => {
      component.toggleDarkMode();
      expect(mockBrandingFacade.toggleMode).toHaveBeenCalled();
    });
  });

  describe('Accessibility Settings', () => {
    it('should reset font size to normal', () => {
      component['fontSize'].set('large');
      component.resetAccessibilitySettings();
      expect(component.fontSize()).toBe('normal');
    });

    it('should call BrandingFacade resetToDefaults', () => {
      component.resetAccessibilitySettings();
      expect(mockBrandingFacade.resetToDefaults).toHaveBeenCalled();
    });
  });

  describe('Menu Items', () => {
    it('should have correct menu items configured', () => {
      expect(component.menuItems.length).toBeGreaterThan(0);
      expect(component.menuItems[0].id).toBe('dashboard');
    });

    it('should track menu items by id', () => {
      const item = component.menuItems[0];
      expect(component.trackByMenuItem(0, item)).toBe(item.id);
    });
  });

  describe('User Information', () => {
    it('should have current user information', () => {
      const user = component.currentUser();
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.role).toBe('Oferente');
    });
  });

  describe('Cleanup', () => {
    it('should complete destroy$ subject on ngOnDestroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'complete');
      component.ngOnDestroy();
      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
