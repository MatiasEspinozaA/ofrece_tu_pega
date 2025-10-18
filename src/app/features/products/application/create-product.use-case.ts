// Use case: Create a new product
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductData, Product } from '../domain/entities';
import { IProductRepository, PRODUCT_REPOSITORY } from '../domain/ports';

export class CreateProductUseCase {
  private readonly repository: IProductRepository = inject(PRODUCT_REPOSITORY);

  execute(data: CreateProductData): Observable<Product> {
    return this.repository.create(data);
  }
}
