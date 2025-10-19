import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ThemeCardComponent } from './theme-card.component';
import { getThemeById } from '../../services/theme.registry';

describe('ThemeCardComponent', () => {
  let component: ThemeCardComponent;
  let fixture: ComponentFixture<ThemeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeCardComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeCardComponent);
    component = fixture.componentInstance;

    // Set required inputs
    component.theme = getThemeById('default');
    component.mode = 'light';
    component.isActive = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Theme Display', () => {
    it('should display theme title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain(component.theme.title);
    });

    it('should display theme subtitle', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain(component.theme.subtitle);
    });

    it('should show correct icon', () => {
      component.theme = getThemeById('ocean');
      fixture.detectChanges();
      expect(component.theme.icon).toBeDefined();
    });
  });

  describe('Active State', () => {
    it('should apply active class when isActive is true', () => {
      component.isActive = true;
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('.theme-card');
      expect(card?.classList.contains('active')).toBe(true);
    });

    it('should not apply active class when isActive is false', () => {
      component.isActive = false;
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('.theme-card');
      expect(card?.classList.contains('active')).toBe(false);
    });

    it('should show "Activo" when active', () => {
      component.isActive = true;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Activo');
    });

    it('should show "Usar este tema" when not active', () => {
      component.isActive = false;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Usar este tema');
    });
  });

  describe('Theme Selection', () => {
    it('should emit selectTheme event when button is clicked', () => {
      spyOn(component.selectTheme, 'emit');
      const button = fixture.nativeElement.querySelector('button');
      button?.click();
      expect(component.selectTheme.emit).toHaveBeenCalledWith(component.theme.id);
    });
  });

  describe('Palette', () => {
    it('should get correct palette for light mode', () => {
      component.mode = 'light';
      const palette = component.palette;
      expect(palette).toBeDefined();
      expect(palette.primary).toBeDefined();
      expect(palette.accent).toBeDefined();
      expect(palette.background).toBeDefined();
    });

    it('should get correct palette for dark mode', () => {
      component.mode = 'dark';
      const palette = component.palette;
      expect(palette).toBeDefined();
      expect(palette.primary).toBeDefined();
      expect(palette.accent).toBeDefined();
      expect(palette.background).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have correct role', () => {
      const card = fixture.nativeElement.querySelector('.theme-card');
      expect(card?.getAttribute('role')).toBe('radio');
    });

    it('should have correct aria-checked', () => {
      component.isActive = true;
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('.theme-card');
      expect(card?.getAttribute('aria-checked')).toBe('true');
    });

    it('should have aria-label', () => {
      const card = fixture.nativeElement.querySelector('.theme-card');
      expect(card?.getAttribute('aria-label')).toContain(component.theme.title);
    });
  });
});
