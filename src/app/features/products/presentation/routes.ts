// Products feature routes with scoped providers
import { Routes } from '@angular/router';
import { ProductsPageComponent } from './products.page';
import { ProductsStore } from './products.store';
import { ProductsFacade } from './products.facade';
import { ListProductsUseCase } from '../application/list-products.use-case';
import { GetProductUseCase } from '../application/get-product.use-case';
import { CreateProductUseCase } from '../application/create-product.use-case';
import { UpdateProductUseCase } from '../application/update-product.use-case';
import { PRODUCT_REPOSITORY } from '../domain/ports';
import { HttpProductRepository } from '../infrastructure/http-product.repository';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: ProductsPageComponent,
    providers: [
      // Repository provider (infrastructure)
      {
        provide: PRODUCT_REPOSITORY,
        useClass: HttpProductRepository,
      },
      // Use cases (application layer)
      ListProductsUseCase,
      GetProductUseCase,
      CreateProductUseCase,
      UpdateProductUseCase,
      // Presentation layer
      ProductsStore,
      ProductsFacade,
    ],
  },
];
