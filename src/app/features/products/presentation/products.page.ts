// Products Page Component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductsFacade } from './products.facade';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatGridListModule,
  ],
  template: `
    <div class="products-page">
      <div class="page-header">
        <h1>Products</h1>
        <p class="subtitle">Browse our product catalog</p>
      </div>

      @if (facade.vm.loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading products...</p>
        </div>
      }

      @if (facade.vm.error()) {
        <div class="error-container">
          <p class="error-message">{{ facade.vm.error() }}</p>
          <button mat-raised-button color="primary" (click)="loadProducts()">
            Retry
          </button>
        </div>
      }

      @if (!facade.vm.loading() && !facade.vm.error() && facade.vm.hasProducts()) {
        <div class="products-grid row">
          @for (product of facade.vm.products(); track product.id) {
            <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
              <mat-card class="product-card">
                @if (product.imageUrl) {
                  <img mat-card-image [src]="product.imageUrl" [alt]="product.name" />
                }
                <mat-card-header>
                  <mat-card-title>{{ product.name }}</mat-card-title>
                  <mat-card-subtitle>{{ product.category }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p class="description">{{ product.description }}</p>
                  <p class="price">\${{ product.price | number:'1.2-2' }}</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">View Details</button>
                  <button mat-button>Add to Cart</button>
                </mat-card-actions>
              </mat-card>
            </div>
          }
        </div>
      }

      @if (!facade.vm.loading() && !facade.vm.error() && !facade.vm.hasProducts()) {
        <div class="empty-state">
          <p>No products available</p>
          <button mat-raised-button color="primary" (click)="loadProducts()">
            Refresh
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .products-page {
      padding: var(--spacing-md);
    }

    .page-header {
      margin-bottom: var(--spacing-xl);

      h1 {
        margin: 0;
        font-size: var(--font-size-xxxl);
        font-weight: 500;
        color: var(--color-primary);
      }

      .subtitle {
        margin: var(--spacing-sm) 0 0;
        color: #666;
        font-size: var(--font-size-lg);
      }
    }

    .loading-container,
    .error-container,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xxl);
      text-align: center;
    }

    .error-message {
      color: var(--color-warn);
      margin-bottom: var(--spacing-md);
    }

    .products-grid {
      margin: 0 -15px;
    }

    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform var(--transition-fast), box-shadow var(--transition-fast);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }

      .description {
        margin: var(--spacing-sm) 0;
        color: #666;
        font-size: var(--font-size-sm);
      }

      .price {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--color-primary);
        margin: var(--spacing-sm) 0 0;
      }

      mat-card-content {
        flex: 1;
      }
    }
  `]
})
export class ProductsPageComponent implements OnInit {
  constructor(protected readonly facade: ProductsFacade) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.facade.loadProducts();
  }
}
