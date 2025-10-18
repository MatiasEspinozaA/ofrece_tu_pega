import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { OferenteLayoutComponent } from './oferente-layout.component';

describe('OferenteLayoutComponent', () => {
  let component: OferenteLayoutComponent;
  let fixture: ComponentFixture<OferenteLayoutComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let routerEventsSubject: Subject<any>;
  let breakpointSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject();
    breakpointSubject = new Subject();

    mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEventsSubject.asObservable(),
    });

    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    mockBreakpointObserver.observe.and.returnValue(breakpointSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [OferenteLayoutComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OferenteLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.sidenavOpened()).toBe(true);
    expect(component.sidenavMode()).toBe('side');
    expect(component.currentUser().name).toBe('Juan Pérez');
  });

  it('should toggle sidenav', () => {
    const initialState = component.sidenavOpened();
    component.toggleSidenav();
    expect(component.sidenavOpened()).toBe(!initialState);
  });

  it('should switch to overlay mode on mobile', () => {
    breakpointSubject.next({ matches: true });
    expect(component.sidenavMode()).toBe('over');
    expect(component.sidenavOpened()).toBe(false);
  });

  it('should switch to side mode on desktop', () => {
    breakpointSubject.next({ matches: false });
    expect(component.sidenavMode()).toBe('side');
    expect(component.sidenavOpened()).toBe(true);
  });

  it('should update current route on navigation', () => {
    const testUrl = '/oferente/products';
    routerEventsSubject.next(new NavigationEnd(1, testUrl, testUrl));
    expect(component.currentRoute()).toBe(testUrl);
  });

  it('should increase font size', () => {
    component.increaseFontSize();
    expect(component.accessibilitySettings().fontSize).toBe('large');
  });

  it('should decrease font size', () => {
    component.accessibilitySettings.set({
      fontSize: 'large',
      contrast: 'normal',
      theme: 'light',
    });
    component.decreaseFontSize();
    expect(component.accessibilitySettings().fontSize).toBe('normal');
  });

  it('should toggle high contrast', () => {
    component.toggleHighContrast();
    expect(component.accessibilitySettings().contrast).toBe('high');
    component.toggleHighContrast();
    expect(component.accessibilitySettings().contrast).toBe('normal');
  });

  it('should toggle dark mode', () => {
    component.toggleDarkMode();
    expect(component.accessibilitySettings().theme).toBe('dark');
    component.toggleDarkMode();
    expect(component.accessibilitySettings().theme).toBe('light');
  });

  it('should have menu items with correct structure', () => {
    expect(component.menuItems.length).toBeGreaterThan(0);
    component.menuItems.forEach(item => {
      expect(item.id).toBeTruthy();
      expect(item.label).toBeTruthy();
      expect(item.icon).toBeTruthy();
      expect(item.route).toBeTruthy();
      expect(item.ariaLabel).toBeTruthy();
    });
  });

  it('should detect active route', () => {
    component.currentRoute.set('/oferente/products');
    expect(component.isActiveRoute('/oferente/products')).toBe(true);
    expect(component.isActiveRoute('/oferente/dashboard')).toBe(false);
  });

  it('should cleanup on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
