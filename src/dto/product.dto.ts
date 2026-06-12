import type { Name } from "../entity/name.valueObject.js";
import type { Product } from "../entity/product.entity.js";

// Entrada

// DTO usado para criar produto
export class CreateProductDto {
  static create(body: unknown): CreateProductDto {
    return body as CreateProductDto;
  }

  name!: string;
  price!: number;
  stock!: number;
  categoryId!: string;
}

// DTO usado para atualizar produto
export class UpdateProductDto {
  static create(body: unknown): UpdateProductDto {
    return body as UpdateProductDto;
  }

  name?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
}

// Saída

// DTO usado para devolver produto na resposta da API
export class ProductResponseDto {
  id!: string;
  name!: Name;
  price!: number;
  stock!: number;
  categoryId!: string;

  static create(product: Product): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = product.id;
    dto.name = product.name;
    dto.price = product.price;
    dto.stock = product.stock;
    dto.categoryId = product.categoryId;
    return dto;
  }
}

// DTO usado para listar vários produtos com paginação
export class ProductListDTO {
  static create(products: ProductResponseDto[], page: number, size: number) {
    return {
      content: products,
      page,
      size,
    };
  }
}
