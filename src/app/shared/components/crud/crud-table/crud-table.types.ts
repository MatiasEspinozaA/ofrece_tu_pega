// CRUD Table Types and Interfaces

export interface CrudColumn<T = any> {
  key: keyof T | string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'badge' | 'custom';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any, row: T) => string;
  customTemplate?: any; // For custom cell rendering
}

export interface CrudAction<T = any> {
  label: string;
  icon: string;
  color?: 'primary' | 'accent' | 'warn';
  tooltip?: string;
  handler: (row: T) => void;
  show?: (row: T) => boolean; // Conditional visibility
}

export interface CrudConfig<T = any> {
  title: string;
  columns: CrudColumn<T>[];
  actions?: CrudAction<T>[];
  showSearch?: boolean;
  showCreate?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showExport?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  emptyMessage?: string;
}

export interface CrudEvents<T = any> {
  onCreate?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onCustomAction?: (action: string, row: T) => void;
}
