// Use case: Delete an oferente product
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IOferenteProductRepository, OFERENTE_PRODUCT_REPOSITORY } from '../domain/ports';

export class DeleteOferenteProductUseCase {
  private readonly repository: IOferenteProductRepository = inject(OFERENTE_PRODUCT_REPOSITORY);

  execute(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
