// Use case: List all products
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../domain/entities';
import { IProductRepository, PRODUCT_REPOSITORY } from '../domain/ports';

export class ListProductsUseCase {
  private readonly repository: IProductRepository = inject(PRODUCT_REPOSITORY);

  execute(): Observable<Product[]> {
    return this.repository.getAll();
  }
}
