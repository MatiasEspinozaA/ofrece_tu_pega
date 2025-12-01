# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANTE**: Claude DEBE seguir la arquitectura y patrones documentados.
> Consultar `docs/` para información detallada.

---

## Quick Reference

```bash
npm start              # Dev server → http://localhost:4200/
npm run build          # Production build
npm test               # Unit tests (Karma)
npm run lint           # ESLint
```

## Stack

- **Angular 20** (Standalone Components)
- **Angular Material 20** (Material Design 3)
- **Bootstrap 5** (solo grid/spacing)
- **TypeScript 5.9**
- **Angular Signals** (NO NgRx)

---

## Documentación Detallada

| Documento | Contenido |
|-----------|-----------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Clean Architecture, 4 capas, estructura de features |
| [docs/PATTERNS.md](docs/PATTERNS.md) | Singleton, Repository, Facade, Signal State, Mapper |
| [docs/COMPONENTS.md](docs/COMPONENTS.md) | Atomic Design, componentes compartidos, reutilización |
| [docs/STYLING.md](docs/STYLING.md) | Theming, CSS tokens, responsive, accesibilidad |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Features pendientes, tareas técnicas, prioridades |
| [docs/DELIVERY-CHECKLIST.md](docs/DELIVERY-CHECKLIST.md) | Criterios de entrega, checklist de calidad |

---

## Arquitectura (Resumen)

### Clean Architecture por Feature

```
src/app/features/oferente/<feature>/
├── domain/           # Entities + Ports (interfaces puras)
├── application/      # Use Cases (lógica de negocio)
├── infrastructure/   # Repositories HTTP + Mappers + DTOs
└── presentation/     # Store + Facade + Page + Routes
```

### Reglas de Dependencia

| Capa | Puede importar | NO puede importar |
|------|----------------|-------------------|
| Domain | Nada | Application, Infrastructure, Presentation |
| Application | Domain | Infrastructure, Presentation |
| Infrastructure | Domain | Application, Presentation |
| Presentation | Domain, Application | Infrastructure (solo via DI) |

### Signal State Pattern

```typescript
// Store
private readonly state = signal<State>(initial);
readonly items = computed(() => this.state().items);

// Facade
readonly vm = { items: this.store.items, loading: this.store.loading };
```

---

## Componentes (Atomic Design)

```
shared/
├── atoms/        # Button, Badge, Icon, Spinner
├── molecules/    # SearchBox, StatCard, FormField
├── organisms/    # CrudTable, CrudFormDialog
└── templates/    # OferenteLayout
```

**Reutilizar antes de crear:**
- `CrudTableComponent` → Tablas con CRUD
- `CrudFormDialogComponent` → Formularios en diálogo

---

## Styling

### CSS Custom Properties (OBLIGATORIO)

```scss
// ✅ Correcto
color: var(--text-primary);
background: var(--bg-secondary);

// ❌ Incorrecto
color: #212121;
background: #fafafa;
```

### Responsive (Mobile-First)

```html
<div class="col-12 col-md-6 col-lg-4">
```

### Temas: 8 disponibles (violet, nature, ocean, fire, carbon, snow, sunshine, sunset)

---

## Features Status

### Completadas
- ✅ Dashboard (4 capas, responsive, dark mode)
- ✅ Products (CRUD completo)
- ✅ Branding (8 temas, 5 fuentes)
- ✅ Layout (sidebar responsive)

### Pendientes (Alta Prioridad)
- ⏳ Services
- ⏳ News
- ⏳ Contacts

### Pendientes (Media/Baja)
- Gallery, Analytics, Space, Profile, Settings, Subscription, Help

---

## Crear Nueva Feature

### 1. Estructura
```bash
mkdir -p src/app/features/oferente/<feature>/{domain,application,infrastructure,presentation}
```

### 2. Domain
```typescript
// entities.ts - Interfaces puras con readonly
// ports.ts - IRepository + InjectionToken
```

### 3. Application
```typescript
// list-*.use-case.ts - Un archivo por use case
```

### 4. Infrastructure
```typescript
// *.dto.ts, mappers.ts, http-*.repository.ts
```

### 5. Presentation
```typescript
// *.store.ts, *.facade.ts, *.page.ts, routes.ts
```

### 6. Registrar ruta
```typescript
// oferente.routes.ts
{ path: '<feature>', loadChildren: () => import('./<feature>/presentation/routes').then(m => m.ROUTES) }
```

---

## Checklist de Entrega

Antes de considerar una feature **COMPLETA**:

- [ ] Estructura 4 capas
- [ ] Store con signal/computed
- [ ] Facade con vm
- [ ] Page usa solo Facade
- [ ] Responsive (mobile/tablet/desktop)
- [ ] Light + Dark mode
- [ ] Sin colores hardcodeados
- [ ] npm run lint OK
- [ ] Sin errores TypeScript
- [ ] Loading/Error/Empty states

**Ver checklist completo:** [docs/DELIVERY-CHECKLIST.md](docs/DELIVERY-CHECKLIST.md)

---

## Naming Conventions

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Entidades | `entities.ts` | `domain/entities.ts` |
| Puertos | `ports.ts` | `domain/ports.ts` |
| Use Case | `verb-noun.use-case.ts` | `list-products.use-case.ts` |
| Repository | `http-*.repository.ts` | `http-product.repository.ts` |
| Store | `*.store.ts` | `products.store.ts` |
| Facade | `*.facade.ts` | `products.facade.ts` |
| Page | `*.page.ts` | `products.page.ts` |
| Selector | `app-*` | `app-products-page` |

---

> **RECORDATORIO**: Siempre consultar `docs/` para guías detalladas.
> Reutilizar componentes existentes. Verificar checklist antes de entregar.
