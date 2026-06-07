import type {
  Category,
  CategoryRepository,
} from "../interfaces/category.repository";

export class CategoryPgRepository implements CategoryRepository {
  constructor(private db: any) {
    this.db = db;
  }

  async createCategory(name: string): Promise<Category> {
    const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
    const result = await this.db.query(query, [name]);
    console.log(result, "result");
    return result.rows[0];
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

  async updateCategory(
    id: string,
    name: string
  ): Promise<Category | null> {
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