# Checklist de Entrega

Este documento define los criterios que debe cumplir una feature antes de considerarse **COMPLETA**.

---

## Checklist Completo

### 1. Arquitectura

- [ ] **Estructura de carpetas correcta**
  ```
  feature/
  ├── domain/
  │   ├── entities.ts
  │   └── ports.ts
  ├── application/
  │   └── *.use-case.ts
  ├── infrastructure/
  │   ├── *.dto.ts
  │   ├── http-*.repository.ts
  │   └── mappers.ts
  └── presentation/
      ├── *.store.ts
      ├── *.facade.ts
      ├── *.page.ts
      └── routes.ts
  ```

- [ ] **Domain Layer**
  - [ ] Entidades son interfaces puras (solo `readonly` properties)
  - [ ] Sin imports de Angular en entities.ts
  - [ ] Puerto (interface) definido para cada repository
  - [ ] InjectionToken exportado para cada puerto

- [ ] **Application Layer**
  - [ ] Un archivo por use case
  - [ ] Cada use case tiene método `execute()`
  - [ ] Use cases inyectan repositorios via tokens
  - [ ] Sin lógica de UI en use cases

- [ ] **Infrastructure Layer**
  - [ ] DTOs representan estructura de API
  - [ ] Mapper con métodos `toDomain()` y `toDTO()`
  - [ ] Repository implementa la interface del Domain
  - [ ] Mock data con `delay()` para simular latencia

- [ ] **Presentation Layer**
  - [ ] Store usa `signal()` privado + `computed()` públicos
  - [ ] Facade expone `vm` (ViewModel) con signals del store
  - [ ] Facade orquesta use cases
  - [ ] Page inyecta solo el Facade (no servicios directamente)
  - [ ] Routes tiene providers scoped correctamente

---

### 2. Componentes

- [ ] **Page Component**
  - [ ] Selector: `app-<feature>-page`
  - [ ] Archivo: `*.page.ts`
  - [ ] Usa Facade para datos y acciones
  - [ ] Maneja estados: loading, error, empty, data

- [ ] **Reutilización**
  - [ ] Usa `CrudTableComponent` si aplica
  - [ ] Usa `CrudFormDialogComponent` si aplica
  - [ ] Usa `EmptyStateComponent` para estados vacíos
  - [ ] NO crea componentes que ya existen en shared/

- [ ] **Componentes específicos**
  - [ ] Ubicados en `presentation/components/`
  - [ ] Son "dumb components" (sin lógica de negocio)
  - [ ] Usan `ChangeDetectionStrategy.OnPush`

---

### 3. Responsive

- [ ] **Mobile (< 768px)**
  - [ ] Layout se adapta correctamente
  - [ ] Tablas tienen scroll horizontal o vista alternativa
  - [ ] Botones tienen tamaño touch-friendly (min 44px)
  - [ ] Formularios ocupan ancho completo

- [ ] **Tablet (768px - 991px)**
  - [ ] Grid se ajusta (col-md-*)
  - [ ] Sidebar puede ocultarse

- [ ] **Desktop (>= 992px)**
  - [ ] Aprovecha el espacio horizontal
  - [ ] Sidebar visible por defecto

- [ ] **Clases utilizadas**
  - [ ] Usa Bootstrap grid (`row`, `col-*`)
  - [ ] Mobile-first (`col-12 col-md-6 col-lg-4`)
  - [ ] Spacing responsive (`p-2 p-md-3 p-lg-4`)

---

### 4. Theming

- [ ] **CSS Custom Properties**
  - [ ] Usa `var(--color-primary)` para colores
  - [ ] Usa `var(--bg-secondary)` para backgrounds
  - [ ] Usa `var(--text-primary)` para texto
  - [ ] NO tiene colores hardcodeados (#fff, #000, etc.)

- [ ] **Light Mode**
  - [ ] Textos legibles
  - [ ] Contraste adecuado
  - [ ] Iconos visibles

- [ ] **Dark Mode**
  - [ ] Textos legibles
  - [ ] Backgrounds correctos
  - [ ] Bordes visibles
  - [ ] Sin "flashes" blancos

---

### 5. Accesibilidad

- [ ] **Semántica HTML**
  - [ ] Usa elementos semánticos (`<header>`, `<main>`, `<nav>`, etc.)
  - [ ] Headings en orden (`h1` > `h2` > `h3`)
  - [ ] Listas para grupos de items

- [ ] **ARIA**
  - [ ] Botones de solo icono tienen `aria-label`
  - [ ] Regiones tienen `role` si necesario
  - [ ] Estados dinámicos con `aria-live`

- [ ] **Navegación por teclado**
  - [ ] Todos los elementos interactivos son focusables
  - [ ] Tab order lógico
  - [ ] Focus visible en todos los elementos

- [ ] **Contraste**
  - [ ] Texto normal: ratio mínimo 4.5:1
  - [ ] Texto grande: ratio mínimo 3:1
  - [ ] Verificar con herramienta de contraste

---

### 6. Código

- [ ] **TypeScript**
  - [ ] Sin errores de compilación
  - [ ] Sin `any` innecesarios
  - [ ] Interfaces para tipos públicos
  - [ ] `readonly` en propiedades de entidades

- [ ] **ESLint**
  - [ ] `npm run lint` pasa sin errores
  - [ ] Sin warnings ignorados sin justificación

- [ ] **Naming**
  - [ ] Archivos: `kebab-case`
  - [ ] Clases: `PascalCase`
  - [ ] Variables/métodos: `camelCase`
  - [ ] Constantes: `SCREAMING_SNAKE_CASE`

- [ ] **Imports**
  - [ ] Organizados (Angular > RxJS > Material > Local)
  - [ ] Sin imports no utilizados
  - [ ] Paths relativos dentro del feature

---

### 7. UX

- [ ] **Loading States**
  - [ ] Muestra spinner o skeleton durante carga
  - [ ] Feedback visual en acciones (crear, editar, eliminar)

- [ ] **Error States**
  - [ ] Muestra mensaje de error claro
  - [ ] Opción de reintentar si aplica
  - [ ] NO muestra errores técnicos al usuario

- [ ] **Empty States**
  - [ ] Mensaje amigable cuando no hay datos
  - [ ] Call-to-action para crear primer item

- [ ] **Confirmaciones**
  - [ ] Confirmar antes de eliminar
  - [ ] Feedback de éxito después de acciones

---

## Checklist Rápido (Copy-Paste)

```markdown
## Feature: [NOMBRE]

### Arquitectura
- [ ] Estructura 4 capas completa
- [ ] Entidades puras en domain
- [ ] Puerto con InjectionToken
- [ ] Use cases con execute()
- [ ] Repository implementa puerto
- [ ] Mappers DTO <-> Entity
- [ ] Store con signal/computed
- [ ] Facade con vm y métodos
- [ ] Routes con providers scoped

### Componentes
- [ ] Page usa solo Facade
- [ ] Reutiliza CrudTable/CrudForm si aplica
- [ ] ChangeDetectionStrategy.OnPush

### Responsive
- [ ] Mobile OK (< 768px)
- [ ] Tablet OK (768-991px)
- [ ] Desktop OK (>= 992px)

### Theming
- [ ] Usa CSS custom properties
- [ ] Light mode OK
- [ ] Dark mode OK

### Accesibilidad
- [ ] aria-labels en botones icono
- [ ] Tab navigation funciona
- [ ] Contraste adecuado

### Código
- [ ] npm run lint OK
- [ ] Sin errores TypeScript
- [ ] Sin any innecesarios

### UX
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Confirmación en delete
```

---

## Proceso de Review

### 1. Auto-review

Antes de marcar como completo, el desarrollador debe:

1. Ejecutar `npm run lint` y corregir errores
2. Ejecutar `npm run build` y verificar que compila
3. Probar en Chrome DevTools con responsive
4. Probar toggle de dark mode
5. Navegar con Tab por toda la feature
6. Verificar que el checklist está completo

### 2. Code Review

El reviewer debe verificar:

1. **Arquitectura**: Capas correctas, sin dependencias invertidas
2. **Reutilización**: Usa componentes existentes cuando aplica
3. **Patrones**: Sigue los patrones documentados
4. **Performance**: Sin memory leaks, OnPush donde aplica

### 3. QA

Testing manual debe incluir:

1. **Happy path**: Flujo completo funciona
2. **Edge cases**: Datos vacíos, errores de red
3. **Responsive**: Todos los breakpoints
4. **Theming**: Light y dark mode
5. **Accesibilidad**: Navegación por teclado

---

## Definición de "Done"

Una feature se considera **DONE** cuando:

1. ✅ Todos los items del checklist están marcados
2. ✅ Code review aprobado
3. ✅ QA testing pasado
4. ✅ Sin bugs conocidos bloqueantes
5. ✅ Documentación actualizada (si aplica)
6. ✅ Ruta registrada en `oferente.routes.ts`
7. ✅ Item de menú agregado (si aplica)

---

## Criterios de Calidad

### Código Limpio

```typescript
// ✅ Bien
readonly products = computed(() => this.state().products);

setProducts(products: Product[]): void {
  this.state.update(s => ({ ...s, products, error: null }));
}

// ❌ Mal
products: any;

setProducts(p) {
  this.products = p;
}
```

### Manejo de Errores

```typescript
// ✅ Bien
loadProducts(): void {
  this.store.setLoading(true);
  this.listUseCase.execute().subscribe({
    next: products => {
      this.store.setProducts(products);
      this.store.setLoading(false);
    },
    error: err => {
      this.store.setError('No se pudieron cargar los productos');
      console.error('Error loading products:', err);
    },
  });
}

// ❌ Mal
loadProducts(): void {
  this.listUseCase.execute().subscribe(products => {
    this.store.setProducts(products);
  });
  // Sin manejo de loading ni errores
}
```

### Responsive

```html
<!-- ✅ Bien: Mobile-first -->
<div class="col-12 col-md-6 col-lg-4">

<!-- ❌ Mal: Desktop-first o fixed -->
<div style="width: 400px">
```

### Theming

```scss
// ✅ Bien
.card {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

// ❌ Mal
.card {
  background: #fafafa;
  color: #212121;
  border: 1px solid #e0e0e0;
}
```
