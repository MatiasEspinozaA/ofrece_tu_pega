# Guía de Uso del Sistema CRUD Genérico

## Componentes del Sistema

El sistema CRUD está compuesto por 3 archivos principales en `src/app/shared/components/crud/`:

1. **crud-table.types.ts** - Tipos e interfaces
2. **crud-table.component.ts** - Tabla genérica con paginación, búsqueda y ordenamiento
3. **crud-form-dialog.component.ts** - Formulario modal genérico

## Cómo Crear un Nuevo Mantenedor (Ejemplo: Servicios)

### Paso 1: Crear el Componente

```typescript
// src/app/features/oferente/services/services.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CrudTableComponent } from '../../../shared/components/crud/crud-table.component';
import { CrudFormDialogComponent, FormField } from '../../../shared/components/crud/crud-form-dialog.component';
import { CrudConfig } from '../../../shared/components/crud/crud-table.types';

// 1. Define tu interfaz
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // en minutos
  category: string;
  active: boolean;
  imageUrl?: string;
  createdAt: Date;
}

@Component({
  selector: 'app-oferente-services',
  standalone: true,
  imports: [
    CommonModule,
    CrudTableComponent,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: \`
    <app-crud-table
      [config]="crudConfig"
      [data]="services"
      (onCreate)="openCreateDialog()"
      (onEdit)="openEditDialog($event)"
      (onDelete)="confirmDelete($event)"
    />
  \`,
})
export class OferenteServicesPageComponent {
  services: Service[] = [];

  // 2. Configura las columnas de la tabla
  crudConfig: CrudConfig<Service> = {
    title: 'Mis Servicios',
    showSearch: true,
    showCreate: true,
    showEdit: true,
    showDelete: true,
    showExport: true,
    defaultPageSize: 10,
    emptyMessage: 'No tienes servicios creados aún',
    columns: [
      {
        key: 'imageUrl',
        label: 'Imagen',
        type: 'image',
        width: '80px',
        sortable: false,
      },
      {
        key: 'name',
        label: 'Nombre',
        type: 'text',
        sortable: true,
      },
      {
        key: 'category',
        label: 'Categoría',
        type: 'badge',
        sortable: true,
      },
      {
        key: 'duration',
        label: 'Duración',
        type: 'number',
        sortable: true,
        format: (value) => \`\${value} min\`,
      },
      {
        key: 'price',
        label: 'Precio',
        type: 'number',
        sortable: true,
        align: 'right',
        format: (value) => \`$\${value.toLocaleString('es-CL')}\`,
      },
      {
        key: 'active',
        label: 'Estado',
        type: 'boolean',
        sortable: true,
        align: 'center',
      },
    ],
    actions: [
      {
        label: 'Reservas',
        icon: 'calendar_month',
        color: 'primary',
        tooltip: 'Ver reservas',
        handler: (service) => this.viewReservations(service),
      },
    ],
  };

  // 3. Configura los campos del formulario
  formFields: FormField[] = [
    {
      key: 'name',
      label: 'Nombre del servicio',
      type: 'text',
      required: true,
      placeholder: 'Ej: Corte de cabello',
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      rows: 4,
      placeholder: 'Describe tu servicio...',
    },
    {
      key: 'category',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: [
        { value: 'Belleza', label: 'Belleza' },
        { value: 'Salud', label: 'Salud' },
        { value: 'Educación', label: 'Educación' },
        { value: 'Tecnología', label: 'Tecnología' },
        { value: 'Otros', label: 'Otros' },
      ],
    },
    {
      key: 'duration',
      label: 'Duración (minutos)',
      type: 'number',
      required: true,
      placeholder: '60',
      hint: 'Tiempo estimado del servicio',
    },
    {
      key: 'price',
      label: 'Precio',
      type: 'number',
      required: true,
      placeholder: '0',
      hint: 'Precio en pesos chilenos',
    },
    {
      key: 'imageUrl',
      label: 'Imagen del servicio',
      type: 'file',
      hint: 'Formatos: JPG, PNG. Máximo 2MB',
    },
    {
      key: 'active',
      label: 'Publicar servicio',
      type: 'checkbox',
    },
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loadServices();
  }

  loadServices(): void {
    // Aquí cargarías desde tu API
    this.services = [
      {
        id: '1',
        name: 'Corte de cabello',
        description: 'Corte profesional con estilo moderno',
        price: 15000,
        duration: 30,
        category: 'Belleza',
        active: true,
        createdAt: new Date(),
      },
      // ... más servicios
    ];
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CrudFormDialogComponent, {
      width: '600px',
      data: {
        title: 'Crear Nuevo Servicio',
        fields: this.formFields,
        submitLabel: 'Crear Servicio',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createService(result);
      }
    });
  }

  openEditDialog(service: Service): void {
    const dialogRef = this.dialog.open(CrudFormDialogComponent, {
      width: '600px',
      data: {
        title: 'Editar Servicio',
        fields: this.formFields,
        data: service,
        submitLabel: 'Guardar Cambios',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateService(service.id, result);
      }
    });
  }

  createService(data: Partial<Service>): void {
    const newService: Service = {
      ...data as Service,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    this.services = [...this.services, newService];
    this.showMessage('Servicio creado exitosamente');
  }

  updateService(id: string, data: Partial<Service>): void {
    this.services = this.services.map(s =>
      s.id === id ? { ...s, ...data } : s
    );
    this.showMessage('Servicio actualizado exitosamente');
  }

  confirmDelete(service: Service): void {
    if (confirm(\`¿Estás seguro de eliminar "\${service.name}"?\`)) {
      this.deleteService(service.id);
    }
  }

  deleteService(id: string): void {
    this.services = this.services.filter(s => s.id !== id);
    this.showMessage('Servicio eliminado exitosamente');
  }

  viewReservations(service: Service): void {
    this.showMessage(\`Ver reservas de "\${service.name}"\`);
    // TODO: Navigate to reservations page
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
```

### Paso 2: Agregar la Ruta

En `src/app/features/oferente/oferente.routes.ts`:

```typescript
{
  path: 'services',
  loadComponent: () =>
    import('./services/services.page').then(m => m.OferenteServicesPageComponent),
},
```

## Configuración de Columnas

### Tipos de Columnas Disponibles

```typescript
columns: [
  // Texto simple
  { key: 'name', label: 'Nombre', type: 'text', sortable: true },

  // Número con formato personalizado
  {
    key: 'price',
    label: 'Precio',
    type: 'number',
    format: (value) => \`$\${value.toLocaleString()}\`
  },

  // Fecha
  { key: 'createdAt', label: 'Fecha', type: 'date', sortable: true },

  // Boolean (iconos check/cancel)
  { key: 'active', label: 'Activo', type: 'boolean', align: 'center' },

  // Imagen
  { key: 'imageUrl', label: 'Imagen', type: 'image', width: '80px' },

  // Badge/chip
  { key: 'status', label: 'Estado', type: 'badge' },
]
```

### Acciones Personalizadas

```typescript
actions: [
  {
    label: 'Ver detalles',
    icon: 'visibility',
    color: 'primary',
    tooltip: 'Ver más información',
    handler: (row) => this.viewDetails(row),
  },
  {
    label: 'Duplicar',
    icon: 'content_copy',
    color: 'accent',
    handler: (row) => this.duplicate(row),
    show: (row) => row.allowDuplicate, // Condicional
  },
]
```

## Tipos de Campos de Formulario

```typescript
formFields: FormField[] = [
  // Input de texto
  { key: 'name', label: 'Nombre', type: 'text', required: true },

  // Email con validación
  { key: 'email', label: 'Email', type: 'email', required: true },

  // Número
  { key: 'age', label: 'Edad', type: 'number', placeholder: '18' },

  // Textarea
  {
    key: 'description',
    label: 'Descripción',
    type: 'textarea',
    rows: 4,
    hint: 'Máximo 500 caracteres'
  },

  // Select / Dropdown
  {
    key: 'category',
    label: 'Categoría',
    type: 'select',
    required: true,
    options: [
      { value: 'cat1', label: 'Categoría 1' },
      { value: 'cat2', label: 'Categoría 2' },
    ]
  },

  // Checkbox
  {
    key: 'active',
    label: 'Publicar ahora',
    type: 'checkbox',
    hint: 'Será visible inmediatamente'
  },

  // Date picker
  { key: 'startDate', label: 'Fecha inicio', type: 'date' },

  // File upload
  {
    key: 'image',
    label: 'Imagen',
    type: 'file',
    hint: 'JPG, PNG. Máximo 2MB'
  },
]
```

## Funcionalidades Incluidas

### Tabla
- ✅ Búsqueda en tiempo real
- ✅ Paginación con selector de tamaño
- ✅ Ordenamiento por columnas
- ✅ Acciones por fila (editar, eliminar, custom)
- ✅ Exportar a CSV/JSON
- ✅ Estado vacío personalizable
- ✅ Responsive

### Formulario
- ✅ Validaciones automáticas
- ✅ Mensajes de error
- ✅ Modo crear/editar
- ✅ Upload de archivos con preview
- ✅ Hints en campos
- ✅ Responsive

## Tips

1. **Siempre define interfaces TypeScript** para tus entidades
2. **Usa format()** para personalizar cómo se muestran los valores
3. **Aprovecha las acciones condicionales** con \`show()\`
4. **Reutiliza formFields** para crear y editar
5. **Implementa confirmación** antes de eliminar
6. **Muestra mensajes** con MatSnackBar para feedback

## Próximos Mantenedores Sugeridos

1. **Noticias/Publicaciones**
   - Campos: título, contenido, imagen, fecha publicación
   - Acciones: preview, programar publicación

2. **Galería**
   - Campos: título, descripción, múltiples imágenes
   - Acciones: ver galería, ordenar imágenes

3. **Contactos/Mensajes**
   - Campos: nombre, email, mensaje, fecha, leído
   - Acciones: marcar leído, responder

4. **Equipo**
   - Campos: nombre, cargo, foto, bio, redes
   - Acciones: ordenar, destacar
