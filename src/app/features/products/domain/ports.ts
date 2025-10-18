// Domain ports - Interfaces for external dependencies (repository pattern)
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductData, Product, UpdateProductData } from './entities';

export interface IProductRepository {
  getAll(): Observable<Product[]>;
  getById(id: string): Observable<Product>;
  create(data: CreateProductData): Observable<Product>;
  update(id: string, data: UpdateProductData): Observable<Product>;
  delete(id: string): Observable<void>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<IProductRepository>(
  'PRODUCT_REPOSITORY'
);
