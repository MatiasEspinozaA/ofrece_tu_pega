# Guía de Estructura de Componentes

## Propósito

Este documento establece los estándares para la estructura de archivos de componentes Angular en el proyecto. Seguir estas convenciones asegura consistencia, mantenibilidad y facilita la colaboración en equipo.

## Reglas Principales

### 1. Estructura de Archivos

**TODOS los componentes, páginas o cualquier elemento con parte frontal (UI) DEBEN:**

- **Estar en su propia carpeta** con el nombre del componente
- **Tener 4 archivos separados:**
  1. **`.component.ts`** - Lógica del componente
  2. **`.component.html`** - Template/Plantilla
  3. **`.component.scss`** - Estilos
  4. **`.component.spec.ts`** - Pruebas unitarias

### 2. Organización en Carpetas

Cada componente DEBE estar en su propia carpeta con el nombre del componente en kebab-case.

## ❌ MAL - Archivos Sueltos y Templates Inline

**NUNCA** hagas esto:

```
components/
├── ejemplo.component.ts       ❌ Archivos sueltos
├── ejemplo.component.html
├── ejemplo.component.scss
├── otro.component.ts          ❌ Mezclados sin carpetas
└── otro.component.html
```

**NUNCA** uses templates o estilos inline:

```typescript
@Component({
  selector: 'app-ejemplo',
  standalone: true,
  template: `<div class="container">...</div>`,  ❌ Template inline
  styles: [`.container { padding: 20px; }`]      ❌ Estilos inline
})
export class EjemploComponent {}
```

## ✅ BIEN - Archivos Separados

La estructura correcta es:

```
mi-componente/
├── mi-componente.component.ts       # Lógica del componente
├── mi-componente.component.html     # Template HTML
├── mi-componente.component.scss     # Estilos SCSS
├── mi-componente.component.spec.ts  # Pruebas unitarias
└── mi-componente.types.ts          # (Opcional) Tipos e interfaces
```

### Archivo TypeScript (.ts)

```typescript
/**
 * Mi Componente
 * Descripción breve del propósito del componente
 */

import { Component, OnInit } from '@angular/core';
// ... otros imports

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [
    // ... módulos importados
  ],
  templateUrl: './mi-componente.component.html',
  styleUrl: './mi-componente.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Recomendado
})
export class MiComponente implements OnInit {
  // Lógica del componente
}
```

### Archivo HTML (.html)

```html
<div class="mi-componente">
  <h1>{{ titulo }}</h1>
  <p>{{ descripcion }}</p>
</div>
```

### Archivo SCSS (.scss)

```scss
:host {
  display: block;
}

.mi-componente {
  padding: var(--spacing-md);

  h1 {
    color: var(--text-primary);
  }
}
```

### Archivo de Pruebas (.spec.ts)

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiComponente } from './mi-componente.component';

describe('MiComponente', () => {
  let component: MiComponente;
  let fixture: ComponentFixture<MiComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(MiComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Más pruebas...
});
```

## Beneficios de Esta Estructura

### 1. **Separación de Responsabilidades**
- Cada archivo tiene un propósito único y claro
- Facilita encontrar y modificar código específico

### 2. **Mejor Mantenibilidad**
- Los archivos son más pequeños y manejables
- Cambios en estilos no requieren tocar la lógica

### 3. **Colaboración en Equipo**
- Menos conflictos de merge en Git
- Múltiples desarrolladores pueden trabajar en el mismo componente

### 4. **Reutilización**
- Templates y estilos pueden compartirse más fácilmente
- Facilita la creación de bibliotecas de componentes

### 5. **Testing**
- Pruebas aisladas y bien organizadas
- Fácil identificar qué está siendo probado

### 6. **Herramientas de Desarrollo**
- Mejor soporte de IDEs (autocompletado, syntax highlighting)
- Linters y formatters funcionan mejor

### 7. **Performance en Desarrollo**
- Hot reload más rápido en archivos individuales
- Menos trabajo para el compilador de TypeScript

## Convenciones de Nomenclatura

### Nombres de Archivos

- **Componentes**: `nombre-componente.component.{ts,html,scss,spec.ts}`
- **Directivas**: `nombre-directiva.directive.{ts,spec.ts}`
- **Servicios**: `nombre-servicio.service.{ts,spec.ts}`
- **Pipes**: `nombre-pipe.pipe.{ts,spec.ts}`

### Selectores

- Usar prefijo consistente: `app-`, `oferente-`, etc.
- Kebab-case: `app-mi-componente`

## Casos Especiales

### Componentes Muy Simples

Incluso para componentes simples (5-10 líneas de template), SIEMPRE separar en archivos.

**Razón**: Los componentes tienden a crecer con el tiempo. Empezar con la estructura correcta ahorra refactoring futuro.

### Componentes de Presentación Puros

Aunque sean solo para mostrar datos, deben seguir la misma estructura:

```
user-card/
├── user-card.component.ts
├── user-card.component.html
├── user-card.component.scss
└── user-card.component.spec.ts
```

## Migración de Componentes Existentes

Si encuentras componentes con templates/estilos inline:

1. **Crear archivo HTML**: Copiar el template del decorator
2. **Crear archivo SCSS**: Copiar los estilos del decorator
3. **Crear archivo SPEC**: Añadir pruebas básicas
4. **Actualizar TS**: Cambiar `template` por `templateUrl` y `styles` por `styleUrl`

### Ejemplo de Migración

**Antes:**
```typescript
@Component({
  selector: 'app-ejemplo',
  template: `<h1>Hola</h1>`,
  styles: [`h1 { color: red; }`]
})
```

**Después:**
```typescript
@Component({
  selector: 'app-ejemplo',
  templateUrl: './ejemplo.component.html',
  styleUrl: './ejemplo.component.scss'
})
```

## Checklist para Nuevos Componentes

Antes de crear un pull request, verifica:

- [ ] El componente está en su propia carpeta con nombre kebab-case
- [ ] Existe archivo `.component.ts`
- [ ] Existe archivo `.component.html`
- [ ] Existe archivo `.component.scss`
- [ ] Existe archivo `.component.spec.ts`
- [ ] El componente usa `templateUrl` (no `template`)
- [ ] El componente usa `styleUrl` (no `styles`)
- [ ] Los imports usan rutas relativas correctas
- [ ] Las pruebas básicas pasan
- [ ] El componente tiene documentación (comentario JSDoc)

## Archivos Auxiliares Opcionales

Además de los 4 archivos obligatorios, puedes incluir:

- **`.types.ts`**: Interfaces y tipos específicos del componente
- **`.constants.ts`**: Constantes y configuraciones
- **`.service.ts`**: Servicio dedicado si el componente lo requiere
- **`.module.ts`**: Solo para componentes no standalone

## Estructura de Directorios

### Componentes Simples

**Cada componente en su propia carpeta:**

```
components/
└── button/
    ├── button.component.ts       ✅ En carpeta propia
    ├── button.component.html     ✅ Separado
    ├── button.component.scss     ✅ Separado
    └── button.component.spec.ts  ✅ Con tests

card/
├── card.component.ts
├── card.component.html
├── card.component.scss
└── card.component.spec.ts
```

### Componentes Complejos (con sub-componentes)

```
branding/
├── branding-theme-picker/              ✅ Componente principal en carpeta
│   ├── branding-theme-picker.component.ts
│   ├── branding-theme-picker.component.html
│   ├── branding-theme-picker.component.scss
│   └── branding-theme-picker.component.spec.ts
├── components/                         ✅ Sub-componentes en su carpeta
│   ├── theme-card/
│   │   ├── theme-card.component.ts
│   │   ├── theme-card.component.html
│   │   ├── theme-card.component.scss
│   │   └── theme-card.component.spec.ts
│   └── theme-preview/
│       ├── theme-preview.component.ts
│       ├── theme-preview.component.html
│       ├── theme-preview.component.scss
│       └── theme-preview.component.spec.ts
├── services/                           ✅ Servicios compartidos
│   └── theme.service.ts
└── models/                             ✅ Modelos compartidos
    └── theme.types.ts
```

### Layouts

```
layouts/
└── oferente-layout/
    ├── oferente-layout.component.ts
    ├── oferente-layout.component.html
    ├── oferente-layout.component.scss
    ├── oferente-layout.component.spec.ts
    └── oferente-layout.types.ts        ✅ Tipos opcionales
```

## Herramientas

### Angular CLI

Genera componentes con la estructura correcta automáticamente:

```bash
ng generate component features/mi-feature/mi-componente
# o
ng g c features/mi-feature/mi-componente
```

Esto crea automáticamente:
- Una carpeta `mi-componente/`
- Los 4 archivos necesarios (.ts, .html, .scss, .spec.ts)
- Con `templateUrl` y `styleUrl` configurados correctamente

**Ejemplo real:**
```bash
ng g c features/oferente/branding/components/theme-card
```

Crea:
```
components/
└── theme-card/
    ├── theme-card.component.ts
    ├── theme-card.component.html
    ├── theme-card.component.scss
    └── theme-card.component.spec.ts
```

### Scripts de Validación

Puedes agregar un script para validar la estructura:

```json
{
  "scripts": {
    "validate:structure": "node scripts/validate-component-structure.js"
  }
}
```

## Referencias

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Component Structure Best Practices](https://angular.io/guide/component-overview)

## Preguntas Frecuentes

### ¿Puedo dejar los archivos sueltos sin carpeta para componentes pequeños?

**No.** TODOS los componentes deben estar en su propia carpeta, sin importar su tamaño.

### ¿Puedo usar templates inline para componentes muy pequeños?

**No.** Aunque el template sea de 1 línea, debe estar en un archivo `.html` separado dentro de la carpeta del componente.

### ¿Qué pasa con componentes legacy que están sueltos?

Deben ser refactorizados a la estructura correcta (carpeta individual) cuando se modifiquen.

### ¿Es obligatorio el archivo .spec.ts?

**Sí.** Aunque no escribas pruebas inmediatamente, el archivo debe existir con al menos la prueba básica de creación.

### ¿Puedo usar .css en lugar de .scss?

Se recomienda usar `.scss` para aprovechar las características de Sass (variables, anidación, mixins).

### ¿Cómo nombro la carpeta del componente?

Usa kebab-case y el mismo nombre que el componente sin el sufijo `.component`:
- Componente: `UserProfileComponent`
- Carpeta: `user-profile/`
- Archivos: `user-profile.component.{ts,html,scss,spec.ts}`

---

**Última actualización**: 2025-10-18
**Autor**: Equipo de Desarrollo

**Esta guía es obligatoria para todos los componentes del proyecto.**
