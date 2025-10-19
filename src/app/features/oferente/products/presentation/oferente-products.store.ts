// Store: State management using Angular Signals
import { Injectable, signal, computed } from '@angular/core';
import { OferenteProduct } from '../domain/entities';

interface OferenteProductsState {
  products: OferenteProduct[];
  selectedProduct: OferenteProduct | null;
  loading: boolean;
  error: string | null;
}

const initialState: OferenteProductsState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

@Injectable()
export class OferenteProductsStore {
  // Private state signal
  private readonly state = signal<OferenteProductsState>(initialState);

  // Public computed selectors
  readonly products = computed(() => this.state().products);
  readonly selectedProduct = computed(() => this.state().selectedProduct);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly hasProducts = computed(() => this.state().products.length > 0);

  // State mutations
  setProducts(products: OferenteProduct[]): void {
    this.state.update(state => ({ ...state, products, error: null }));
  }

  setSelectedProduct(product: OferenteProduct | null): void {
    this.state.update(state => ({ ...state, selectedProduct: product }));
  }

  setLoading(loading: boolean): void {
    this.state.update(state => ({ ...state, loading }));
  }

  setError(error: string): void {
    this.state.update(state => ({ ...state, error, loading: false }));
  }

  addProduct(product: OferenteProduct): void {
    this.state.update(state => ({
      ...state,
      products: [...state.products, product],
      error: null,
    }));
  }

  updateProduct(updatedProduct: OferenteProduct): void {
    this.state.update(state => ({
      ...state,
      products: state.products.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
      error: null,
    }));
  }

  removeProduct(id: string): void {
    this.state.update(state => ({
      ...state,
      products: state.products.filter(p => p.id !== id),
      error: null,
    }));
  }

  clearError(): void {
    this.state.update(state => ({ ...state, error: null }));
  }
}
