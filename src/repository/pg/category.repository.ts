import type {
  Category,
  CategoryRepository,
} from "../interfaces/category.repository.js";

// Implementação PostgreSQL do repositório de categorias
export class CategoryPgRepository implements CategoryRepository {
  constructor(private db: any) {
    this.db = db;
  }
  findByName: any;

  async createCategory(name: string): Promise<Category> {
    const insertQuery =
      "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *";
    const insertResult = await this.db.query(insertQuery, [name]);

    if (insertResult.rows.length > 0) {
      return insertResult.rows[0];
    }

    const selectQuery = "SELECT * FROM categories WHERE name = $1";
    const selectResult = await this.db.query(selectQuery, [name]);

    return selectResult.rows[0];
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
    return result.rows;
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const query = "SELECT * FROM categories WHERE id = $1";
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateCategory(id: string, name: string): Promise<Category | null> {
    const query = "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *";
    const result = await this.db.query(query, [name, id]);
    return result.rows[0] || null;
  }

  async deleteCategory(id: string): Promise<Category> {
    const query = "DELETE FROM categories WHERE id = $1 RETURNING *";
    const result = await this.db.query(query, [id]);
    console.log(result, "result delete");
    return result.rows[0] || null;
  }
}
