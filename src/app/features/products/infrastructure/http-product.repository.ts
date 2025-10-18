// Infrastructure: HTTP implementation of Product Repository
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map, of } from 'rxjs';
import { IProductRepository } from '../domain/ports';
import { CreateProductData, Product, UpdateProductData } from '../domain/entities';
import { ProductMapper } from './mappers';
import { ProductDTO } from './product.dto';

@Injectable()
export class HttpProductRepository implements IProductRepository {
  private readonly apiUrl = '/api/products'; // Change to your actual API endpoint

  // Mock data for demo purposes
  private mockProducts: ProductDTO[] = [
    {
      id: '1',
      name: 'Laptop Dell XPS 13',
      description: 'High-performance laptop with 13-inch display',
      price: 1299.99,
      category: 'Electronics',
      imageUrl: 'https://via.placeholder.com/300x200?text=Laptop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      description: 'Latest Apple smartphone with advanced features',
      price: 999.99,
      category: 'Electronics',
      imageUrl: 'https://via.placeholder.com/300x200?text=iPhone',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Sony WH-1000XM5',
      description: 'Premium noise-cancelling headphones',
      price: 399.99,
      category: 'Audio',
      imageUrl: 'https://via.placeholder.com/300x200?text=Headphones',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Samsung 4K Monitor',
      description: '32-inch 4K UHD monitor for professionals',
      price: 549.99,
      category: 'Electronics',
      imageUrl: 'https://via.placeholder.com/300x200?text=Monitor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Product[]> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // return this.http.get<ProductDTO[]>(this.apiUrl).pipe(
    //   map(dtos => dtos.map(dto => ProductMapper.toDomain(dto)))
    // );

    return of(this.mockProducts).pipe(
      delay(500), // Simulate network delay
      map(dtos => dtos.map(dto => ProductMapper.toDomain(dto)))
    );
  }

  getById(id: string): Observable<Product> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // return this.http.get<ProductDTO>(`${this.apiUrl}/${id}`).pipe(
    //   map(dto => ProductMapper.toDomain(dto))
    // );

    const dto = this.mockProducts.find(p => p.id === id);
    if (!dto) {
      throw new Error(`Product with id ${id} not found`);
    }
    return of(dto).pipe(
      delay(300),
      map(dto => ProductMapper.toDomain(dto))
    );
  }

  create(data: CreateProductData): Observable<Product> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // const dto = ProductMapper.toCreateDTO(data);
    // return this.http.post<ProductDTO>(this.apiUrl, dto).pipe(
    //   map(dto => ProductMapper.toDomain(dto))
    // );

    const newProduct: ProductDTO = {
      id: (this.mockProducts.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(
      delay(300),
      map(dto => ProductMapper.toDomain(dto))
    );
  }

  update(id: string, data: UpdateProductData): Observable<Product> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // const dto = ProductMapper.toUpdateDTO(data);
    // return this.http.put<ProductDTO>(`${this.apiUrl}/${id}`, dto).pipe(
    //   map(dto => ProductMapper.toDomain(dto))
    // );

    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updated: ProductDTO = {
      ...this.mockProducts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.mockProducts[index] = updated;
    return of(updated).pipe(
      delay(300),
      map(dto => ProductMapper.toDomain(dto))
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
}
