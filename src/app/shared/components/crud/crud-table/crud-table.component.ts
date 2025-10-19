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
