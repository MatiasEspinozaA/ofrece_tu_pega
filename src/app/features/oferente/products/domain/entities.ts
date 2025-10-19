// Domain entities - Pure business logic objects

export interface OferenteProduct {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly stock: number;
  readonly active: boolean;
  readonly imageUrl?: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

export interface CreateOferenteProductData {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly stock: number;
  readonly active: boolean;
  readonly imageUrl?: string;
}

export interface UpdateOferenteProductData {
  readonly name?: string;
  readonly description?: string;
  readonly price?: number;
  readonly category?: string;
  readonly stock?: number;
  readonly active?: boolean;
  readonly imageUrl?: string;
}
