// Facade: Simplifies interaction between UI and business logic
import { Injectable, computed } from '@angular/core';
import { ProductsStore } from './products.store';
import { ListProductsUseCase } from '../application/list-products.use-case';
import { GetProductUseCase } from '../application/get-product.use-case';
import { CreateProductUseCase } from '../application/create-product.use-case';
import { UpdateProductUseCase } from '../application/update-product.use-case';
import { CreateProductData, UpdateProductData } from '../domain/entities';

// ViewModel exposes signals that can be used directly in templates
export type ProductsViewModel = {
  readonly products: ProductsStore['products'];
  readonly selectedProduct: ProductsStore['selectedProduct'];
  readonly loading: ProductsStore['loading'];
  readonly error: ProductsStore['error'];
  readonly hasProducts: ProductsStore['hasProducts'];
};

@Injectable()
export class ProductsFacade {
  // Expose a simple ViewModel for the UI
  readonly vm: ProductsViewModel;

  constructor(
    private readonly store: ProductsStore,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase
  ) {
    this.vm = {
      products: this.store.products,
      selectedProduct: this.store.selectedProduct,
      loading: this.store.loading,
      error: this.store.error,
      hasProducts: this.store.hasProducts,
    };
  }

  loadProducts(): void {
    this.store.setLoading(true);
    this.listProductsUseCase.execute().subscribe({
      next: products => {
        this.store.setProducts(products);
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError(err.message || 'Failed to load products');
      },
    });
  }

  loadProduct(id: string): void {
    this.store.setLoading(true);
    this.getProductUseCase.execute(id).subscribe({
      next: product => {
        this.store.setSelectedProduct(product);
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError(err.message || 'Failed to load product');
      },
    });
  }

  createProduct(data: CreateProductData): void {
    this.store.setLoading(true);
    this.createProductUseCase.execute(data).subscribe({
      next: product => {
        this.store.addProduct(product);
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError(err.message || 'Failed to create product');
      },
    });
  }

  updateProduct(id: string, data: UpdateProductData): void {
    this.store.setLoading(true);
    this.updateProductUseCase.execute(id, data).subscribe({
      next: product => {
        this.store.updateProduct(product);
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError(err.message || 'Failed to update product');
      },
    });
  }
}
