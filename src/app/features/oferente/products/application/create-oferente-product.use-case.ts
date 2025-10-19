// Use case: Create a new oferente product
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OferenteProduct, CreateOferenteProductData } from '../domain/entities';
import { IOferenteProductRepository, OFERENTE_PRODUCT_REPOSITORY } from '../domain/ports';

export class CreateOferenteProductUseCase {
  private readonly repository: IOferenteProductRepository = inject(OFERENTE_PRODUCT_REPOSITORY);

  execute(data: CreateOferenteProductData): Observable<OferenteProduct> {
    return this.repository.create(data);
  }
}
