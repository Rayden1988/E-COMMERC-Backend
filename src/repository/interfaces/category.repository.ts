export interface Category {
  rename(name: any): unknown;
  id: string;
  name: string;
}

export interface CategoryRepository {
  createCategory(name: string): Promise<Category>;
  getAllCategories({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  updateCategory(id: string, name: string): Promise<Category | null>;
  deleteCategory(id: string): Promise<Category | null>;
}
