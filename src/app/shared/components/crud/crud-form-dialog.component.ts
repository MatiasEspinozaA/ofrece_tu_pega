// Generic CRUD Form Dialog Component
import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[]; // For select
  validators?: any[];
  hint?: string;
  rows?: number; // For textarea
}

export interface CrudFormConfig {
  title: string;
  fields: FormField[];
  data?: any; // For edit mode
  submitLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-crud-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  template: `
    <div class="crud-form-dialog">
      <h2 mat-dialog-title>
        <mat-icon>{{ isEditMode() ? 'edit' : 'add_circle' }}</mat-icon>
        {{ config.title }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="form" class="crud-form">
          @for (field of config.fields; track field.key) {
            <div class="form-field">
              @switch (field.type) {
                @case ('textarea') {
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ field.label }}</mat-label>
                    <textarea
                      matInput
                      [formControlName]="field.key"
                      [placeholder]="field.placeholder || ''"
                      [rows]="field.rows || 4"
                    ></textarea>
                    @if (field.hint) {
                      <mat-hint>{{ field.hint }}</mat-hint>
                    }
                    @if (form.get(field.key)?.hasError('required') && form.get(field.key)?.touched) {
                      <mat-error>Este campo es requerido</mat-error>
                    }
                  </mat-form-field>
                }
                @case ('select') {
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ field.label }}</mat-label>
                    <mat-select [formControlName]="field.key">
                      @for (option of field.options; track option.value) {
                        <mat-option [value]="option.value">
                          {{ option.label }}
                        </mat-option>
                      }
                    </mat-select>
                    @if (field.hint) {
                      <mat-hint>{{ field.hint }}</mat-hint>
                    }
                    @if (form.get(field.key)?.hasError('required') && form.get(field.key)?.touched) {
                      <mat-error>Este campo es requerido</mat-error>
                    }
                  </mat-form-field>
                }
                @case ('checkbox') {
                  <mat-checkbox [formControlName]="field.key" class="checkbox-field">
                    {{ field.label }}
                  </mat-checkbox>
                  @if (field.hint) {
                    <div class="hint-text">{{ field.hint }}</div>
                  }
                }
                @case ('date') {
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ field.label }}</mat-label>
                    <input
                      matInput
                      [matDatepicker]="picker"
                      [formControlName]="field.key"
                      [placeholder]="field.placeholder || ''"
                    />
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                    @if (field.hint) {
                      <mat-hint>{{ field.hint }}</mat-hint>
                    }
                    @if (form.get(field.key)?.hasError('required') && form.get(field.key)?.touched) {
                      <mat-error>Este campo es requerido</mat-error>
                    }
                  </mat-form-field>
                }
                @case ('file') {
                  <div class="file-upload-field">
                    <mat-label>{{ field.label }}</mat-label>
                    <div class="file-input-wrapper">
                      <input
                        type="file"
                        #fileInput
                        (change)="onFileSelected($event, field.key)"
                        accept="image/*"
                        style="display: none"
                      />
                      <button
                        type="button"
                        mat-stroked-button
                        (click)="fileInput.click()"
                      >
                        <mat-icon>upload_file</mat-icon>
                        Seleccionar archivo
                      </button>
                      @if (fileNames[field.key]) {
                        <span class="file-name">{{ fileNames[field.key] }}</span>
                      }
                    </div>
                    @if (field.hint) {
                      <div class="hint-text">{{ field.hint }}</div>
                    }
                  </div>
                }
                @default {
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ field.label }}</mat-label>
                    <input
                      matInput
                      [type]="field.type"
                      [formControlName]="field.key"
                      [placeholder]="field.placeholder || ''"
                    />
                    @if (field.hint) {
                      <mat-hint>{{ field.hint }}</mat-hint>
                    }
                    @if (form.get(field.key)?.hasError('required') && form.get(field.key)?.touched) {
                      <mat-error>Este campo es requerido</mat-error>
                    }
                    @if (form.get(field.key)?.hasError('email') && form.get(field.key)?.touched) {
                      <mat-error>Email inválido</mat-error>
                    }
                  </mat-form-field>
                }
              }
            </div>
          }
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ config.cancelLabel || 'Cancelar' }}
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="!form.valid"
        >
          {{ config.submitLabel || (isEditMode() ? 'Guardar cambios' : 'Crear') }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .crud-form-dialog {
      min-width: 500px;

      @media (max-width: 768px) {
        min-width: auto;
        width: 100%;
      }
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin: 0;
      padding: var(--spacing-lg);
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;

      mat-icon {
        color: var(--color-primary);
      }
    }

    mat-dialog-content {
      padding: var(--spacing-lg);
      max-height: 70vh;
      overflow-y: auto;
    }

    .crud-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);

      .form-field {
        width: 100%;

        .full-width {
          width: 100%;
        }

        .checkbox-field {
          margin: var(--spacing-sm) 0;
        }

        .hint-text {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .file-upload-field {
          mat-label {
            display: block;
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }

          .file-input-wrapper {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);

            .file-name {
              font-size: 14px;
              color: #333;
            }
          }
        }
      }
    }

    mat-dialog-actions {
      padding: var(--spacing-md) var(--spacing-lg);
      border-top: 1px solid #e0e0e0;
      gap: var(--spacing-sm);
    }
  `],
})
export class CrudFormDialogComponent {
  form: FormGroup;
  isEditMode = signal(false);
  fileNames: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrudFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: CrudFormConfig
  ) {
    this.isEditMode.set(!!config.data);
    this.form = this.buildForm();
  }

  private buildForm(): FormGroup {
    const group: any = {};

    this.config.fields.forEach(field => {
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      if (field.validators) {
        validators.push(...field.validators);
      }

      const value = this.config.data?.[field.key] || null;
      group[field.key] = [value, validators];
    });

    return this.fb.group(group);
  }

  onFileSelected(event: Event, fieldKey: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileNames[fieldKey] = file.name;

      // Convert to base64 or handle file upload
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ [fieldKey]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
