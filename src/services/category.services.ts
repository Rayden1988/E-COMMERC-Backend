// Regra de negocio para categorias.
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

  // Lista categorias com paginação
  async getAll({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<CategoryResponseDTO[]> {
    // Busca os dados no repositório
    const categories = await this.repository.getAllCategories({ page, size });

    return categories.map((category) => CategoryResponseDTO.create(category));
  }

  // Busca uma categoria pelo id
  async getById(id: string): Promise<CategoryResponseDTO> {
    // Procura a categoria no banco
    const category = await this.repository.getCategoryById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return CategoryResponseDTO.create(category);
  }

  // Cria uma nova categoria
  async create(dto: CategoryCreateDTO): Promise<CategoryResponseDTO> {
    // Cria a entidade e salva no banco
    const category = Category.create(dto.name);
    const created = await this.repository.createCategory(category.name);

    return CategoryResponseDTO.create(created);
  }

  async update(
    dto: CategoryUpdateDTO & { id: string },
  ): Promise<CategoryResponseDTO> {
    // Busca a categoria atual
    const category = await this.repository.getCategoryById(dto.id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Recria a entidade e aplica a nova informação
    const categoryToUpdate = Category.restore(category.id, category.name);
    categoryToUpdate.rename(dto.name);

    // Salva a atualização no banco
    const updated = await this.repository.updateCategory(
      categoryToUpdate.id,
      categoryToUpdate.name,
    );

    if (!updated) {
      throw new AppError("Category not updated", 400);
    }

    return CategoryResponseDTO.create(updated);
  }

  // Remove uma categoria pelo id
  async delete(id: string): Promise<void> {
    // Verifica se a categoria existe
    const category = await this.repository.getCategoryById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Remove o registro
    await this.repository.deleteCategory(id);
  }
}
