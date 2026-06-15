// Contrato do repositorio de categorias.
import type { Category as CategoryEntity } from "../../entity/category.entity.js";

export interface CategoryRepository {
  createCategory(name: string): Promise<CategoryEntity>;
  getAllCategories({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<CategoryEntity[]>;
  getCategoryById(id: string): Promise<CategoryEntity | null>;
  updateCategory(id: string, name: string): Promise<CategoryEntity | null>;
  deleteCategory(id: string): Promise<CategoryEntity | null>;
}
