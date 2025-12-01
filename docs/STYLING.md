# Estilos, Theming y Responsive

Este documento describe el sistema de estilos, theming dinámico y estrategia responsive del proyecto.

---

## Sistema de Theming

### Arquitectura

El sistema de theming usa **CSS Custom Properties (Design Tokens)** que se aplican dinámicamente al elemento `:root` del documento.

```
┌─────────────────────────────────────────────────────────┐
│                    THEME SYSTEM                          │
├─────────────────────────────────────────────────────────┤
│  Theme Definitions (8 temas)                            │
│       ↓                                                 │
│  BrandingFacade (selección de tema/modo)                │
│       ↓                                                 │
│  DomThemeApplicator (aplica tokens al DOM)              │
│       ↓                                                 │
│  CSS Custom Properties en :root                         │
│       ↓                                                 │
│  Componentes usan var(--color-primary), etc.            │
└─────────────────────────────────────────────────────────┘
```

### Temas Disponibles

| ID | Nombre | Light Primary | Dark Primary | Icono |
|----|--------|---------------|--------------|-------|
| `violet` | Violeta (default) | #673ab7 | #bb86fc | auto_awesome |
| `nature` | Naturaleza | #2e7d32 | #66bb6a | eco |
| `ocean` | Océano | #1565c0 | #42a5f5 | waves |
| `fire` | Fuego | #c62828 | #ef5350 | local_fire_department |
| `carbon` | Carbón | #263238 | #78909c | blur_on |
| `snow` | Nieve | #546e7a | #b0bec5 | ac_unit |
| `sunshine` | Sol | #f9a825 | #ffd95a | wb_sunny |
| `sunset` | Atardecer | #f57c00 | #ffb74d | wb_twilight |

### Fuentes Disponibles

| ID | Nombre | CSS Value |
|----|--------|-----------|
| `roboto` | Roboto (default) | 'Roboto', sans-serif |
| `inter` | Inter | 'Inter', sans-serif |
| `poppins` | Poppins | 'Poppins', sans-serif |
| `montserrat` | Montserrat | 'Montserrat', sans-serif |
| `open-sans` | Open Sans | 'Open Sans', sans-serif |

---

## CSS Custom Properties (Design Tokens)

### Tokens de Color

```css
:root {
  /* Colores primarios */
  --color-primary: #673ab7;
  --color-primary-light: #9575cd;
  --color-primary-dark: #512da8;
  --color-primary-bg: rgba(103, 58, 183, 0.05);
  --color-primary-hover: rgba(103, 58, 183, 0.1);

  /* Colores secundarios */
  --color-accent: #ff4081;
  --color-success: #4caf50;
  --color-warn: #f44336;
  --color-info: #2196f3;

  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f5f5f5;
  --bg-elevated: #ffffff;

  /* Texto */
  --text-primary: #212121;
  --text-secondary: #666666;
  --text-disabled: #9e9e9e;
  --text-inverse: #ffffff;

  /* Bordes */
  --border-color: rgba(0, 0, 0, 0.12);
  --border-color-light: rgba(0, 0, 0, 0.06);
  --border-color-dark: rgba(0, 0, 0, 0.24);
}
```

### Tokens en Dark Mode

```css
[data-mode="dark"] {
  --color-primary: #bb86fc;
  --color-primary-light: #d1b3ff;
  --color-primary-dark: #9965f4;
  --color-primary-bg: rgba(187, 134, 252, 0.1);
  --color-primary-hover: rgba(187, 134, 252, 0.15);

  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --bg-tertiary: #2a2a2a;
  --bg-elevated: #2d2d2d;

  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-disabled: #666666;

  --border-color: #333333;
  --border-color-light: #404040;
  --border-color-dark: #505050;
}
```

---

## Uso de Tokens en Componentes

### En SCSS

```scss
// ✅ CORRECTO: Usar CSS custom properties
.my-component {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);

  &:hover {
    background-color: var(--color-primary-hover);
  }

  .title {
    color: var(--color-primary);
  }

  .subtitle {
    color: var(--text-secondary);
  }
}

// ❌ INCORRECTO: Colores hardcodeados
.my-component {
  background-color: #fafafa;     // NO!
  color: #212121;                 // NO!
  border: 1px solid #e0e0e0;     // NO!
}
```

### En Templates (inline styles)

```html
<!-- ✅ CORRECTO -->
<div [style.background-color]="'var(--bg-secondary)'">
  <span [style.color]="'var(--color-primary)'">Texto</span>
</div>

<!-- ❌ INCORRECTO -->
<div style="background-color: #fafafa">
  <span style="color: #673ab7">Texto</span>
</div>
```

---

## Aplicación de Temas

### Estructura del DomThemeApplicator

```typescript
// infrastructure/dom-theme.applicator.ts
@Injectable()
export class DomThemeApplicator implements IThemeApplicator {
  applyTheme(themeId: ThemeId, mode: ThemeMode): void {
    const root = document.documentElement;
    const theme = THEME_DEFINITIONS[themeId];

    // Establecer atributos data-*
    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-mode', mode);

    // Aplicar tokens CSS
    const tokens = mode === 'light' ? theme.light : theme.dark;
    Object.entries(tokens).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  applyFont(fontFamily: FontFamily): void {
    const fontOption = getFontById(fontFamily);
    if (fontOption) {
      document.documentElement.style.setProperty('--font-family-base', fontOption.cssValue);
      document.body.style.fontFamily = fontOption.cssValue;
    }
  }
}
```

### Selectores CSS para Modos

```scss
// Estilos específicos para light mode
html:not([data-mode="dark"]),
[data-mode="light"] {
  .my-component {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

// Estilos específicos para dark mode
html[data-mode="dark"],
[data-mode="dark"] {
  .my-component {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
}
```

---

## Estrategia Responsive

### Breakpoints

El proyecto usa los breakpoints de Bootstrap 5:

| Breakpoint | Clase | Dimensiones | Dispositivos |
|------------|-------|-------------|--------------|
| xs | - | < 576px | Móvil vertical |
| sm | `-sm` | ≥ 576px | Móvil horizontal |
| md | `-md` | ≥ 768px | Tablet |
| lg | `-lg` | ≥ 992px | Desktop |
| xl | `-xl` | ≥ 1200px | Desktop grande |
| xxl | `-xxl` | ≥ 1400px | Pantallas anchas |

### Mobile-First Approach

**Siempre escribir estilos de menor a mayor:**

```scss
// ✅ CORRECTO: Mobile-first
.container {
  padding: 1rem;           // Móvil (default)

  @media (min-width: 768px) {
    padding: 1.5rem;       // Tablet+
  }

  @media (min-width: 1200px) {
    padding: 2rem;         // Desktop+
  }
}

// ❌ INCORRECTO: Desktop-first
.container {
  padding: 2rem;           // Desktop (default)

  @media (max-width: 1199px) {
    padding: 1.5rem;       // Tablet
  }

  @media (max-width: 767px) {
    padding: 1rem;         // Móvil
  }
}
```

### Bootstrap Grid

```html
<!-- Columnas responsive -->
<div class="row">
  <!-- 12 cols en móvil, 6 en tablet, 4 en desktop, 3 en xl -->
  <div class="col-12 col-md-6 col-lg-4 col-xl-3">
    <app-card />
  </div>
</div>

<!-- Ocultar/mostrar elementos -->
<div class="d-none d-md-block">Solo visible en tablet+</div>
<div class="d-md-none">Solo visible en móvil</div>

<!-- Spacing responsive -->
<div class="p-2 p-md-3 p-lg-4">
  Padding que aumenta con el viewport
</div>
```

### Angular CDK BreakpointObserver

Para lógica responsive en componentes:

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({...})
export class MyComponent implements OnInit, OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroy$ = new Subject<void>();

  // Signals para estado responsive
  readonly isMobile = signal(false);
  readonly isTablet = signal(false);
  readonly isDesktop = signal(true);

  ngOnInit(): void {
    // Detectar móvil
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => this.isMobile.set(result.matches));

    // Detectar tablet
    this.breakpointObserver
      .observe([Breakpoints.TabletPortrait, Breakpoints.TabletLandscape])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => this.isTablet.set(result.matches));

    // Detectar desktop
    this.breakpointObserver
      .observe([Breakpoints.Web])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => this.isDesktop.set(result.matches));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Sidebar Responsive

```typescript
// oferente-layout.component.ts
@Component({...})
export class OferenteLayoutComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly sidenavMode = signal<'side' | 'over'>('side');
  readonly sidenavOpened = signal(true);

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.matches) {
          // Móvil/Tablet: sidebar como overlay, cerrado
          this.sidenavMode.set('over');
          this.sidenavOpened.set(false);
        } else {
          // Desktop: sidebar fijo, abierto
          this.sidenavMode.set('side');
          this.sidenavOpened.set(true);
        }
      });
  }

  toggleSidenav(): void {
    this.sidenavOpened.update(v => !v);
  }
}
```

---

## Accesibilidad

### Tamaños de Fuente

```scss
// accessibility.scss
html.font-small {
  font-size: 12px;
}

html.font-normal {
  font-size: 16px;
}

html.font-large {
  font-size: 20px;

  // Ajustar componentes Material
  .mat-toolbar {
    font-size: 20px !important;
    min-height: 72px !important;
  }

  .mat-list-item {
    font-size: 20px !important;
    min-height: 64px !important;
  }

  button {
    font-size: 18px !important;
    padding: 14px 24px !important;
  }
}
```

### Alto Contraste

```scss
html.high-contrast {
  --color-primary: #0000ff;
  --color-accent: #ff0000;

  * {
    border-width: 2px !important;
  }

  body {
    font-weight: 600;
  }

  button, a {
    text-decoration: underline;
    font-weight: 700;
  }

  *:focus,
  *:focus-visible {
    outline: 3px solid #ff0 !important;
    outline-offset: 3px !important;
  }
}
```

### Focus Visible

```scss
// Asegurar focus visible en todos los elementos interactivos
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

// Skip to content link
.skip-to-main {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  z-index: 100;

  &:focus {
    top: 0;
  }
}
```

---

## Archivos de Estilos

### Estructura

```
src/
├── styles.scss                    # Entry point, imports globales
├── styles/
│   └── themes.css                 # Definiciones de temas
└── app/
    └── shared/
        └── styles/
            ├── tokens.css         # CSS custom properties base
            ├── material-theme.scss # Tema de Angular Material
            └── accessibility.scss  # Estilos de accesibilidad
```

### styles.scss (Entry Point)

```scss
// Material Theme (Material 3)
@use './app/shared/styles/material-theme.scss';

// Bootstrap (solo grid y spacing)
@use 'bootstrap/scss/bootstrap-grid' as bootstrap;

// Accessibility
@use './app/shared/styles/accessibility.scss';

// CSS Custom Properties
@import './app/shared/styles/tokens.css';

// Theme System
@import './styles/themes.css';

// Reset
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  margin: 0;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
}
```

### material-theme.scss

```scss
@use '@angular/material' as mat;

@include mat.core();

$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$violet-palette,
    tertiary: mat.$blue-palette,
  ),
  typography: (
    brand-family: 'Roboto, "Helvetica Neue", sans-serif',
    plain-family: 'Roboto, "Helvetica Neue", sans-serif',
  ),
  density: (
    scale: 0,
  )
));

:root {
  @include mat.all-component-themes($theme);
}

// Dark mode
html[data-mode="dark"] {
  $dark-theme: mat.define-theme((
    color: (
      theme-type: dark,
      primary: mat.$violet-palette,
      tertiary: mat.$blue-palette,
    ),
  ));

  @include mat.all-component-colors($dark-theme);
}
```

---

## Best Practices

### 1. Siempre usar tokens

```scss
// ✅ Correcto
color: var(--text-primary);
background: var(--bg-secondary);

// ❌ Incorrecto
color: #212121;
background: #fafafa;
```

### 2. Mobile-first media queries

```scss
// ✅ Correcto: min-width
@media (min-width: 768px) { }

// ❌ Incorrecto: max-width
@media (max-width: 767px) { }
```

### 3. Usar clases de Bootstrap para layout

```html
<!-- ✅ Correcto -->
<div class="row">
  <div class="col-12 col-md-6">...</div>
</div>

<!-- ❌ Incorrecto: CSS grid manual -->
<div style="display: grid; grid-template-columns: repeat(2, 1fr)">
```

### 4. Componentes con ChangeDetectionStrategy.OnPush

```typescript
@Component({
  // ...
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

### 5. Estilos scoped al componente

```typescript
@Component({
  // Estilos encapsulados por defecto
  styleUrl: './my-component.component.scss',
})
```
