// Use case: Update an existing product
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, UpdateProductData } from '../domain/entities';
import { IProductRepository, PRODUCT_REPOSITORY } from '../domain/ports';

export class UpdateProductUseCase {
  private readonly repository: IProductRepository = inject(PRODUCT_REPOSITORY);

  execute(id: string, data: UpdateProductData): Observable<Product> {
    return this.repository.update(id, data);
  }
}
