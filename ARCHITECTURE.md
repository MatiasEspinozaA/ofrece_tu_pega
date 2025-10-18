# Arquitectura del Proyecto: ofrece_tu_pega

## Descripción General

Este proyecto utiliza una arquitectura **Clean Architecture** adaptada para Angular 20, organizando el código por features con separación clara de responsabilidades en 4 capas.

## Tecnologías Utilizadas

- **Angular 20** (Standalone Components, Routing, SCSS)
- **Angular Material 20** con Material Design 3
- **Bootstrap 5** (solo grid y spacing utilities)
- **Angular Signals** para manejo de estado (sin NgRx)
- **RxJS** para programación reactiva
- **TypeScript 5.9**
- **ESLint** (angular-eslint)

## Estructura de Carpetas

```
src/app/
├── core/                           # Configuración global de la aplicación
│   ├── app.config.ts              # Configuración de providers globales
│   └── app.routes.ts              # Rutas principales de la aplicación
│
├── shared/                         # Recursos compartidos entre features
│   ├── ui/                        # Componentes UI reutilizables
│   │   └── shell/                 # Shell component (layout principal)
│   ├── directives/                # Directivas compartidas
│   ├── pipes/                     # Pipes compartidos
│   ├── utils/                     # Utilidades y helpers
│   └── styles/                    # Estilos y tokens globales
│       ├── tokens.css             # Variables CSS (design tokens)
│       └── material-theme.scss    # Tema de Material 3
│
└── features/                       # Features de la aplicación
    └── products/                   # Feature de ejemplo: Products
        ├── domain/                 # Capa de dominio (entidades y reglas de negocio)
        │   ├── entities.ts        # Entidades del dominio
        │   └── ports.ts           # Interfaces/Puertos para dependencias externas
        │
        ├── application/            # Capa de aplicación (casos de uso)
        │   ├── list-products.use-case.ts
        │   ├── get-product.use-case.ts
        │   ├── create-product.use-case.ts
        │   └── update-product.use-case.ts
        │
        ├── infrastructure/         # Capa de infraestructura (implementaciones concretas)
        │   ├── product.dto.ts     # Data Transfer Objects
        │   ├── mappers.ts         # Conversión DTO ↔ Entity
        │   └── http-product.repository.ts  # Implementación del repositorio
        │
        └── presentation/           # Capa de presentación (UI)
            ├── products.page.ts   # Componente de página
            ├── products.store.ts  # State management con signals
            ├── products.facade.ts # Facade para simplificar interacciones
            └── routes.ts          # Rutas con providers scoped
```

## Arquitectura por Capas

### 1. Domain Layer (Dominio)
- **Responsabilidad**: Contiene las reglas de negocio puras y las entidades del dominio
- **Archivos clave**:
  - `entities.ts`: Define las entidades del dominio (Product, CreateProductData, UpdateProductData)
  - `ports.ts`: Define interfaces (puertos) para dependencias externas (IProductRepository)
- **Características**:
  - Sin dependencias de frameworks
  - Solo lógica de negocio pura
  - Utiliza InjectionToken para inversión de dependencias

### 2. Application Layer (Aplicación)
- **Responsabilidad**: Orquesta el flujo de datos entre capas mediante casos de uso
- **Archivos clave**:
  - `*. use-case.ts`: Implementación de cada caso de uso
- **Características**:
  - Cada caso de uso tiene una sola responsabilidad
  - Inyecta los puertos del dominio mediante DI
  - Retorna Observables para manejo reactivo

### 3. Infrastructure Layer (Infraestructura)
- **Responsabilidad**: Implementa los detalles técnicos (HTTP, API, persistencia)
- **Archivos clave**:
  - `*.dto.ts`: Define la estructura de datos de la API
  - `mappers.ts`: Convierte entre DTOs y entidades del dominio
  - `http-*.repository.ts`: Implementa los puertos definidos en el dominio
- **Características**:
  - Aislada del dominio mediante interfaces
  - Incluye datos mock para desarrollo sin backend
  - Fácilmente intercambiable sin afectar otras capas

### 4. Presentation Layer (Presentación)
- **Responsabilidad**: UI, componentes, y gestión de estado local
- **Archivos clave**:
  - `*.page.ts`: Componente standalone que representa una página
  - `*.store.ts`: Gestión de estado con Angular Signals
  - `*.facade.ts`: Simplifica la interacción entre UI y lógica de negocio
  - `routes.ts`: Define rutas y provee dependencias scoped
- **Características**:
  - Componentes standalone
  - Signals para estado reactivo (sin NgRx)
  - Providers scoped a nivel de ruta
  - ViewModels simples y tipados

## Patrones de Diseño Utilizados

### 1. Repository Pattern
Los repositorios abstraen el acceso a datos mediante interfaces (puertos), permitiendo cambiar la implementación sin afectar el dominio.

```typescript
// Puerto (domain/ports.ts)
export interface IProductRepository {
  getAll(): Observable<Product[]>;
  getById(id: string): Observable<Product>;
  // ...
}

// Implementación (infrastructure/http-product.repository.ts)
export class HttpProductRepository implements IProductRepository {
  // Implementación con HttpClient
}
```

### 2. Facade Pattern
Los facades simplifican la interacción entre la UI y la lógica de negocio, exponiendo un ViewModel simple.

```typescript
export class ProductsFacade {
  readonly vm = {
    products: this.store.products,
    loading: this.store.loading,
    // ...
  };

  loadProducts(): void { /* ... */ }
}
```

### 3. Dependency Injection
Angular DI se usa extensivamente para:
- Inversión de dependencias
- Providers scoped por ruta
- InjectionTokens para abstracciones

### 4. Signals Pattern
Estado reactivo sin NgRx usando Angular Signals:

```typescript
export class ProductsStore {
  private readonly state = signal<ProductsState>(initialState);
  readonly products = computed(() => this.state().products);

  setProducts(products: Product[]): void {
    this.state.update(state => ({ ...state, products }));
  }
}
```

## Flujo de Datos

```
UI Component → Facade → Use Case → Repository (Port) → HTTP Repository (Adapter)
     ↓                                                          ↓
   Store ←────────────────────────────────────────────── API Response
     ↓
  Signal
     ↓
   View
```

## Ventajas de Esta Arquitectura

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad clara
2. **Testabilidad**: Fácil de testear cada capa de forma independiente
3. **Mantenibilidad**: Código organizado y predecible
4. **Escalabilidad**: Fácil agregar nuevas features siguiendo el mismo patrón
5. **Flexibilidad**: Cambiar implementaciones sin afectar otras capas
6. **Type Safety**: TypeScript fuerte en todas las capas

## Cómo Agregar una Nueva Feature

1. Crear carpeta en `features/` con las 4 subcarpetas (domain, application, infrastructure, presentation)
2. Definir entidades y puertos en `domain/`
3. Implementar casos de uso en `application/`
4. Crear adaptadores (repositories, servicios) en `infrastructure/`
5. Crear componentes, store, facade y rutas en `presentation/`
6. Agregar la ruta en `core/app.routes.ts`

## Estado y Signals

En lugar de NgRx, utilizamos Angular Signals para:
- Estado local por feature
- Reactividad automática
- Simplicidad y menos boilerplate
- Mejor rendimiento con change detection

## Estilos

- **Material Theme**: Configurado con Material Design 3 en un solo archivo
- **Design Tokens**: Variables CSS en `tokens.css` para consistencia
- **Bootstrap Grid**: Solo el sistema de grid y utilities de spacing
- **Component Styles**: Scoped a cada componente

## Testing

Cada capa puede ser testeada independientemente:
- **Domain**: Testear entidades y lógica de negocio
- **Application**: Testear casos de uso con mocks de repositorios
- **Infrastructure**: Testear mappers y repositories con HTTP mocks
- **Presentation**: Testear componentes, stores y facades

## Mejores Prácticas

1. **Inmutabilidad**: Usar `readonly` en entidades y ViewModels
2. **Tipado Fuerte**: Evitar `any`, usar interfaces específicas
3. **Single Responsibility**: Cada clase/función hace una sola cosa
4. **Dependency Inversion**: Depender de abstracciones, no de implementaciones
5. **Scoped Providers**: Providers a nivel de ruta, no globales cuando sea posible
