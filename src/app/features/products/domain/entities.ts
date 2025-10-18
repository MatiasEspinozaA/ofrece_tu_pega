// Domain entities - Pure business logic objects

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly imageUrl?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateProductData {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly imageUrl?: string;
}

export interface UpdateProductData {
  readonly name?: string;
  readonly description?: string;
  readonly price?: number;
  readonly category?: string;
  readonly imageUrl?: string;
}
