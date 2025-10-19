// Infrastructure: HTTP implementation of Oferente Product Repository
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map, of } from 'rxjs';
import { IOferenteProductRepository } from '../domain/ports';
import { CreateOferenteProductData, OferenteProduct, UpdateOferenteProductData } from '../domain/entities';
import { OferenteProductMapper } from './mappers';
import { OferenteProductDTO } from './oferente-product.dto';

@Injectable()
export class HttpOferenteProductRepository implements IOferenteProductRepository {
  private readonly apiUrl = '/api/oferente/products'; // Change to your actual API endpoint

  // Mock data for demo purposes
  private mockProducts: OferenteProductDTO[] = [
    {
      id: '1',
      name: 'Notebook HP Pavilion',
      description: 'Laptop de alto rendimiento con 16GB RAM y SSD 512GB',
      price: 599990,
      category: 'Electrónica',
      stock: 5,
      active: true,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200',
      createdAt: new Date('2025-01-15').toISOString(),
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
      createdAt: new Date('2025-01-20').toISOString(),
    },
    {
      id: '3',
      name: 'Teclado Mecánico RGB',
      description: 'Teclado gaming con switches azules',
      price: 79990,
      category: 'Electrónica',
      stock: 0,
      active: false,
      createdAt: new Date('2025-02-01').toISOString(),
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
      createdAt: new Date('2025-02-10').toISOString(),
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
      createdAt: new Date('2025-03-05').toISOString(),
    },
  ];

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<OferenteProduct[]> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // return this.http.get<OferenteProductDTO[]>(this.apiUrl).pipe(
    //   map(dtos => dtos.map(dto => OferenteProductMapper.toDomain(dto)))
    // );

    return of(this.mockProducts).pipe(
      delay(500), // Simulate network delay
      map(dtos => dtos.map(dto => OferenteProductMapper.toDomain(dto)))
    );
  }

  getById(id: string): Observable<OferenteProduct> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // return this.http.get<OferenteProductDTO>(`${this.apiUrl}/${id}`).pipe(
    //   map(dto => OferenteProductMapper.toDomain(dto))
    // );

    const dto = this.mockProducts.find(p => p.id === id);
    if (!dto) {
      throw new Error(`Product with id ${id} not found`);
    }
    return of(dto).pipe(
      delay(300),
      map(dto => OferenteProductMapper.toDomain(dto))
    );
  }

  create(data: CreateOferenteProductData): Observable<OferenteProduct> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // const dto = OferenteProductMapper.toCreateDTO(data);
    // return this.http.post<OferenteProductDTO>(this.apiUrl, dto).pipe(
    //   map(dto => OferenteProductMapper.toDomain(dto))
    // );

    const newProduct: OferenteProductDTO = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(
      delay(300),
      map(dto => OferenteProductMapper.toDomain(dto))
    );
  }

  update(id: string, data: UpdateOferenteProductData): Observable<OferenteProduct> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // const dto = OferenteProductMapper.toUpdateDTO(data);
    // return this.http.put<OferenteProductDTO>(`${this.apiUrl}/${id}`, dto).pipe(
    //   map(dto => OferenteProductMapper.toDomain(dto))
    // );

    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updated: OferenteProductDTO = {
      ...this.mockProducts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.mockProducts[index] = updated;
    return of(updated).pipe(
      delay(300),
      map(dto => OferenteProductMapper.toDomain(dto))
    );
  }

  delete(id: string): Observable<void> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);

    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    this.mockProducts.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }

  duplicate(id: string): Observable<OferenteProduct> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // return this.http.post<OferenteProductDTO>(`${this.apiUrl}/${id}/duplicate`).pipe(
    //   map(dto => OferenteProductMapper.toDomain(dto))
    // );

    const original = this.mockProducts.find(p => p.id === id);
    if (!original) {
      throw new Error(`Product with id ${id} not found`);
    }

    const duplicated: OferenteProductDTO = {
      ...original,
      id: Math.random().toString(36).substr(2, 9),
      name: `${original.name} (Copia)`,
      active: false,
      createdAt: new Date().toISOString(),
    };
    this.mockProducts.push(duplicated);
    return of(duplicated).pipe(
      delay(300),
      map(dto => OferenteProductMapper.toDomain(dto))
    );
  }
}
