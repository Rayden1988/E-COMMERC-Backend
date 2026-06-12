import type {
  CategoryCreateDTO,
  CategoryResponseDTO,
} from "../dto/category.dto.js";
import type { CategoryRepository } from "../repository/interfaces/category.repository.js";

export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  async getAll({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<CategoryResponseDTO[]> {
    const categories = await this.repository.getAllCategories({ page, size });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }

  async getById(id: string): Promise<CategoryResponseDTO> {
    const category = await this.repository.getCategoryById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return {
      id: category.id,
      name: category.name,
    };
  }

  async create(dto: CategoryCreateDTO): Promise<CategoryResponseDTO> {
    const created = await this.repository.createCategory(dto.name);

    if (!created) {
      throw new Error("Category not found");
    }

    return {
      id: created.id,
      name: created.name,
    };
  }

  async update(dtoUpdate: {
    id: string;
    name: string;
  }): Promise<CategoryResponseDTO> {
    const updated = await this.repository.updateCategory(
      dtoUpdate.id,
      dtoUpdate.name,
    );

    if (!updated) {
      throw new Error("Category not found");
    }

    return {
      id: updated.id,
      name: updated.name,
    };
  }

  async delete(id: string): Promise<void> {
    const category = await this.repository.getCategoryById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    await this.repository.deleteCategory(id);
  }
}
