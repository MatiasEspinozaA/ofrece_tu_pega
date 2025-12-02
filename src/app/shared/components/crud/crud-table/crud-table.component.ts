// Generic CRUD Table Component
import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
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
import { CrudColumn, CrudConfig } from './crud-table.types';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudTableComponent<T = unknown> implements OnInit {
  // Input signals for reactive data binding
  readonly config = input.required<CrudConfig<T>>();
  readonly data = input.required<T[]>();

  @Output() onCreate = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();
  @Output() onView = new EventEmitter<T>();

  // Internal state as signals
  readonly searchTerm = signal('');
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly sortColumn = signal('');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  // Computed: filtered data based on search and sort
  readonly filteredData = computed(() => {
    let filtered = [...this.data()];
    const config = this.config();
    const term = this.searchTerm();
    const sortCol = this.sortColumn();
    const sortDir = this.sortDirection();

    // Apply search filter
    if (term) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter((row: T) =>
        config.columns.some(col => {
          const value = this.getCellValue(row, col.key);
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply sorting
    if (sortCol) {
      filtered.sort((a: T, b: T) => {
        const aVal = this.getCellValue(a, sortCol) as string | number | null;
        const bVal = this.getCellValue(b, sortCol) as string | number | null;

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sortDir === 'asc' ? 1 : -1;
        if (bVal == null) return sortDir === 'asc' ? -1 : 1;

        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  });

  // Computed: paginated data
  readonly paginatedData = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredData().slice(start, end);
  });

  // Computed: displayed columns
  readonly displayedColumns = computed(() => {
    const columns = this.config().columns.map(col => col.key.toString());
    if (this.hasActions()) {
      columns.push('actions');
    }
    return columns;
  });

  ngOnInit(): void {
    const defaultPageSize = this.config().defaultPageSize;
    if (defaultPageSize) {
      this.pageSize.set(defaultPageSize);
    }
  }

  hasActions(): boolean {
    const config = this.config();
    return !!(
      config.showEdit ||
      config.showDelete ||
      (config.actions && config.actions.length > 0)
    );
  }

  getCellValue(row: T, key: string | keyof T): unknown {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce((obj: unknown, k: string) => {
        if (obj && typeof obj === 'object') {
          return (obj as Record<string, unknown>)[k];
        }
        return undefined;
      }, row);
    }
    return (row as Record<string, unknown>)[key as string];
  }

  formatCellValue(row: T, column: CrudColumn<T>): string {
    const value = this.getCellValue(row, column.key);

    if (column.format) {
      return column.format(value, row);
    }

    // Default formatting for date type
    if (column.type === 'date' && value) {
      const date = value instanceof Date ? value : new Date(value as string | number);
      return date.toLocaleDateString('es-CL');
    }

    return String(value ?? '');
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.pageIndex.set(0);
  }

  onSortChange(sort: Sort): void {
    this.sortColumn.set(sort.active);
    this.sortDirection.set(sort.direction as 'asc' | 'desc');
  }

  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
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
    const headers = this.config().columns.map(col => col.label).join(',');
    const rows = data.map(row =>
      this.config()
        .columns.map(col => {
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
