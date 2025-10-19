// Facade: Simplifies interaction between UI and business logic
import { Injectable } from '@angular/core';
import { OferenteProductsStore } from './oferente-products.store';
import { ListOferenteProductsUseCase } from '../application/list-oferente-products.use-case';
import { GetOferenteProductUseCase } from '../application/get-oferente-product.use-case';
import { CreateOferenteProductUseCase } from '../application/create-oferente-product.use-case';
import { UpdateOferenteProductUseCase } from '../application/update-oferente-product.use-case';
import { DeleteOferenteProductUseCase } from '../application/delete-oferente-product.use-case';
import { DuplicateOferenteProductUseCase } from '../application/duplicate-oferente-product.use-case';
import { CreateOferenteProductData, UpdateOferenteProductData } from '../domain/entities';

// ViewModel exposes signals that can be used directly in templates
export type OferenteProductsViewModel = {
  readonly products: OferenteProductsStore['products'];
  readonly selectedProduct: OferenteProductsStore['selectedProduct'];
  readonly loading: OferenteProductsStore['loading'];
  readonly error: OferenteProductsStore['error'];
  readonly hasProducts: OferenteProductsStore['hasProducts'];
};

@Injectable()
export class OferenteProductsFacade {
  // Expose a simple ViewModel for the UI
  readonly vm: OferenteProductsViewModel;

  constructor(
    private readonly store: OferenteProductsStore,
    private readonly listProductsUseCase: ListOferenteProductsUseCase,
    private readonly getProductUseCase: GetOferenteProductUseCase,
    private readonly createProductUseCase: CreateOferenteProductUseCase,
    private readonly updateProductUseCase: UpdateOferenteProductUseCase,
    private readonly deleteProductUseCase: DeleteOferenteProductUseCase,
    private readonly duplicateProductUseCase: DuplicateOferenteProductUseCase
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

  createProduct(data: CreateOferenteProductData): void {
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

  updateProduct(id: string, data: UpdateOferenteProductData): void {
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

  deleteProduct(id: string): void {
    this.store.setLoading(true);
    this.deleteProductUseCase.execute(id).subscribe({
      next: () => {
        this.store.removeProduct(id);
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError(err.message || 'Failed to delete product');
      },
    });
  }

  duplicateProduct(id: string): void {
    this.store.setLoading(true);
    this.duplicateProductUseCase.execute(id).subscribe({
      next: product => {
        this.store.addProduct(product);
        this.store.setLoading(false);
      },
      error: err => {
        this.store.setError(err.message || 'Failed to duplicate product');
      },
    });
  }

  clearError(): void {
    this.store.clearError();
  }
}
