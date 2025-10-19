// Data Transfer Object for API communication
export interface OferenteProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOferenteProductDTO {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
  imageUrl?: string;
}

export interface UpdateOferenteProductDTO {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  active?: boolean;
  imageUrl?: string;
}
