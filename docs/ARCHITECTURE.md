# Arquitectura del Proyecto

## Clean Architecture (Arquitectura Hexagonal)

El proyecto implementa **Clean Architecture por feature**, separando responsabilidades en 4 capas con dependencias unidireccionales.

### Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION                            │
│  (Components, Pages, Store, Facade)                         │
│  Conoce: Application, Domain                                │
├─────────────────────────────────────────────────────────────┤
│                      APPLICATION                             │
│  (Use Cases)                                                │
│  Conoce: Domain                                             │
├─────────────────────────────────────────────────────────────┤
│                     INFRASTRUCTURE                           │
│  (Repositories HTTP, Mappers, DTOs)                         │
│  Implementa: Domain Ports                                   │
├─────────────────────────────────────────────────────────────┤
│                        DOMAIN                                │
│  (Entities, Ports/Interfaces)                               │
│  NO conoce ninguna otra capa - ES PURO                      │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario → Page → Facade → Use Case → Repository → API
                   ↓
                 Store ← (actualiza estado)
                   ↓
              Signals → Template (reactivo)
```

---

## Estructura de Carpetas por Feature

```
src/app/features/oferente/<feature>/
├── domain/
│   ├── entities.ts      # Interfaces puras (sin deps de Angular)
│   └── ports.ts         # Interfaces de repositorios + InjectionTokens
├── application/
│   ├── list-*.use-case.ts
│   ├── get-*.use-case.ts
│   ├── create-*.use-case.ts
│   ├── update-*.use-case.ts
│   └── delete-*.use-case.ts
├── infrastructure/
│   ├── *.dto.ts              # Tipos de respuesta de API
│   ├── http-*.repository.ts  # Implementación HTTP
│   └── mappers.ts            # Transformaciones DTO <-> Entity
└── presentation/
    ├── *.store.ts       # Estado con Signals
    ├── *.facade.ts      # Orquestador + ViewModel
    ├── *.page.ts        # Smart component (página)
    ├── *.page.html      # Template
    ├── *.page.scss      # Estilos
    ├── components/      # Dumb components específicos del feature
    └── routes.ts        # Rutas con providers scoped
```

---

## Reglas de Dependencia (OBLIGATORIAS)

| Capa | Puede importar de | NO puede importar de |
|------|-------------------|---------------------|
| **Domain** | Nada (es pura) | Application, Infrastructure, Presentation |
| **Application** | Domain | Infrastructure, Presentation |
| **Infrastructure** | Domain | Application, Presentation |
| **Presentation** | Domain, Application | Infrastructure (solo via DI) |

### Ejemplos

```typescript
// ✅ CORRECTO: Use case importa de Domain
// application/list-products.use-case.ts
import { Product } from '../domain/entities';
import { IProductRepository, PRODUCT_REPOSITORY } from '../domain/ports';

// ✅ CORRECTO: Infrastructure importa de Domain
// infrastructure/http-product.repository.ts
import { Product } from '../domain/entities';
import { IProductRepository } from '../domain/ports';

// ❌ INCORRECTO: Domain importa de Infrastructure
// domain/entities.ts
import { ProductDTO } from '../infrastructure/product.dto'; // NO!

// ❌ INCORRECTO: Use case importa de Infrastructure
// application/list-products.use-case.ts
import { HttpProductRepository } from '../infrastructure/http-product.repository'; // NO!
```

---

## Descripción de Cada Capa

### Domain Layer

**Propósito**: Definir el modelo de negocio puro, sin dependencias de framework.

**Contenido**:
- `entities.ts`: Interfaces que representan objetos de negocio
- `ports.ts`: Contratos (interfaces) que definen cómo interactuar con el exterior

```typescript
// domain/entities.ts
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly active: boolean;
  readonly imageUrl?: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

export interface CreateProductData {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
}

export interface UpdateProductData {
  readonly name?: string;
  readonly description?: string;
  readonly price?: number;
  readonly category?: string;
  readonly active?: boolean;
}
```

```typescript
// domain/ports.ts
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, CreateProductData, UpdateProductData } from './entities';

export interface IProductRepository {
  getAll(): Observable<Product[]>;
  getById(id: string): Observable<Product>;
  create(data: CreateProductData): Observable<Product>;
  update(id: string, data: UpdateProductData): Observable<Product>;
  delete(id: string): Observable<void>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<IProductRepository>(
  'IProductRepository'
);
```

### Application Layer

**Propósito**: Contener la lógica de negocio en forma de casos de uso.

**Reglas**:
- Un archivo por caso de uso
- Cada use case tiene un método `execute()`
- Inyecta repositorios via tokens del Domain

```typescript
// application/list-products.use-case.ts
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../domain/entities';
import { IProductRepository, PRODUCT_REPOSITORY } from '../domain/ports';

export class ListProductsUseCase {
  private readonly repository = inject(PRODUCT_REPOSITORY);

  execute(): Observable<Product[]> {
    return this.repository.getAll();
  }
}
```

```typescript
// application/create-product.use-case.ts
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, CreateProductData } from '../domain/entities';
import { IProductRepository, PRODUCT_REPOSITORY } from '../domain/ports';

export class CreateProductUseCase {
  private readonly repository = inject(PRODUCT_REPOSITORY);

  execute(data: CreateProductData): Observable<Product> {
    return this.repository.create(data);
  }
}
```

### Infrastructure Layer

**Propósito**: Implementar los puertos definidos en Domain con tecnología concreta (HTTP, localStorage, etc.)

**Contenido**:
- DTOs: Tipos que representan respuestas de API
- Repositories: Implementaciones HTTP de los puertos
- Mappers: Transformaciones entre DTO y Entity

```typescript
// infrastructure/product.dto.ts
export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  active: boolean;
  image_url?: string;      // snake_case de API
  created_at: string;
  updated_at?: string;
}
```

```typescript
// infrastructure/mappers.ts
import { Product } from '../domain/entities';
import { ProductDTO } from './product.dto';

export class ProductMapper {
  static toDomain(dto: ProductDTO): Product {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      active: dto.active,
      imageUrl: dto.image_url,
      createdAt: new Date(dto.created_at),
      updatedAt: dto.updated_at ? new Date(dto.updated_at) : undefined,
    };
  }

  static toDTO(entity: Product): ProductDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      category: entity.category,
      active: entity.active,
      image_url: entity.imageUrl,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt?.toISOString(),
    };
  }
}
```

```typescript
// infrastructure/http-product.repository.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { Product, CreateProductData, UpdateProductData } from '../domain/entities';
import { IProductRepository } from '../domain/ports';
import { ProductDTO } from './product.dto';
import { ProductMapper } from './mappers';

@Injectable()
export class HttpProductRepository implements IProductRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/products';

  // Mock data para desarrollo
  private mockProducts: ProductDTO[] = [
    { id: '1', name: 'Producto 1', /* ... */ },
  ];

  getAll(): Observable<Product[]> {
    // TODO: Descomentar para API real
    // return this.http.get<ProductDTO[]>(this.apiUrl).pipe(
    //   map(dtos => dtos.map(dto => ProductMapper.toDomain(dto)))
    // );

    // Mock para desarrollo
    return of(this.mockProducts).pipe(
      delay(500),
      map(dtos => dtos.map(dto => ProductMapper.toDomain(dto)))
    );
  }

  // ... otros métodos
}
```

### Presentation Layer

**Propósito**: UI y gestión del estado de la vista.

**Contenido**:
- Store: Estado reactivo con Signals
- Facade: Orquestador entre UI y Use Cases
- Page: Smart component que usa el Facade
- Components: Dumb components específicos del feature

```typescript
// presentation/products.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../domain/entities';

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

@Injectable()
export class ProductsStore {
  // Estado privado
  private readonly state = signal<ProductsState>(initialState);

  // Selectores públicos (readonly)
  readonly products = computed(() => this.state().products);
  readonly selectedProduct = computed(() => this.state().selectedProduct);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  // Selectores derivados
  readonly hasProducts = computed(() => this.state().products.length > 0);
  readonly productCount = computed(() => this.state().products.length);

  // Mutaciones
  setProducts(products: Product[]): void {
    this.state.update(s => ({ ...s, products, error: null }));
  }

  setSelectedProduct(product: Product | null): void {
    this.state.update(s => ({ ...s, selectedProduct: product }));
  }

  setLoading(loading: boolean): void {
    this.state.update(s => ({ ...s, loading }));
  }

  setError(error: string | null): void {
    this.state.update(s => ({ ...s, error, loading: false }));
  }

  addProduct(product: Product): void {
    this.state.update(s => ({
      ...s,
      products: [...s.products, product],
    }));
  }

  updateProduct(updated: Product): void {
    this.state.update(s => ({
      ...s,
      products: s.products.map(p => p.id === updated.id ? updated : p),
    }));
  }

  removeProduct(id: string): void {
    this.state.update(s => ({
      ...s,
      products: s.products.filter(p => p.id !== id),
    }));
  }
}
```

```typescript
// presentation/products.facade.ts
import { Injectable } from '@angular/core';
import { ProductsStore } from './products.store';
import { ListProductsUseCase } from '../application/list-products.use-case';
import { CreateProductUseCase } from '../application/create-product.use-case';
import { UpdateProductUseCase } from '../application/update-product.use-case';
import { DeleteProductUseCase } from '../application/delete-product.use-case';
import { CreateProductData, UpdateProductData } from '../domain/entities';

@Injectable()
export class ProductsFacade {
  // ViewModel: expone signals del store para los templates
  readonly vm = {
    products: this.store.products,
    selectedProduct: this.store.selectedProduct,
    loading: this.store.loading,
    error: this.store.error,
    hasProducts: this.store.hasProducts,
    productCount: this.store.productCount,
  };

  constructor(
    private readonly store: ProductsStore,
    private readonly listUseCase: ListProductsUseCase,
    private readonly createUseCase: CreateProductUseCase,
    private readonly updateUseCase: UpdateProductUseCase,
    private readonly deleteUseCase: DeleteProductUseCase,
  ) {}

  loadProducts(): void {
    this.store.setLoading(true);
    this.listUseCase.execute().subscribe({
      next: products => {
        this.store.setProducts(products);
        this.store.setLoading(false);
      },
      error: err => this.store.setError(err.message),
    });
  }

  createProduct(data: CreateProductData): void {
    this.store.setLoading(true);
    this.createUseCase.execute(data).subscribe({
      next: product => {
        this.store.addProduct(product);
        this.store.setLoading(false);
      },
      error: err => this.store.setError(err.message),
    });
  }

  updateProduct(id: string, data: UpdateProductData): void {
    this.store.setLoading(true);
    this.updateUseCase.execute(id, data).subscribe({
      next: product => {
        this.store.updateProduct(product);
        this.store.setLoading(false);
      },
      error: err => this.store.setError(err.message),
    });
  }

  deleteProduct(id: string): void {
    this.store.setLoading(true);
    this.deleteUseCase.execute(id).subscribe({
      next: () => {
        this.store.removeProduct(id);
        this.store.setLoading(false);
      },
      error: err => this.store.setError(err.message),
    });
  }
}
```

```typescript
// presentation/routes.ts
import { Routes } from '@angular/router';
import { PRODUCT_REPOSITORY } from '../domain/ports';
import { HttpProductRepository } from '../infrastructure/http-product.repository';
import { ListProductsUseCase } from '../application/list-products.use-case';
import { CreateProductUseCase } from '../application/create-product.use-case';
import { UpdateProductUseCase } from '../application/update-product.use-case';
import { DeleteProductUseCase } from '../application/delete-product.use-case';
import { ProductsStore } from './products.store';
import { ProductsFacade } from './products.facade';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products.page').then(m => m.ProductsPageComponent),
    providers: [
      // Infrastructure (implementación del puerto)
      { provide: PRODUCT_REPOSITORY, useClass: HttpProductRepository },

      // Application (use cases)
      ListProductsUseCase,
      CreateProductUseCase,
      UpdateProductUseCase,
      DeleteProductUseCase,

      // Presentation (estado y orquestación)
      ProductsStore,
      ProductsFacade,
    ],
  },
];
```

---

## Providers: Global vs Scoped

### Providers Globales (Singleton)

Servicios que deben existir una sola vez en toda la aplicación:

```typescript
// En app.config.ts o via providedIn: 'root'
@Injectable({ providedIn: 'root' })
export class BrandingFacade { }

// O via makeEnvironmentProviders
export function provideBranding(): EnvironmentProviders {
  return makeEnvironmentProviders([
    BrandingStore,
    BrandingFacade,
    { provide: THEME_APPLICATOR, useClass: DomThemeApplicator },
  ]);
}
```

### Providers Scoped por Feature

Servicios que tienen instancia única por feature/ruta:

```typescript
// En routes.ts del feature
export const PRODUCTS_ROUTES: Routes = [{
  path: '',
  providers: [
    ProductsStore,    // Nueva instancia para este feature
    ProductsFacade,   // Nueva instancia para este feature
  ]
}];
```

**Cuándo usar cada uno:**

| Tipo | Usar cuando | Ejemplos |
|------|-------------|----------|
| Global | Estado compartido entre features | BrandingFacade, AuthService |
| Scoped | Estado específico del feature | ProductsStore, ContactsFacade |
