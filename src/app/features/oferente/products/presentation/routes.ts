// Routes configuration with scoped providers
import { Routes } from '@angular/router';
import { OFERENTE_PRODUCT_REPOSITORY } from '../domain/ports';
import { HttpOferenteProductRepository } from '../infrastructure/http-oferente-product.repository';
import { ListOferenteProductsUseCase } from '../application/list-oferente-products.use-case';
import { GetOferenteProductUseCase } from '../application/get-oferente-product.use-case';
import { CreateOferenteProductUseCase } from '../application/create-oferente-product.use-case';
import { UpdateOferenteProductUseCase } from '../application/update-oferente-product.use-case';
import { DeleteOferenteProductUseCase } from '../application/delete-oferente-product.use-case';
import { DuplicateOferenteProductUseCase } from '../application/duplicate-oferente-product.use-case';
import { OferenteProductsStore } from './oferente-products.store';
import { OferenteProductsFacade } from './oferente-products.facade';

export const OFERENTE_PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products.page').then(m => m.OferenteProductsPageComponent),
    providers: [
      // Infrastructure
      {
        provide: OFERENTE_PRODUCT_REPOSITORY,
        useClass: HttpOferenteProductRepository,
      },
      // Application
      ListOferenteProductsUseCase,
      GetOferenteProductUseCase,
      CreateOferenteProductUseCase,
      UpdateOferenteProductUseCase,
      DeleteOferenteProductUseCase,
      DuplicateOferenteProductUseCase,
      // Presentation
      OferenteProductsStore,
      OferenteProductsFacade,
    ],
  },
];
