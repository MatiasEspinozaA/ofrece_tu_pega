// Generic CRUD Table Component
import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { CrudColumn, CrudAction, CrudConfig } from './crud-table.types';

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
    MatChipsModule,
    MatMenuModule,
  ],
  template: `
    <div class="crud-table-container">
      <!-- Header -->
      <div class="crud-header">
        <div class="crud-title">
          <h2>{{ config.title }}</h2>
          <span class="record-count">{{ filteredData().length }} registros</span>
        </div>

        <div class="crud-actions">
          @if (config.showSearch) {
            <mat-form-field appearance="outline" class="search-field">
              <mat-icon matPrefix>search</mat-icon>
              <input
                matInput
                placeholder="Buscar..."
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange()"
              />
            </mat-form-field>
          }

          @if (config.showExport) {
            <button mat-icon-button matTooltip="Exportar" [matMenuTriggerFor]="exportMenu">
              <mat-icon>download</mat-icon>
            </button>
          }

          @if (config.showCreate) {
            <button
              mat-raised-button
              color="primary"
              (click)="onCreate.emit()"
            >
              <mat-icon>add</mat-icon>
              Crear nuevo
            </button>
          }
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table
          mat-table
          [dataSource]="paginatedData()"
          matSort
          (matSortChange)="onSortChange($event)"
          class="crud-table"
        >
          <!-- Dynamic Columns -->
          @for (column of config.columns; track column.key) {
            <ng-container [matColumnDef]="column.key.toString()">
              <th
                mat-header-cell
                *matHeaderCellDef
                [mat-sort-header]="column.sortable !== false ? column.key.toString() : ''"
                [style.width]="column.width"
                [style.text-align]="column.align || 'left'"
              >
                {{ column.label }}
              </th>
              <td
                mat-cell
                *matCellDef="let row"
                [style.text-align]="column.align || 'left'"
              >
                @switch (column.type) {
                  @case ('image') {
                    @if (getCellValue(row, column.key)) {
                      <img
                        [src]="getCellValue(row, column.key)"
                        [alt]="column.label"
                        class="cell-image"
                      />
                    } @else {
                      <mat-icon class="no-image">image_not_supported</mat-icon>
                    }
                  }
                  @case ('boolean') {
                    <mat-icon [class.active]="getCellValue(row, column.key)">
                      {{ getCellValue(row, column.key) ? 'check_circle' : 'cancel' }}
                    </mat-icon>
                  }
                  @case ('badge') {
                    <mat-chip class="status-chip">
                      {{ formatCellValue(row, column) }}
                    </mat-chip>
                  }
                  @case ('date') {
                    {{ formatCellValue(row, column) || (getCellValue(row, column.key) | date:'dd/MM/yyyy') }}
                  }
                  @default {
                    {{ formatCellValue(row, column) || getCellValue(row, column.key) }}
                  }
                }
              </td>
            </ng-container>
          }

          <!-- Actions Column -->
          @if (hasActions()) {
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef style="width: 120px; text-align: center">
                Acciones
              </th>
              <td mat-cell *matCellDef="let row" style="text-align: center">
                <div class="action-buttons">
                  @if (config.showEdit) {
                    <button
                      mat-icon-button
                      color="primary"
                      matTooltip="Editar"
                      (click)="onEdit.emit(row)"
                    >
                      <mat-icon>edit</mat-icon>
                    </button>
                  }

                  @if (config.showDelete) {
                    <button
                      mat-icon-button
                      color="warn"
                      matTooltip="Eliminar"
                      (click)="onDelete.emit(row)"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  }

                  @if (config.actions && config.actions.length > 0) {
                    @for (action of config.actions; track action.label) {
                      @if (!action.show || action.show(row)) {
                        <button
                          mat-icon-button
                          [color]="action.color || 'primary'"
                          [matTooltip]="action.tooltip || action.label"
                          (click)="action.handler(row)"
                        >
                          <mat-icon>{{ action.icon }}</mat-icon>
                        </button>
                      }
                    }
                  }
                </div>
              </td>
            </ng-container>
          }

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns" class="table-row"></tr>

          <!-- Empty State -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-state" [attr.colspan]="displayedColumns.length">
              <div class="empty-content">
                <mat-icon>inbox</mat-icon>
                <p>{{ config.emptyMessage || 'No hay registros para mostrar' }}</p>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Paginator -->
      @if (data.length > (config.defaultPageSize || 10)) {
        <mat-paginator
          [length]="filteredData().length"
          [pageSize]="pageSize"
          [pageSizeOptions]="config.pageSizeOptions || [5, 10, 25, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        >
        </mat-paginator>
      }
    </div>

    <!-- Export Menu -->
    <mat-menu #exportMenu="matMenu">
      <button mat-menu-item (click)="exportToCSV()">
        <mat-icon>table_chart</mat-icon>
        <span>Exportar a CSV</span>
      </button>
      <button mat-menu-item (click)="exportToJSON()">
        <mat-icon>code</mat-icon>
        <span>Exportar a JSON</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .crud-table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .crud-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg);
      border-bottom: 1px solid #e0e0e0;
      flex-wrap: wrap;
      gap: var(--spacing-md);

      .crud-title {
        display: flex;
        align-items: baseline;
        gap: var(--spacing-sm);

        h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 500;
        }

        .record-count {
          font-size: 14px;
          color: #666;
        }
      }

      .crud-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);

        .search-field {
          width: 300px;
          margin: 0;

          @media (max-width: 768px) {
            width: 200px;
          }
        }
      }
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .crud-table {
      width: 100%;

      th {
        background-color: #f5f5f5;
        font-weight: 600;
        color: #333;
      }

      .table-row {
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f9f9f9;
        }
      }

      .cell-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
      }

      .no-image {
        color: #ccc;
        font-size: 40px;
        width: 40px;
        height: 40px;
      }

      mat-icon.active {
        color: var(--color-primary);
      }

      .status-chip {
        font-size: 12px;
        min-height: 24px;
        height: 24px;
      }

      .action-buttons {
        display: flex;
        gap: 4px;
        justify-content: center;
      }

      .empty-state {
        text-align: center;
        padding: var(--spacing-xxl) !important;

        .empty-content {
          mat-icon {
            font-size: 64px;
            width: 64px;
            height: 64px;
            color: #ccc;
          }

          p {
            margin-top: var(--spacing-md);
            color: #999;
            font-size: 16px;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .crud-header {
        flex-direction: column;
        align-items: stretch;

        .crud-actions {
          justify-content: space-between;
        }
      }
    }
  `]
})
export class CrudTableComponent<T = any> {
  @Input({ required: true }) config!: CrudConfig<T>;
  @Input({ required: true }) data: T[] = [];

  @Output() onCreate = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();
  @Output() onView = new EventEmitter<T>();

  searchTerm = '';
  pageSize = 10;
  pageIndex = 0;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  filteredData = computed(() => {
    let filtered = [...this.data];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((row: any) =>
        this.config.columns.some(col => {
          const value = this.getCellValue(row, col.key);
          return value?.toString().toLowerCase().includes(term);
        })
      );
    }

    // Apply sorting
    if (this.sortColumn) {
      filtered.sort((a: any, b: any) => {
        const aVal = this.getCellValue(a, this.sortColumn);
        const bVal = this.getCellValue(b, this.sortColumn);

        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  });

  paginatedData = computed(() => {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredData().slice(start, end);
  });

  get displayedColumns(): string[] {
    const columns = this.config.columns.map(col => col.key.toString());
    if (this.hasActions()) {
      columns.push('actions');
    }
    return columns;
  }

  ngOnInit(): void {
    this.pageSize = this.config.defaultPageSize || 10;
  }

  hasActions(): boolean {
    return !!(
      this.config.showEdit ||
      this.config.showDelete ||
      (this.config.actions && this.config.actions.length > 0)
    );
  }

  getCellValue(row: any, key: string | keyof T): any {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce((obj, k) => obj?.[k], row);
    }
    return row[key];
  }

  formatCellValue(row: T, column: CrudColumn<T>): string {
    const value = this.getCellValue(row, column.key);
    return column.format ? column.format(value, row) : value;
  }

  onSearchChange(): void {
    this.pageIndex = 0;
  }

  onSortChange(sort: Sort): void {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction as 'asc' | 'desc';
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  exportToCSV(): void {
    const csvData = this.convertToCSV(this.filteredData());
    this.downloadFile(csvData, 'export.csv', 'text/csv');
  }

  exportToJSON(): void {
    const jsonData = JSON.stringify(this.filteredData(), null, 2);
    this.downloadFile(jsonData, 'export.json', 'application/json');
  }

  private convertToCSV(data: T[]): string {
    const headers = this.config.columns.map(col => col.label).join(',');
    const rows = data.map(row =>
      this.config.columns
        .map(col => {
          const value = this.formatCellValue(row, col) || this.getCellValue(row, col.key);
          return `"${value}"`;
        })
        .join(',')
    );
    return [headers, ...rows].join('\n');
  }

  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
