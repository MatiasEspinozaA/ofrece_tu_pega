// Domain ports - Interfaces that define contracts with external layers
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { OferenteProduct, CreateOferenteProductData, UpdateOferenteProductData } from './entities';

export interface IOferenteProductRepository {
  getAll(): Observable<OferenteProduct[]>;
  getById(id: string): Observable<OferenteProduct>;
  create(data: CreateOferenteProductData): Observable<OferenteProduct>;
  update(id: string, data: UpdateOferenteProductData): Observable<OferenteProduct>;
  delete(id: string): Observable<void>;
  duplicate(id: string): Observable<OferenteProduct>;
}

export const OFERENTE_PRODUCT_REPOSITORY = new InjectionToken<IOferenteProductRepository>(
  'IOferenteProductRepository'
);
