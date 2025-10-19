// Use case: Update an existing oferente product
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OferenteProduct, UpdateOferenteProductData } from '../domain/entities';
import { IOferenteProductRepository, OFERENTE_PRODUCT_REPOSITORY } from '../domain/ports';

export class UpdateOferenteProductUseCase {
  private readonly repository: IOferenteProductRepository = inject(OFERENTE_PRODUCT_REPOSITORY);

  execute(id: string, data: UpdateOferenteProductData): Observable<OferenteProduct> {
    return this.repository.update(id, data);
  }
}
