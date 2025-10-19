import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CrudFormDialogComponent } from './crud-form-dialog.component';

describe('CrudFormDialogComponent', () => {
  let component: CrudFormDialogComponent;
  let fixture: ComponentFixture<CrudFormDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CrudFormDialogComponent>>;

  const mockConfig = {
    title: 'Test Form',
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text' as const,
        required: true,
      },
    ],
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [CrudFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockConfig },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with config fields', () => {
    expect(component.form.get('name')).toBeTruthy();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not submit invalid form', () => {
    component.onSubmit();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should submit valid form', () => {
    component.form.patchValue({ name: 'Test Name' });
    component.onSubmit();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ name: 'Test Name' });
  });
});
