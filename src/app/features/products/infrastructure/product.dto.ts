// DTOs - Data Transfer Objects for API communication

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
}
