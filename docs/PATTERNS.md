# Patrones de Diseño

Este documento describe los patrones de diseño implementados en el proyecto y cómo aplicarlos correctamente.

---

## 1. Singleton Pattern

### Descripción
Garantiza que una clase tenga una única instancia en toda la aplicación.

### Implementación en Angular

#### Opción 1: `providedIn: 'root'`

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(null);

  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(credentials: LoginCredentials): Observable<User> {
    // ...
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
```

#### Opción 2: `makeEnvironmentProviders()`

```typescript
// branding.providers.ts
export function provideBranding(): EnvironmentProviders {
  return makeEnvironmentProviders([
    BrandingStore,
    LoadThemePreferencesUseCase,
    SaveThemePreferencesUseCase,
    ApplyThemeUseCase,
    { provide: THEME_PREFERENCES_REPOSITORY, useClass: LocalStorageThemePreferencesRepository },
    { provide: THEME_APPLICATOR, useClass: DomThemeApplicator },
    { provide: THEME_DEFINITIONS_REPOSITORY, useClass: StaticThemeDefinitionsRepository },
  ]);
}

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBranding(),
    // ...
  ],
};
```

### Servicios Singleton Actuales

| Servicio | Método | Propósito |
|----------|--------|-----------|
| `BrandingFacade` | `providedIn: 'root'` | Gestión global de temas |
| `BrandingStore` | `provideBranding()` | Estado del tema |

### Cuándo usar Singleton

- Estado que debe compartirse entre múltiples features
- Servicios de autenticación/autorización
- Configuración global de la aplicación
- Servicios de notificaciones/toasts

---

## 2. Repository Pattern

### Descripción
Abstrae el acceso a datos detrás de una interfaz, permitiendo cambiar la implementación sin afectar el resto del código.

### Implementación

#### Paso 1: Definir el Puerto (Interface)

```typescript
// domain/ports.ts
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

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

#### Paso 2: Implementar el Adaptador

```typescript
// infrastructure/http-product.repository.ts
@Injectable()
export class HttpProductRepository implements IProductRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/products';

  getAll(): Observable<Product[]> {
    return this.http.get<ProductDTO[]>(this.apiUrl).pipe(
      map(dtos => dtos.map(ProductMapper.toDomain))
    );
  }

  getById(id: string): Observable<Product> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/${id}`).pipe(
      map(ProductMapper.toDomain)
    );
  }

  create(data: CreateProductData): Observable<Product> {
    return this.http.post<ProductDTO>(this.apiUrl, data).pipe(
      map(ProductMapper.toDomain)
    );
  }

  update(id: string, data: UpdateProductData): Observable<Product> {
    return this.http.patch<ProductDTO>(`${this.apiUrl}/${id}`, data).pipe(
      map(ProductMapper.toDomain)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

#### Paso 3: Conectar via DI

```typescript
// presentation/routes.ts
providers: [
  { provide: PRODUCT_REPOSITORY, useClass: HttpProductRepository },
]
```

### Beneficios

- **Testabilidad**: Fácil de mockear en tests
- **Flexibilidad**: Cambiar implementación sin tocar use cases
- **Desacoplamiento**: Domain no conoce detalles de infraestructura

### Implementaciones Alternativas

```typescript
// Para tests
@Injectable()
export class InMemoryProductRepository implements IProductRepository {
  private products: Product[] = [];

  getAll(): Observable<Product[]> {
    return of(this.products);
  }
  // ...
}

// Para desarrollo offline
@Injectable()
export class LocalStorageProductRepository implements IProductRepository {
  private readonly storageKey = 'products';

  getAll(): Observable<Product[]> {
    const data = localStorage.getItem(this.storageKey);
    return of(data ? JSON.parse(data) : []);
  }
  // ...
}
```

---

## 3. Facade Pattern

### Descripción
Proporciona una interfaz simplificada a un subsistema complejo. En nuestro caso, orquesta use cases y expone un ViewModel simple a los componentes.

### Implementación

```typescript
@Injectable()
export class ProductsFacade {
  // ========================================
  // ViewModel: Lo que consume el template
  // ========================================
  readonly vm = {
    products: this.store.products,
    loading: this.store.loading,
    error: this.store.error,
    hasProducts: this.store.hasProducts,
  };

  // ========================================
  // Constructor: Inyecta dependencias
  // ========================================
  constructor(
    private readonly store: ProductsStore,
    private readonly listUseCase: ListProductsUseCase,
    private readonly createUseCase: CreateProductUseCase,
    private readonly updateUseCase: UpdateProductUseCase,
    private readonly deleteUseCase: DeleteProductUseCase,
  ) {}

  // ========================================
  // Métodos públicos: Acciones disponibles
  // ========================================

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

  // ... más métodos
}
```

### Uso en Componentes

```typescript
@Component({
  selector: 'app-products-page',
  template: `
    @if (facade.vm.loading()) {
      <mat-spinner />
    }

    @if (facade.vm.error(); as error) {
      <div class="error">{{ error }}</div>
    }

    @if (facade.vm.hasProducts()) {
      <app-crud-table
        [data]="facade.vm.products()"
        (onEdit)="openEditDialog($event)"
        (onDelete)="facade.deleteProduct($event.id)"
      />
    } @else {
      <div class="empty-state">No hay productos</div>
    }
  `
})
export class ProductsPageComponent implements OnInit {
  protected readonly facade = inject(ProductsFacade);

  ngOnInit(): void {
    this.facade.loadProducts();
  }
}
```

### Reglas del Facade

1. **ViewModel inmutable**: Solo exponer signals/computed, nunca el store completo
2. **Métodos que orquestan**: Cada método público coordina use cases y actualiza estado
3. **Manejo de errores**: El facade captura errores y actualiza el estado de error
4. **No lógica de UI**: El facade no debe saber nada de dialogs, navegación, etc.

---

## 4. Signal State Pattern

### Descripción
Patrón para manejar estado reactivo usando Angular Signals, con estado privado y selectores públicos computed.

### Estructura

```typescript
@Injectable()
export class ProductsStore {
  // ========================================
  // Estado privado (no expuesto)
  // ========================================
  private readonly state = signal<ProductsState>({
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      category: null,
    },
  });

  // ========================================
  // Selectores públicos (readonly)
  // ========================================

  // Selectores básicos
  readonly products = computed(() => this.state().products);
  readonly selectedProduct = computed(() => this.state().selectedProduct);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly filters = computed(() => this.state().filters);

  // Selectores derivados
  readonly hasProducts = computed(() => this.products().length > 0);
  readonly productCount = computed(() => this.products().length);

  readonly filteredProducts = computed(() => {
    const { search, category } = this.filters();
    let result = this.products();

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (category) {
      result = result.filter(p => p.category === category);
    }

    return result;
  });

  readonly activeProducts = computed(() =>
    this.products().filter(p => p.active)
  );

  // ========================================
  // Mutaciones (métodos que modifican estado)
  // ========================================

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

  setFilters(filters: Partial<ProductsState['filters']>): void {
    this.state.update(s => ({
      ...s,
      filters: { ...s.filters, ...filters },
    }));
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

  reset(): void {
    this.state.set({
      products: [],
      selectedProduct: null,
      loading: false,
      error: null,
      filters: { search: '', category: null },
    });
  }
}
```

### Reglas del Store

1. **Estado privado**: Usar `private readonly state = signal<State>()`
2. **Selectores computed**: Todos los selectores son `computed()` públicos
3. **Inmutabilidad**: Siempre usar `update()` o `set()`, nunca mutar directamente
4. **Selectores derivados**: Crear computed para datos calculados
5. **No side effects**: El store solo maneja estado, no hace llamadas HTTP

---

## 5. Mapper Pattern

### Descripción
Transforma datos entre diferentes representaciones (DTO ↔ Entity).

### Implementación

```typescript
// infrastructure/mappers.ts
import { Product, CreateProductData } from '../domain/entities';
import { ProductDTO, CreateProductDTO } from './product.dto';

export class ProductMapper {
  /**
   * Transforma DTO de API a Entity de dominio
   */
  static toDomain(dto: ProductDTO): Product {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      active: dto.active,
      imageUrl: dto.image_url,                    // snake_case → camelCase
      createdAt: new Date(dto.created_at),        // string → Date
      updatedAt: dto.updated_at
        ? new Date(dto.updated_at)
        : undefined,
    };
  }

  /**
   * Transforma Entity de dominio a DTO para API
   */
  static toDTO(entity: Product): ProductDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      category: entity.category,
      active: entity.active,
      image_url: entity.imageUrl,                 // camelCase → snake_case
      created_at: entity.createdAt.toISOString(), // Date → string
      updated_at: entity.updatedAt?.toISOString(),
    };
  }

  /**
   * Transforma datos de creación a DTO
   */
  static createToDTO(data: CreateProductData): CreateProductDTO {
    return {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
    };
  }
}
```

### Uso en Repository

```typescript
@Injectable()
export class HttpProductRepository implements IProductRepository {
  getAll(): Observable<Product[]> {
    return this.http.get<ProductDTO[]>(this.apiUrl).pipe(
      map(dtos => dtos.map(ProductMapper.toDomain))
    );
  }

  create(data: CreateProductData): Observable<Product> {
    const dto = ProductMapper.createToDTO(data);
    return this.http.post<ProductDTO>(this.apiUrl, dto).pipe(
      map(ProductMapper.toDomain)
    );
  }
}
```

---

## 6. Use Case Pattern

### Descripción
Encapsula una operación de negocio específica con un único método `execute()`.

### Implementación

```typescript
// Caso de uso simple
export class ListProductsUseCase {
  private readonly repository = inject(PRODUCT_REPOSITORY);

  execute(): Observable<Product[]> {
    return this.repository.getAll();
  }
}

// Caso de uso con lógica de negocio
export class CreateOrderUseCase {
  private readonly orderRepository = inject(ORDER_REPOSITORY);
  private readonly productRepository = inject(PRODUCT_REPOSITORY);
  private readonly inventoryService = inject(INVENTORY_SERVICE);

  execute(data: CreateOrderData): Observable<Order> {
    // Validar stock
    return this.productRepository.getById(data.productId).pipe(
      switchMap(product => {
        if (!product.active) {
          return throwError(() => new Error('Producto no disponible'));
        }

        return this.inventoryService.checkStock(product.id, data.quantity);
      }),
      switchMap(hasStock => {
        if (!hasStock) {
          return throwError(() => new Error('Stock insuficiente'));
        }

        return this.orderRepository.create(data);
      }),
      tap(order => {
        // Actualizar inventario después de crear orden
        this.inventoryService.decreaseStock(data.productId, data.quantity);
      })
    );
  }
}
```

### Reglas de Use Cases

1. **Un método `execute()`**: Cada use case tiene un único punto de entrada
2. **Responsabilidad única**: Un use case = una operación de negocio
3. **Sin estado**: Los use cases no mantienen estado, solo coordinan
4. **Retornan Observable**: Para composición y manejo de errores

---

## Resumen de Patrones

| Patrón | Propósito | Ubicación |
|--------|-----------|-----------|
| **Singleton** | Instancia única global | `providedIn: 'root'` o `makeEnvironmentProviders` |
| **Repository** | Abstracción de datos | `domain/ports.ts` + `infrastructure/*` |
| **Facade** | Simplificar subsistema | `presentation/*.facade.ts` |
| **Signal State** | Estado reactivo | `presentation/*.store.ts` |
| **Mapper** | Transformar datos | `infrastructure/mappers.ts` |
| **Use Case** | Operación de negocio | `application/*.use-case.ts` |
