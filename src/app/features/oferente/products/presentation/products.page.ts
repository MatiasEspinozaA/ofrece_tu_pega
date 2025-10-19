// Oferente Products Page Component - Refactored with Clean Architecture
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CrudTableComponent } from '../../../../shared/components/crud/crud-table.component';
import { CrudFormDialogComponent, FormField } from '../../../../shared/components/crud/crud-form-dialog.component';
import { CrudConfig } from '../../../../shared/components/crud/crud-table.types';
import { OferenteProductsFacade } from './oferente-products.facade';
import { OferenteProduct } from '../domain/entities';

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
      [data]="facade.vm.products()"
      (onCreate)="openCreateDialog()"
      (onEdit)="openEditDialog($event)"
      (onDelete)="confirmDelete($event)"
    />
  `,
})
export class OferenteProductsPageComponent implements OnInit {
  crudConfig: CrudConfig<OferenteProduct> = {
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
    readonly facade: OferenteProductsFacade,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.facade.loadProducts();
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
        this.facade.createProduct(result);
        this.showMessage('Producto creado exitosamente');
      }
    });
  }

  openEditDialog(product: OferenteProduct): void {
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
        this.facade.updateProduct(product.id, result);
        this.showMessage('Producto actualizado exitosamente');
      }
    });
  }

  confirmDelete(product: OferenteProduct): void {
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      this.facade.deleteProduct(product.id);
      this.showMessage('Producto eliminado exitosamente');
    }
  }

  duplicateProduct(product: OferenteProduct): void {
    this.facade.duplicateProduct(product.id);
    this.showMessage('Producto duplicado exitosamente');
  }

  viewPublic(product: OferenteProduct): void {
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
