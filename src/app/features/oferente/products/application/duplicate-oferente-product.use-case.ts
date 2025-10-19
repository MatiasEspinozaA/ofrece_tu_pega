// Use case: Duplicate an oferente product
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OferenteProduct } from '../domain/entities';
import { IOferenteProductRepository, OFERENTE_PRODUCT_REPOSITORY } from '../domain/ports';

export class DuplicateOferenteProductUseCase {
  private readonly repository: IOferenteProductRepository = inject(OFERENTE_PRODUCT_REPOSITORY);

  execute(id: string): Observable<OferenteProduct> {
    return this.repository.duplicate(id);
  }
}
