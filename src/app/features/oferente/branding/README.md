# Branding Module - Theme System

Sistema de temas personalizable basado en CSS Custom Properties (design tokens).

## Características

- ✅ 6 temas predefinidos (Naturaleza, Océano, Fuego, Carbón, Nieve, Violeta)
- ✅ Modo claro/oscuro para cada tema
- ✅ Persistencia automática en localStorage
- ✅ Vista previa en vivo
- ✅ Aplicación instantánea de cambios
- ✅ 100% basado en CSS variables (sin estilos inline)
- ✅ Accesibilidad WCAG AA

## Estructura de Archivos

```
branding/
├── models/
│   └── theme.types.ts          # Tipos e interfaces
├── services/
│   ├── theme.service.ts        # Servicio principal de temas
│   └── theme.registry.ts       # Registro de temas disponibles
├── components/
│   ├── theme-card.component.ts           # Tarjeta de tema
│   └── theme-preview-panel.component.ts  # Panel de vista previa
├── styles/
│   └── themes.css              # Estilos específicos por tema
├── branding-theme-picker.component.ts    # Página principal
├── branding.routes.ts          # Configuración de rutas
└── README.md                   # Este archivo
```

## Uso

### Acceder a la página

Navega a: `/oferente/branding/estilo`

O click en el menú lateral: **Branding → Estilo de la Aplicación**

### Cambiar tema programáticamente

```typescript
import { ThemeService } from './features/oferente/branding/services/theme.service';

constructor(private themeService: ThemeService) {}

// Cambiar tema
this.themeService.setTheme('ocean');

// Cambiar modo
this.themeService.setMode('dark');

// Toggle dark mode
this.themeService.toggleMode();

// Obtener tema actual
const currentTheme = this.themeService.getTheme();
const currentMode = this.themeService.getMode();
```

## Agregar un Nuevo Tema

### 1. Actualizar tipos

En `models/theme.types.ts`, agrega el ID al tipo:

```typescript
export type ThemeId = 'nature' | 'ocean' | 'fire' | 'carbon' | 'snow' | 'violet' | 'miTema';
```

### 2. Definir paleta en registry

En `services/theme.registry.ts`, agrega la definición:

```typescript
export const THEME_DEFINITIONS: Record<ThemeId, ThemeDefinition> = {
  // ... temas existentes
  miTema: {
    id: 'miTema',
    title: 'Mi Tema Personalizado',
    subtitle: 'Descripción del tema',
    icon: 'star', // Material Icon name
    light: {
      '--color-primary': '#YOUR_COLOR',
      '--color-accent': '#YOUR_ACCENT',
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f5f5f5',
      '--text-primary': '#212121',
      '--text-secondary': '#666666',
      // ... más tokens
    },
    dark: {
      '--color-primary': '#YOUR_COLOR_DARK',
      '--color-accent': '#YOUR_ACCENT_DARK',
      '--bg-primary': '#121212',
      '--bg-secondary': '#1e1e1e',
      '--text-primary': '#ffffff',
      '--text-secondary': '#b3b3b3',
      // ... más tokens
    },
  },
};
```

### 3. (Opcional) Agregar estilos estructurales

En `styles/themes.css`, agrega overrides específicos si es necesario:

```css
[data-theme="miTema"] {
  --border-radius-md: 12px;
  /* overrides estructurales */
}
```

## Tokens CSS Disponibles

### Colores
- `--color-primary`, `--color-primary-light`, `--color-primary-dark`
- `--color-accent`, `--color-success`, `--color-info`, `--color-warn`

### Fondos
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-elevated`

### Textos
- `--text-primary`, `--text-secondary`, `--text-disabled`, `--text-inverse`

### Bordes
- `--border-color`, `--border-color-light`, `--border-color-dark`

### Estados
- `--state-hover`, `--state-focus`, `--state-active`

### Variantes Primary
- `--color-primary-bg`, `--color-primary-hover`

Ver archivo completo en: `src/app/shared/styles/tokens.css`

## Testing

```bash
# Ejecutar tests
ng test

# Tests específicos
ng test --include='**/theme.service.spec.ts'
```

## Persistencia

El tema y modo se guardan automáticamente en localStorage:
- `app.theme`: ID del tema actual
- `app.mode`: Modo actual ('light' | 'dark')

La restauración es automática al recargar la página.

## Accesibilidad

- ✅ Contraste WCAG AA en todos los temas
- ✅ Navegación por teclado completa
- ✅ ARIA labels y roles apropiados
- ✅ Focus visible en todos los elementos interactivos
- ✅ Soporte para `prefers-reduced-motion`
- ✅ Soporte para `prefers-contrast: high`

## Integración con Material Design

El sistema aplica automáticamente los colores a componentes Material:
- Buttons, Cards, Toolbars
- Form fields, Selects, Inputs
- Menus, Dialogs, Snackbars
- Lists, Tables, Chips

## Notas Técnicas

- Los tokens se aplican programáticamente desde `ThemeService`
- Las transiciones son suaves (300ms) pero respetan `prefers-reduced-motion`
- El sistema usa `data-theme` y `data-mode` en `<html>` para especificidad CSS
- Compatible con SSR (Server-Side Rendering)
- Sin dependencias externas de theming

## Soporte

Para reportar bugs o sugerir mejoras:
1. Crea un issue en el repositorio
2. Incluye capturas de pantalla si es relevante
3. Especifica navegador y versión

---

**Desarrollado con Angular 18 + Material Design 3**
