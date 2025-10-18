# Ofrece Tu Pega

Proyecto Angular 20 con arquitectura Clean por features, usando standalone components, Angular Material 3, y Angular Signals para estado.

## Stack Tecnológico

- **Angular 20** (Standalone Components)
- **Angular Material 20** con Material Design 3
- **Bootstrap 5** (solo grid/spacing)
- **Angular Signals** para estado (sin NgRx)
- **TypeScript 5.9**
- **SCSS** para estilos
- **ESLint** para linting

## Características Principales

- Arquitectura Clean por features (domain, application, infrastructure, presentation)
- Estado reactivo con Angular Signals
- Componentes standalone
- Providers scoped por ruta
- Design tokens con CSS custom properties
- Tema único de Material 3 con soporte dark mode
- **Accesibilidad WCAG 2.1 AA completa** (dark mode, alto contraste, tamaño de texto)
- Feature "products" completa como ejemplo
- Layout del oferente con sidebar responsive y toolbar

## Instalación

```bash
# Instalar dependencias
npm install
```

## Ejecución

```bash
# Servidor de desarrollo
npm start

# O con Angular CLI
ng serve
```

Navega a `http://localhost:4200/` para ver la aplicación. La app se recargará automáticamente cuando modifiques archivos.

## Scripts Disponibles

```bash
# Desarrollo
npm start                    # Inicia servidor de desarrollo

# Build
npm run build               # Build de producción
npm run watch               # Build en modo watch

# Testing
npm test                    # Ejecuta tests unitarios

# Linting
npm run lint                # Ejecuta ESLint
```

## Estructura del Proyecto

```
src/app/
├── core/                   # Configuración global
│   ├── app.config.ts
│   └── app.routes.ts
├── shared/                 # Recursos compartidos
│   ├── ui/shell/          # Layout principal
│   └── styles/            # Estilos y tokens globales
└── features/              # Features por dominio
    └── products/          # Feature de ejemplo
        ├── domain/        # Entidades y puertos
        ├── application/   # Casos de uso
        ├── infrastructure/# Adapters (HTTP, mappers)
        └── presentation/  # UI (components, store, facade)
```

Para más detalles sobre la arquitectura, consulta [ARCHITECTURE.md](./ARCHITECTURE.md).

## Feature de Ejemplo: Products

El proyecto incluye una feature completa de "products" que demuestra:

- **Domain Layer**: Entidades (Product) y puertos (IProductRepository)
- **Application Layer**: Casos de uso (list, get, create, update)
- **Infrastructure Layer**: HttpProductRepository con datos mock
- **Presentation Layer**:
  - ProductsPageComponent con Material UI
  - ProductsStore usando Angular Signals
  - ProductsFacade para simplificar interacciones
  - Rutas con providers scoped

## Arquitectura Clean

El proyecto sigue principios de Clean Architecture:

1. **Separación de capas**: domain → application → infrastructure → presentation
2. **Dependency Inversion**: Las capas internas no conocen las externas
3. **Testabilidad**: Cada capa se puede testear independientemente
4. **Mantenibilidad**: Código organizado y predecible
5. **Escalabilidad**: Fácil agregar nuevas features

## Estado con Signals

En lugar de NgRx, usamos Angular Signals:

```typescript
// Store
private readonly state = signal<State>(initialState);
readonly products = computed(() => this.state().products);

// Facade
readonly vm = {
  products: this.store.products,
  loading: this.store.loading,
};

// Component template
@if (facade.vm.products()) {
  @for (product of facade.vm.products(); track product.id) {
    <!-- ... -->
  }
}
```

## Estilos

- **Material Theme**: Tema único en `shared/styles/material-theme.scss`
- **Design Tokens**: Variables CSS en `shared/styles/tokens.css`
- **Bootstrap Grid**: Solo sistema de grid y utilities
- **Component Styles**: Scoped con ViewEncapsulation

## ESLint

El proyecto usa angular-eslint para mantener código consistente:

```bash
npm run lint
```

## Testing

```bash
# Tests unitarios
npm test

# Tests con cobertura
ng test --code-coverage
```

## Build

```bash
# Build de producción
npm run build

# Los archivos se generan en dist/ofrece-tu-pega/
```

## Agregar Nueva Feature

1. Crear carpeta en `features/<feature-name>`
2. Crear las 4 subcarpetas: domain, application, infrastructure, presentation
3. Implementar cada capa siguiendo el ejemplo de "products"
4. Agregar ruta en `core/app.routes.ts`

## Recursos Adicionales

- [Angular CLI](https://angular.dev/tools/cli)
- [Angular Material](https://material.angular.io/)
- [Angular Signals](https://angular.dev/guide/signals)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentación detallada de la arquitectura
