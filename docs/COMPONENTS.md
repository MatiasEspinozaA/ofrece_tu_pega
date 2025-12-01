# Componentes y Atomic Design

Este documento describe la organización de componentes siguiendo Atomic Design y los principios de reutilización.

---

## Atomic Design

### Metodología

Atomic Design organiza componentes en 5 niveles, de menor a mayor complejidad:

```
Atoms → Molecules → Organisms → Templates → Pages
```

### Estructura de Carpetas

```
src/app/
├── shared/
│   ├── atoms/               # Elementos básicos indivisibles
│   │   ├── button/
│   │   ├── input/
│   │   ├── icon/
│   │   ├── badge/
│   │   ├── avatar/
│   │   ├── spinner/
│   │   └── chip/
│   ├── molecules/           # Combinaciones de átomos
│   │   ├── search-box/
│   │   ├── form-field/
│   │   ├── card-header/
│   │   ├── menu-item/
│   │   ├── stat-card/
│   │   └── empty-state/
│   ├── organisms/           # Secciones completas
│   │   ├── crud/
│   │   │   ├── crud-table/
│   │   │   └── crud-form-dialog/
│   │   ├── data-table/
│   │   ├── toolbar/
│   │   ├── sidebar/
│   │   └── footer/
│   └── styles/              # Tokens y estilos globales
│       ├── tokens.css
│       ├── material-theme.scss
│       └── accessibility.scss
├── features/
│   └── oferente/
│       └── shared/
│           └── layouts/     # Templates específicos del feature
│               ├── oferente-layout/
│               └── ...
└── ...
```

---

## Niveles de Componentes

### 1. Atoms (Átomos)

**Descripción**: Elementos UI más pequeños e indivisibles. No tienen lógica de negocio.

**Características**:
- Puramente presentacionales
- Inputs simples via `input()` signals
- Outputs via `output()` signals
- NO inyectan servicios de negocio
- Altamente reutilizables

**Ejemplos**:

```typescript
// atoms/badge/badge.component.ts
@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="badge"
      [class.badge-primary]="variant() === 'primary'"
      [class.badge-accent]="variant() === 'accent'"
      [class.badge-warn]="variant() === 'warn'"
      [class.badge-success]="variant() === 'success'"
    >
      {{ label() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .badge-primary { background: var(--color-primary-bg); color: var(--color-primary); }
    .badge-accent { background: var(--color-accent-bg); color: var(--color-accent); }
    .badge-warn { background: var(--color-warn-bg); color: var(--color-warn); }
    .badge-success { background: var(--color-success-bg); color: var(--color-success); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  label = input.required<string>();
  variant = input<'primary' | 'accent' | 'warn' | 'success'>('primary');
}
```

```typescript
// atoms/spinner/spinner.component.ts
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <mat-spinner [diameter]="size()" [color]="color()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  size = input<number>(40);
  color = input<'primary' | 'accent' | 'warn'>('primary');
}
```

```typescript
// atoms/avatar/avatar.component.ts
@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    @if (imageUrl()) {
      <img [src]="imageUrl()" [alt]="alt()" class="avatar" [style.width.px]="size()" />
    } @else {
      <div class="avatar avatar-placeholder" [style.width.px]="size()">
        {{ initials() }}
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  imageUrl = input<string | undefined>();
  alt = input<string>('Avatar');
  size = input<number>(40);
  name = input<string>('');

  initials = computed(() => {
    const name = this.name();
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  });
}
```

### 2. Molecules (Moléculas)

**Descripción**: Combinaciones de átomos que forman unidades funcionales simples.

**Características**:
- Compuestas de átomos y/o elementos HTML
- Lógica mínima de UI
- Pueden emitir eventos
- Reutilizables en múltiples contextos

**Ejemplos**:

```typescript
// molecules/search-box/search-box.component.ts
@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" class="search-field">
      <mat-icon matPrefix>search</mat-icon>
      <input
        matInput
        type="text"
        [placeholder]="placeholder()"
        [(ngModel)]="value"
        (ngModelChange)="onSearch($event)"
      />
      @if (value) {
        <button matSuffix mat-icon-button (click)="clear()">
          <mat-icon>close</mat-icon>
        </button>
      }
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  placeholder = input<string>('Buscar...');
  debounceTime = input<number>(300);
  search = output<string>();

  value = '';
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(this.debounceTime()),
      distinctUntilChanged()
    ).subscribe(term => this.search.emit(term));
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  clear(): void {
    this.value = '';
    this.search.emit('');
  }
}
```

```typescript
// molecules/stat-card/stat-card.component.ts
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card" [style.--accent-color]="color()">
      <div class="stat-icon">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ value() }}</span>
        <span class="stat-label">{{ label() }}</span>
      </div>
      @if (trend()) {
        <div class="stat-trend" [class.positive]="trend()! > 0" [class.negative]="trend()! < 0">
          <mat-icon>{{ trend()! > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
          {{ trend() }}%
        </div>
      }
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  icon = input.required<string>();
  value = input.required<string | number>();
  label = input.required<string>();
  color = input<string>('var(--color-primary)');
  trend = input<number | undefined>();
}
```

```typescript
// molecules/empty-state/empty-state.component.ts
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon() }}</mat-icon>
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
      @if (actionLabel()) {
        <button mat-raised-button color="primary" (click)="action.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  icon = input<string>('inbox');
  title = input.required<string>();
  description = input<string>('');
  actionLabel = input<string | undefined>();
  action = output<void>();
}
```

### 3. Organisms (Organismos)

**Descripción**: Secciones completas de UI que combinan moléculas y átomos. Tienen lógica propia y son configurables.

**Características**:
- Funcionalidad completa y autónoma
- Configurables via interfaces
- Pueden manejar estado interno
- Emiten eventos de alto nivel

**Ejemplos**:

```typescript
// organisms/crud-table/crud-table.types.ts
export interface CrudColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  format?: (value: any, row: T) => string;
  width?: string;
}

export interface CrudAction<T> {
  icon: string;
  label: string;
  color?: 'primary' | 'accent' | 'warn';
  action: (row: T) => void;
  visible?: (row: T) => boolean;
}

export interface CrudConfig<T> {
  title: string;
  columns: CrudColumn<T>[];
  actions?: CrudAction<T>[];
  showSearch?: boolean;
  showCreate?: boolean;
  showExport?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  createLabel?: string;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}
```

```typescript
// organisms/crud-table/crud-table.component.ts
@Component({
  selector: 'app-crud-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.scss',
})
export class CrudTableComponent<T = any> {
  @Input({ required: true }) config!: CrudConfig<T>;
  @Input({ required: true }) data: T[] = [];

  @Output() onCreate = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();
  @Output() onView = new EventEmitter<T>();

  // ... implementación completa
}
```

### 4. Templates (Plantillas)

**Descripción**: Layouts que definen la estructura de página. Usan `<ng-content>` o `<router-outlet>` para contenido dinámico.

**Características**:
- Definen estructura visual de página
- No tienen lógica de negocio
- Proveen slots para contenido
- Manejan responsive layout

**Ejemplo**:

```typescript
// templates/oferente-layout/oferente-layout.component.ts
@Component({
  selector: 'app-oferente-layout',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
  ],
  template: `
    <mat-sidenav-container class="oferente-container">
      <!-- Sidebar -->
      <mat-sidenav
        #sidenav
        [mode]="sidenavMode()"
        [opened]="sidenavOpened()"
        class="oferente-sidenav"
      >
        <div class="sidenav-header">
          <div class="brand">
            <mat-icon color="primary">storefront</mat-icon>
            <span class="brand-title">Ofrece tu Pega</span>
          </div>
        </div>

        <nav class="nav-menu">
          @for (item of menuItems; track item.id) {
            <a
              mat-list-item
              [routerLink]="item.route"
              routerLinkActive="active"
              [attr.aria-label]="item.ariaLabel"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
              @if (item.badge) {
                <span class="badge">{{ item.badge }}</span>
              }
            </a>
          }
        </nav>
      </mat-sidenav>

      <!-- Main content -->
      <mat-sidenav-content>
        <mat-toolbar class="oferente-toolbar" color="primary">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="spacer"></span>
          <!-- User menu, etc. -->
        </mat-toolbar>

        <main class="page-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OferenteLayoutComponent {
  // ... implementación con responsive logic
}
```

### 5. Pages (Páginas)

**Descripción**: Smart components que conectan con la capa de aplicación via Facades.

**Características**:
- Inyectan y usan Facades
- Orquestan la UI del feature
- Manejan navegación y diálogos
- NO contienen lógica de negocio directa

**Ejemplo**:

```typescript
// features/oferente/products/presentation/products.page.ts
@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CrudTableComponent,
    MatProgressSpinnerModule,
    MatDialogModule,
    EmptyStateComponent,
  ],
  template: `
    <div class="products-page">
      <header class="page-header">
        <h1>Mis Productos</h1>
        <p class="subtitle">Gestiona tu catálogo de productos</p>
      </header>

      @if (facade.vm.loading()) {
        <div class="loading-container">
          <mat-spinner />
        </div>
      } @else if (facade.vm.error(); as error) {
        <app-empty-state
          icon="error"
          [title]="'Error'"
          [description]="error"
          actionLabel="Reintentar"
          (action)="facade.loadProducts()"
        />
      } @else if (facade.vm.hasProducts()) {
        <app-crud-table
          [config]="crudConfig"
          [data]="facade.vm.products()"
          (onCreate)="openCreateDialog()"
          (onEdit)="openEditDialog($event)"
          (onDelete)="confirmDelete($event)"
        />
      } @else {
        <app-empty-state
          icon="inventory_2"
          title="No hay productos"
          description="Comienza agregando tu primer producto"
          actionLabel="Crear Producto"
          (action)="openCreateDialog()"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent implements OnInit {
  protected readonly facade = inject(ProductsFacade);
  private readonly dialog = inject(MatDialog);

  crudConfig: CrudConfig<Product> = {
    title: 'Productos',
    columns: [
      { key: 'name', label: 'Nombre', sortable: true },
      { key: 'category', label: 'Categoría', sortable: true },
      { key: 'price', label: 'Precio', format: (v) => `$${v.toLocaleString()}` },
      { key: 'active', label: 'Estado', format: (v) => v ? 'Activo' : 'Inactivo' },
    ],
    showSearch: true,
    showCreate: true,
    showEdit: true,
    showDelete: true,
  };

  ngOnInit(): void {
    this.facade.loadProducts();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CrudFormDialogComponent, {
      data: { title: 'Nuevo Producto', fields: this.getFormFields() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.facade.createProduct(result);
      }
    });
  }

  // ... más métodos
}
```

---

## Principios de Reutilización

### 1. DRY (Don't Repeat Yourself)

**Antes de crear un componente nuevo:**

1. Verificar si existe en `shared/`
2. Verificar si un componente existente puede extenderse
3. Verificar si Material tiene el componente

```typescript
// ✅ Reutilizar componente existente
<app-crud-table [config]="config" [data]="data" />

// ❌ NO crear tabla personalizada si CrudTable sirve
<table class="my-custom-table">...</table>
```

### 2. Configuración sobre Duplicación

Hacer componentes configurables en lugar de crear variantes:

```typescript
// ✅ Un componente configurable
<app-stat-card
  icon="shopping_cart"
  [value]="orderCount"
  label="Pedidos"
  color="var(--color-success)"
/>

// ❌ NO crear variantes
<app-order-stat-card />
<app-product-stat-card />
<app-user-stat-card />
```

### 3. Composición sobre Herencia

Usar composición de componentes pequeños:

```typescript
// ✅ Composición
@Component({
  template: `
    <app-card>
      <app-card-header [title]="title" />
      <app-card-content>
        <ng-content />
      </app-card-content>
      <app-card-actions>
        <app-button (click)="save()">Guardar</app-button>
      </app-card-actions>
    </app-card>
  `
})

// ❌ NO heredar para variantes
class SpecialCard extends BaseCard { }
```

---

## Componentes Compartidos Existentes

### Organismos (CRUD)

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `CrudTableComponent` | `shared/components/crud/crud-table/` | Tabla genérica con búsqueda, ordenamiento, paginación, exportación |
| `CrudFormDialogComponent` | `shared/components/crud/crud-form-dialog/` | Diálogo de formulario dinámico con validación |

### Templates

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `OferenteLayoutComponent` | `features/oferente/shared/layouts/` | Layout principal del panel oferente |
| `ShellComponent` | `shared/ui/shell/` | Layout legacy (deprecated) |

### Uso de CrudTable

```typescript
// Configuración
crudConfig: CrudConfig<MyEntity> = {
  title: 'Mis Entidades',
  columns: [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'status', label: 'Estado', format: (v) => v ? 'Activo' : 'Inactivo' },
    { key: 'createdAt', label: 'Fecha', format: (v) => new Date(v).toLocaleDateString() },
  ],
  showSearch: true,
  showCreate: true,
  showEdit: true,
  showDelete: true,
  pageSizeOptions: [5, 10, 25],
  defaultPageSize: 10,
};

// Template
<app-crud-table
  [config]="crudConfig"
  [data]="facade.vm.items()"
  (onCreate)="openCreate()"
  (onEdit)="openEdit($event)"
  (onDelete)="confirmDelete($event)"
/>
```

### Uso de CrudFormDialog

```typescript
const formFields: FormField[] = [
  { key: 'name', label: 'Nombre', type: 'text', required: true },
  { key: 'description', label: 'Descripción', type: 'textarea', rows: 3 },
  { key: 'price', label: 'Precio', type: 'number', required: true },
  { key: 'category', label: 'Categoría', type: 'select', options: [
    { value: 'cat1', label: 'Categoría 1' },
    { value: 'cat2', label: 'Categoría 2' },
  ]},
  { key: 'active', label: 'Activo', type: 'checkbox' },
];

const dialogRef = this.dialog.open(CrudFormDialogComponent, {
  data: {
    title: 'Nuevo Producto',
    fields: formFields,
    data: existingData, // Para modo edición
    submitLabel: 'Guardar',
    cancelLabel: 'Cancelar',
  },
});

dialogRef.afterClosed().subscribe(result => {
  if (result) {
    // result contiene los valores del formulario
  }
});
```

---

## Naming Conventions

### Archivos

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Componente | `*.component.ts` | `badge.component.ts` |
| Template | `*.component.html` | `badge.component.html` |
| Estilos | `*.component.scss` | `badge.component.scss` |
| Tipos | `*.types.ts` | `crud-table.types.ts` |
| Página | `*.page.ts` | `products.page.ts` |

### Selectores

```typescript
// Átomos, Moléculas, Organismos
selector: 'app-badge'
selector: 'app-search-box'
selector: 'app-crud-table'

// Páginas
selector: 'app-products-page'
selector: 'app-dashboard-page'

// Layouts
selector: 'app-oferente-layout'
```

### Clases

```typescript
// Componentes
class BadgeComponent { }
class SearchBoxComponent { }
class CrudTableComponent { }

// Páginas
class ProductsPageComponent { }
class DashboardPageComponent { }
```
