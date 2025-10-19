// Mappers: Convert between DTOs and Domain entities
import { OferenteProduct, CreateOferenteProductData, UpdateOferenteProductData } from '../domain/entities';
import { OferenteProductDTO, CreateOferenteProductDTO, UpdateOferenteProductDTO } from './oferente-product.dto';

export class OferenteProductMapper {
  /**
   * Convert DTO to Domain entity
   */
  static toDomain(dto: OferenteProductDTO): OferenteProduct {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      stock: dto.stock,
      active: dto.active,
      imageUrl: dto.imageUrl,
      createdAt: new Date(dto.createdAt),
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  }

  /**
   * Convert create data to DTO
   */
  static toCreateDTO(data: CreateOferenteProductData): CreateOferenteProductDTO {
    return {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      stock: data.stock,
      active: data.active,
      imageUrl: data.imageUrl,
    };
  }

  /**
   * Convert update data to DTO
   */
  static toUpdateDTO(data: UpdateOferenteProductData): UpdateOferenteProductDTO {
    return {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      stock: data.stock,
      active: data.active,
      imageUrl: data.imageUrl,
    };
  }
}
