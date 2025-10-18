// Use case: Get product by ID
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../domain/entities';
import { IProductRepository, PRODUCT_REPOSITORY } from '../domain/ports';

export class GetProductUseCase {
  private readonly repository: IProductRepository = inject(PRODUCT_REPOSITORY);

  execute(id: string): Observable<Product> {
    return this.repository.getById(id);
  }
}
