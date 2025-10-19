import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CrudTableComponent } from './crud-table.component';
import { CrudConfig } from './crud-table.types';

describe('CrudTableComponent', () => {
  let component: CrudTableComponent;
  let fixture: ComponentFixture<CrudTableComponent>;

  const mockConfig: CrudConfig<any> = {
    title: 'Test Table',
    showSearch: true,
    showCreate: true,
    showEdit: true,
    showDelete: true,
    columns: [
      {
        key: 'id',
        label: 'ID',
        type: 'text',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'text',
      },
    ],
  };

  const mockData = [
    { id: '1', name: 'Test 1' },
    { id: '2', name: 'Test 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudTableComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudTableComponent);
    component = fixture.componentInstance;
    component.config = mockConfig;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct number of records', () => {
    expect(component.filteredData().length).toBe(2);
  });

  it('should filter data on search', () => {
    component.searchTerm = 'Test 1';
    component.onSearchChange();
    fixture.detectChanges();
    expect(component.filteredData().length).toBe(1);
  });

  it('should emit onCreate event', () => {
    spyOn(component.onCreate, 'emit');
    component.onCreate.emit();
    expect(component.onCreate.emit).toHaveBeenCalled();
  });

  it('should paginate data correctly', () => {
    component.pageSize = 1;
    component.pageIndex = 0;
    const paginatedData = component.paginatedData();
    expect(paginatedData.length).toBe(1);
  });
});
