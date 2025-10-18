// Mappers - Convert between DTOs and Domain entities
import { CreateProductData, Product, UpdateProductData } from '../domain/entities';
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from './product.dto';

export class ProductMapper {
  static toDomain(dto: ProductDTO): Product {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      imageUrl: dto.imageUrl,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  static toCreateDTO(data: CreateProductData): CreateProductDTO {
    return {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl,
    };
  }

  static toUpdateDTO(data: UpdateProductData): UpdateProductDTO {
    return {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl,
    };
  }
}
