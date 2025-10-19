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
  templateUrl: './crud-form-dialog.component.html',
  styleUrl: './crud-form-dialog.component.scss',
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
