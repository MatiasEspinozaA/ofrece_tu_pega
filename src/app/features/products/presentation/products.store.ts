// Store using Angular signals for state management
import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../domain/entities';

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

@Injectable()
export class ProductsStore {
  // Private state signal
  private readonly state = signal<ProductsState>(initialState);

  // Public computed signals
  readonly products = computed(() => this.state().products);
  readonly selectedProduct = computed(() => this.state().selectedProduct);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly hasProducts = computed(() => this.state().products.length > 0);

  // State mutations
  setProducts(products: Product[]): void {
    this.state.update(state => ({
      ...state,
      products,
      error: null,
    }));
  }

  setSelectedProduct(product: Product | null): void {
    this.state.update(state => ({
      ...state,
      selectedProduct: product,
    }));
  }

  setLoading(loading: boolean): void {
    this.state.update(state => ({
      ...state,
      loading,
    }));
  }

  setError(error: string | null): void {
    this.state.update(state => ({
      ...state,
      error,
      loading: false,
    }));
  }

  addProduct(product: Product): void {
    this.state.update(state => ({
      ...state,
      products: [...state.products, product],
    }));
  }

  updateProduct(updatedProduct: Product): void {
    this.state.update(state => ({
      ...state,
      products: state.products.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    }));
  }

  removeProduct(id: string): void {
    this.state.update(state => ({
      ...state,
      products: state.products.filter(p => p.id !== id),
    }));
  }

  reset(): void {
    this.state.set(initialState);
  }
}
