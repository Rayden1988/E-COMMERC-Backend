import { Category } from "../entity/category.entity.js";
import {
  CategoryCreateDTO,
  CategoryResponseDTO,
  CategoryUpdateDTO,
} from "../dto/category.dto.js";
import { AppError } from "../errors/app-error.js";
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

    return categories.map((category) => CategoryResponseDTO.create(category));
  }

  async getById(id: string): Promise<CategoryResponseDTO> {
    const category = await this.repository.getCategoryById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return CategoryResponseDTO.create(category);
  }

  async create(dto: CategoryCreateDTO): Promise<CategoryResponseDTO> {
    const category = Category.create(dto.name);
    const created = await this.repository.createCategory(category.name);

    return CategoryResponseDTO.create(created);
  }

  async update(
    dto: CategoryUpdateDTO & { id: string },
  ): Promise<CategoryResponseDTO> {
    const category = await this.repository.getCategoryById(dto.id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const categoryToUpdate = Category.restore(category.id, category.name);
    categoryToUpdate.rename(dto.name);

    const updated = await this.repository.updateCategory(
      categoryToUpdate.id,
      categoryToUpdate.name,
    );

    if (!updated) {
      throw new AppError("Category not updated", 400);
    }

    return CategoryResponseDTO.create(updated);
  }

  async delete(id: string): Promise<void> {
    const category = await this.repository.getCategoryById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    await this.repository.deleteCategory(id);
  }
}
