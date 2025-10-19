// Use case: Get a single oferente product by ID
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OferenteProduct } from '../domain/entities';
import { IOferenteProductRepository, OFERENTE_PRODUCT_REPOSITORY } from '../domain/ports';

export class GetOferenteProductUseCase {
  private readonly repository: IOferenteProductRepository = inject(OFERENTE_PRODUCT_REPOSITORY);

  execute(id: string): Observable<OferenteProduct> {
    return this.repository.getById(id);
  }
}
