import { Category } from "../../entity/category.entity.js";
import type { CategoryRepository } from "../interfaces/category.repository.js";

// ImplementaÃ§Ã£o PostgreSQL do repositÃ³rio de categorias
export class CategoryPgRepository implements CategoryRepository {
  constructor(private db: any) {
    this.db = db;
  }

  async createCategory(name: string): Promise<Category> {
    const insertQuery =
      "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *";
    const insertResult = await this.db.query(insertQuery, [name]);

    if (insertResult.rows.length > 0) {
      const row = insertResult.rows[0];
      return Category.restore(row.id, row.name);
    }

    const selectQuery = "SELECT * FROM categories WHERE name = $1";
    const selectResult = await this.db.query(selectQuery, [name]);
    const row = selectResult.rows[0];
    return Category.restore(row.id, row.name);
  }

  async getAllCategories({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<Category[]> {
    const offset = page * size;
    const query = "SELECT * FROM categories LIMIT $1 OFFSET $2";
    const result = await this.db.query(query, [size, offset]);
    return result.rows.map((row: any) => Category.restore(row.id, row.name));
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const query = "SELECT * FROM categories WHERE id = $1";
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return Category.restore(row.id, row.name);
  }

  async updateCategory(id: string, name: string): Promise<Category | null> {
    const query = "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *";
    const result = await this.db.query(query, [name, id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return Category.restore(row.id, row.name);
  }

  async deleteCategory(id: string): Promise<Category | null> {
    const query = "DELETE FROM categories WHERE id = $1 RETURNING *";
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return Category.restore(row.id, row.name);
  }
}
