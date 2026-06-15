// DTOs de categoria usados entre controller e service.
import type { Category } from "../entity/category.entity.js";

export class CategoryCreateDTO {
  static create(body: unknown): CategoryCreateDTO {
    return body as CategoryCreateDTO;
  }

  name!: string;
}

export class CategoryUpdateDTO {
  static create(body: unknown): CategoryUpdateDTO {
    return body as CategoryUpdateDTO;
  }

  name!: string;
}

export class CategoryResponseDTO {
  id!: string;
  name!: string;

  static create(category: Category): CategoryResponseDTO {
    const dto = new CategoryResponseDTO();
    dto.id = category.id;
    dto.name = category.name;
    return dto;
  }
}
