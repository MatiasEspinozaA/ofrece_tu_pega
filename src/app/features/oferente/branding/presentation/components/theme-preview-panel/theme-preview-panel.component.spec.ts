import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ThemePreviewPanelComponent } from './theme-preview-panel.component';

describe('ThemePreviewPanelComponent', () => {
  let component: ThemePreviewPanelComponent;
  let fixture: ComponentFixture<ThemePreviewPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemePreviewPanelComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemePreviewPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Mock Navigation Items', () => {
    it('should have mock navigation items', () => {
      expect(component.mockNavItems.length).toBe(3);
    });

    it('should have one active item', () => {
      const activeItems = component.mockNavItems.filter(item => item.active);
      expect(activeItems.length).toBe(1);
    });

    it('should have Dashboard as active item', () => {
      const activeItem = component.mockNavItems.find(item => item.active);
      expect(activeItem?.label).toBe('Dashboard');
    });

    it('should have icons for all items', () => {
      component.mockNavItems.forEach(item => {
        expect(item.icon).toBeDefined();
      });
    });
  });

  describe('Preview Display', () => {
    it('should display title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Vista Previa en Vivo');
    });

    it('should display subtitle', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Así se verá tu aplicación');
    });

    it('should render mock toolbar', () => {
      const toolbar = fixture.nativeElement.querySelector('.mock-toolbar');
      expect(toolbar).toBeTruthy();
    });

    it('should render mock sidebar', () => {
      const sidebar = fixture.nativeElement.querySelector('.mock-sidebar');
      expect(sidebar).toBeTruthy();
    });

    it('should render mock content area', () => {
      const content = fixture.nativeElement.querySelector('.mock-content');
      expect(content).toBeTruthy();
    });

    it('should render mock card', () => {
      const card = fixture.nativeElement.querySelector('.mock-card');
      expect(card).toBeTruthy();
    });

    it('should render mock chips', () => {
      const chips = fixture.nativeElement.querySelectorAll('.mock-chip');
      expect(chips.length).toBe(2);
    });
  });

  describe('Navigation Items Rendering', () => {
    it('should render all navigation items', () => {
      const navItems = fixture.nativeElement.querySelectorAll('.mock-nav-item');
      expect(navItems.length).toBe(component.mockNavItems.length);
    });

    it('should apply active class to active item', () => {
      const activeItem = fixture.nativeElement.querySelector('.mock-nav-item.active');
      expect(activeItem).toBeTruthy();
    });
  });

  describe('Mock App Structure', () => {
    it('should have application title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Mi Aplicación');
    });

    it('should have card example text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Tarjeta de Ejemplo');
    });

    it('should have action buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.mock-button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
