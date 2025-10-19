// Use case: List all oferente products
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OferenteProduct } from '../domain/entities';
import { IOferenteProductRepository, OFERENTE_PRODUCT_REPOSITORY } from '../domain/ports';

export class ListOferenteProductsUseCase {
  private readonly repository: IOferenteProductRepository = inject(OFERENTE_PRODUCT_REPOSITORY);

  execute(): Observable<OferenteProduct[]> {
    return this.repository.getAll();
  }
}
