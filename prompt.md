Quiero que generes código completo y funcional (Angular 18, standalone components) para la pantalla Branding → Estilo de la App, cuyo primer subcomponente permite elegir el estilo/tema de la app. Usa Angular Material 18 y Bootstrap 5 (los dos están presentes en el proyecto), y respeta un enfoque design-tokens con CSS variables.

Contexto de tokens (usar y extender)

Estos son los tokens base actuales (light) ya presentes. Úsalos como “tema base” y crea overrides por tema y por modo (light/dark) mediante atributos en <html> o <body>: data-theme="..." y data-mode="light|dark". No elimines claves ni cambies nombres; solo redefine valores por tema/mode.

/* CSS Custom Properties - Design Tokens */
:root {
  /* Primary Colors */
  --color-primary: #673ab7;
  --color-primary-light: #9575cd;
  --color-primary-dark: #512da8;
  --color-accent: #ff4081;
  --color-warn: #f44336;
  --color-success: #4caf50;
  --color-info: #2196f3;

  /* Background Colors - Light Theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #e0e0e0;
  --bg-elevated: #ffffff;
  --bg-overlay: rgba(0, 0, 0, 0.5);

  /* Text Colors - Light Theme */
  --text-primary: #212121;
  --text-secondary: #666666;
  --text-disabled: #9e9e9e;
  --text-inverse: #ffffff;

  /* Border Colors */
  --border-color: rgba(0, 0, 0, 0.12);
  --border-color-light: rgba(0, 0, 0, 0.06);
  --border-color-dark: rgba(0, 0, 0, 0.24);

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;

  /* Typography */
  --font-family-base: 'Roboto', 'Helvetica Neue', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-xxl: 1.5rem;
  --font-size-xxxl: 2rem;

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Border Radius */
  --border-radius-none: 0;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-full: 9999px;

  /* Shadows */
  --shadow-none: none;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  --shadow-xl: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

  /* Z-index Layers */
  --z-index-base: 0;
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;

  /* Component-specific Tokens */
  --sidebar-width: 280px;
  --sidebar-width-collapsed: 60px;
  --toolbar-height: 64px;
  --footer-height: 60px;

  /* State Colors */
  --state-hover: rgba(0, 0, 0, 0.04);
  --state-focus: rgba(0, 0, 0, 0.12);
  --state-active: rgba(0, 0, 0, 0.16);
  --state-disabled: rgba(0, 0, 0, 0.38);

  /* Primary Color Variants */
  --color-primary-bg: rgba(103, 58, 183, 0.05);
  --color-primary-hover: rgba(103, 58, 183, 0.1);

  /* Badge/Chip Colors */
  --badge-success: var(--color-success);
  --badge-info: var(--color-info);
  --badge-warning: #ff9800;
  --badge-error: var(--color-warn);
}

Objetivo de la pantalla

Mostrar tarjetas de temas (con nombre e identidad):

Naturaleza (verde)

Océano (azul)

Fuego (rojo)

Carbón (negro/gris)

Nieve (blanco)

Violeta (el actual por defecto)

Cada tarjeta muestra: nombre, mini-preview de colores (primary/accent/bg/text), y un botón “Usar este tema”.

Un toggle global para modo claro/oscuro coherente con cada tema.

Un preview en vivo (panel de la derecha o sección inferior en mobile) que refleje el tema/mode elegido.

Persistencia: guardar data-theme y data-mode en localStorage y rehidratar al cargar (también expone ThemeService para el resto de la app).

Accesibilidad: contratos WCAG AA, foco visible, labels, roles ARIA en el selector.

Requisitos técnicos

Angular 18 standalone (sin NgModule), usa Angular Material (cards, buttons, radio/toggle) y utilidades Bootstrap 5 para layout responsive.

ThemeService:

API: getTheme(), setTheme(themeId), getMode(), setMode('light'|'dark'), applyToDocument().

Aplica data-theme y data-mode en document.documentElement.

Persiste en localStorage (app.theme, app.mode).

ThemeRegistry:

Objeto/const con definición de 6 temas (id, title, description, palette).

Cada tema define colores base: --color-primary, --color-accent, --color-success, --color-info, y overrides de --bg-*, --text-*, --border-*.

Para dark mode de cada tema, define overrides específicos (p.ej. --bg-primary, --text-primary, etc.) compatibles con ese tema.

CSS variables por tema:

Genera un CSS themes.css con bloques:

[data-theme="nature"][data-mode="light"] { ... }

[data-theme="nature"][data-mode="dark"] { ... }

… y así para los 6 temas.

No rompas los nombres de tokens, solo reasigna valores.

Componente UI:

BrandingThemePickerComponent (pantalla): grid responsive (2–3 columnas desktop, 1–2 mobile), barra superior con título y toggle dark.

ThemeCardComponent: muestra preview (mini UI falsa: topbar + chip + botón) usando solo tokens, botón “Usar este tema”.

ThemePreviewPanelComponent: “área de muestra” con un pseudo-layout (header, sidebar, content) que refleja tokens actuales.

Routing: ruta /branding/estilo registrada (standalone), exporta el componente para integrarlo en el menú existente.

Tipado:

ThemeId (union type: 'nature'|'ocean'|'fire'|'carbon'|'snow'|'violet')

ThemeDefinition con campos id, title, subtitle, light: TokenOverrides, dark: TokenOverrides.

TokenOverrides = Record<string, string> (pares var→valor).

Buenas prácticas:

Accesibilidad: aria-pressed en selección, role="radiogroup"/radio si aplica, foco keyboard friendly.

Responsivo: usa CSS grid/flex y breakpoints de Bootstrap, no scroll horizontal.

Código limpio: sin any, sin TODO pendientes, comentarios breves donde aporte.

Incluye unit tests básicos (Jasmine/Karma) para ThemeService (persistencia y aplicación de atributos) y para el pick de tema.

Paletas sugeridas (puedes ajustar levemente para contraste AA)

nature “Naturaleza”: primary #2e7d32, accent #66bb6a, success #4caf50, info #43a047

ocean “Océano”: primary #1565c0, accent #29b6f6, success #26a69a, info #039be5

fire “Fuego”: primary #c62828, accent #ff7043, success #ef6c00, info #ff8a65

carbon “Carbón”: primary #263238, accent #90a4ae, success #455a64, info #78909c

snow “Nieve”: primary #546e7a, accent #cfd8dc, success #90a4ae, info #b0bec5

violet “Violeta” (actual): primary #673ab7, accent #ff4081, success #4caf50, info #2196f3

Para dark mode, ajusta:

--bg-primary ~ #121212 a #1a1a1a según tema

--text-primary ~ #e5e5e5, --text-secondary ~ #b0b0b0

Asegura contraste AA de botones y chips (usa --text-inverse en superficies primary/accent).

Entregables (código completo)

Componentes (standalone)

branding/branding-theme-picker.component.ts/html/scss

branding/components/theme-card.component.ts/html/scss

branding/components/theme-preview-panel.component.ts/html/scss

Servicios y registro

branding/services/theme.service.ts

branding/services/theme.registry.ts (definiciones y helpers)

branding/styles/themes.css (bloques por [data-theme][data-mode])

Routing

branding/branding.routes.ts con ruta /branding/estilo

Tests

theme.service.spec.ts (persistencia, aplicación de atributos, defaults)

Smoke tests para branding-theme-picker.component

Integración

Hook de restauración en main.ts o app.component.ts para aplicar tema/mode guardado antes del bootstrap (evitar flash).

README corto en branding/README.md con cómo agregar nuevos temas.

i18n listo

Texto visible (títulos, botones) centralizado (simple: objeto BRANDING_I18N en el componente) para luego conectar con ngx-translate.

Criterios de aceptación

Puedo alternar entre los 6 temas y ver el preview actualizar en vivo.

El modo claro/oscuro alterna y se persiste (recargo y mantiene).

Se aplican data-theme y data-mode en <html>.

Sin estilos en línea: todo via tokens CSS.

Contraste AA mínimo en botones y texto primario.

Layout responsive: 1 col (≤576px), 2–3 cols (≥768px).

El código viene completo, con imports, providers y rutas listos, sin dependencias faltantes.

Notas de implementación

No uses librerías de theming externas: solo CSS variables.

Usa Material para controles (toggle, botones, chips) y deja el preview en un card con superficie --bg-elevated.

El ThemePreviewPanel debe usar únicamente tokens (var(--...)), para demostrar que el theming afecta toda la UI.

Incluye una función utilitaria en ThemeService para calcular --color-primary-light/dark si la paleta sólo da --color-primary, con un ajuste HSL (clamp de luminancia) para coherencia entre temas.

Genera ahora todos los archivos indicados, con código Angular 18 standalone, pruebas, y estilos listos para usar.