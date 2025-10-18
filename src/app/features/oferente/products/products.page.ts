// Oferente Products Page Component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CrudTableComponent } from '../../../shared/components/crud/crud-table.component';
import { CrudFormDialogComponent, FormField } from '../../../shared/components/crud/crud-form-dialog.component';
import { CrudConfig, CrudColumn, CrudAction } from '../../../shared/components/crud/crud-table.types';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
  imageUrl?: string;
  createdAt: Date;
}

@Component({
  selector: 'app-oferente-products',
  standalone: true,
  imports: [
    CommonModule,
    CrudTableComponent,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <app-crud-table
      [config]="crudConfig"
      [data]="products"
      (onCreate)="openCreateDialog()"
      (onEdit)="openEditDialog($event)"
      (onDelete)="confirmDelete($event)"
    />
  `,
})
export class OferenteProductsPageComponent implements OnInit {
  products: Product[] = [];

  crudConfig: CrudConfig<Product> = {
    title: 'Mis Productos',
    showSearch: true,
    showCreate: true,
    showEdit: true,
    showDelete: true,
    showExport: true,
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    emptyMessage: 'No tienes productos creados aún',
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
        key: 'price',
        label: 'Precio',
        type: 'number',
        sortable: true,
        align: 'right',
        format: (value) => `$${value.toLocaleString('es-CL')}`,
      },
      {
        key: 'stock',
        label: 'Stock',
        type: 'number',
        sortable: true,
        align: 'center',
        format: (value) => value > 0 ? value.toString() : 'Sin stock',
      },
      {
        key: 'active',
        label: 'Estado',
        type: 'boolean',
        sortable: true,
        align: 'center',
      },
      {
        key: 'createdAt',
        label: 'Creado',
        type: 'date',
        sortable: true,
      },
    ],
    actions: [
      {
        label: 'Duplicar',
        icon: 'content_copy',
        color: 'primary',
        tooltip: 'Duplicar producto',
        handler: (product) => this.duplicateProduct(product),
      },
      {
        label: 'Ver público',
        icon: 'visibility',
        color: 'accent',
        tooltip: 'Ver en sitio público',
        handler: (product) => this.viewPublic(product),
        show: (product) => product.active,
      },
    ],
  };

  formFields: FormField[] = [
    {
      key: 'name',
      label: 'Nombre del producto',
      type: 'text',
      required: true,
      placeholder: 'Ej: Notebook HP',
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      rows: 4,
      placeholder: 'Describe tu producto...',
      hint: 'Máximo 500 caracteres',
    },
    {
      key: 'category',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: [
        { value: 'Electrónica', label: 'Electrónica' },
        { value: 'Ropa', label: 'Ropa' },
        { value: 'Alimentos', label: 'Alimentos' },
        { value: 'Hogar', label: 'Hogar' },
        { value: 'Deportes', label: 'Deportes' },
        { value: 'Otros', label: 'Otros' },
      ],
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
      key: 'stock',
      label: 'Stock disponible',
      type: 'number',
      required: true,
      placeholder: '0',
    },
    {
      key: 'imageUrl',
      label: 'Imagen del producto',
      type: 'file',
      hint: 'Formatos: JPG, PNG. Máximo 2MB',
    },
    {
      key: 'active',
      label: 'Publicar producto (visible en el sitio público)',
      type: 'checkbox',
    },
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // Mock data - Replace with actual API call
    this.products = [
      {
        id: '1',
        name: 'Notebook HP Pavilion',
        description: 'Laptop de alto rendimiento con 16GB RAM y SSD 512GB',
        price: 599990,
        category: 'Electrónica',
        stock: 5,
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200',
        createdAt: new Date('2025-01-15'),
      },
      {
        id: '2',
        name: 'Mouse Logitech MX Master 3',
        description: 'Mouse ergonómico inalámbrico premium',
        price: 89990,
        category: 'Electrónica',
        stock: 12,
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200',
        createdAt: new Date('2025-01-20'),
      },
      {
        id: '3',
        name: 'Teclado Mecánico RGB',
        description: 'Teclado gaming con switches azules',
        price: 79990,
        category: 'Electrónica',
        stock: 0,
        active: false,
        createdAt: new Date('2025-02-01'),
      },
      {
        id: '4',
        name: 'Monitor LG 27" 4K',
        description: 'Monitor IPS 4K HDR con 99% sRGB',
        price: 349990,
        category: 'Electrónica',
        stock: 3,
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200',
        createdAt: new Date('2025-02-10'),
      },
      {
        id: '5',
        name: 'Silla Gamer Ergonómica',
        description: 'Silla de oficina con soporte lumbar ajustable',
        price: 189990,
        category: 'Hogar',
        stock: 8,
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200',
        createdAt: new Date('2025-03-05'),
      },
    ];
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CrudFormDialogComponent, {
      width: '600px',
      data: {
        title: 'Crear Nuevo Producto',
        fields: this.formFields,
        submitLabel: 'Crear Producto',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createProduct(result);
      }
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(CrudFormDialogComponent, {
      width: '600px',
      data: {
        title: 'Editar Producto',
        fields: this.formFields,
        data: product,
        submitLabel: 'Guardar Cambios',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProduct(product.id, result);
      }
    });
  }

  createProduct(data: Partial<Product>): void {
    const newProduct: Product = {
      ...data as Product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };

    this.products = [...this.products, newProduct];
    this.showMessage('Producto creado exitosamente');
  }

  updateProduct(id: string, data: Partial<Product>): void {
    this.products = this.products.map(p =>
      p.id === id ? { ...p, ...data } : p
    );
    this.showMessage('Producto actualizado exitosamente');
  }

  confirmDelete(product: Product): void {
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      this.deleteProduct(product.id);
    }
  }

  deleteProduct(id: string): void {
    this.products = this.products.filter(p => p.id !== id);
    this.showMessage('Producto eliminado exitosamente');
  }

  duplicateProduct(product: Product): void {
    const duplicated: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      name: `${product.name} (Copia)`,
      active: false,
      createdAt: new Date(),
    };
    this.products = [...this.products, duplicated];
    this.showMessage('Producto duplicado exitosamente');
  }

  viewPublic(product: Product): void {
    // TODO: Navigate to public view
    this.showMessage(`Ver "${product.name}" en sitio público`);
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
