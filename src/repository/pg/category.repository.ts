// Implementacao PostgreSQL do repositorio de categorias.
import { Category } from "../../entity/category.entity.js";
import { AppError } from "../../errors/app-error.js";
import type { CategoryRepository } from "../interfaces/category.repository.js";

// Implementação PostgreSQL do repositório de categorias
export class CategoryPgRepository implements CategoryRepository {
  constructor(private db: any) {
    this.db = db;
  }

  // Cria uma categoria nova e trata nome duplicado
  async createCategory(name: string): Promise<Category> {
    // Tenta inserir o nome no banco
    const insertQuery =
      "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *";
    const insertResult = await this.db.query(insertQuery, [name]);

    if (insertResult.rows.length > 0) {
      // Se inseriu, devolve a categoria criada
      const row = insertResult.rows[0];
      return Category.restore(row.id, row.name);
    }

    throw new AppError("Category name already exists", 409);
  }

  // Lista categorias com paginação
  async getAllCategories({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<Category[]> {
    // Calcula o deslocamento da página atual
    const offset = page * size;
    // Busca os registros paginados
    const query = "SELECT * FROM categories LIMIT $1 OFFSET $2";
    const result = await this.db.query(query, [size, offset]);
    return result.rows.map((row: any) => Category.restore(row.id, row.name));
  }

  // Busca uma categoria pelo id
  async getCategoryById(id: string): Promise<Category | null> {
    // Consulta a categoria exata
    const query = "SELECT * FROM categories WHERE id = $1";
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      // Se não encontrou, retorna null
      return null;
    }

    const row = result.rows[0];
    return Category.restore(row.id, row.name);
  }

  // Atualiza o nome de uma categoria
  async updateCategory(id: string, name: string): Promise<Category | null> {
    // Executa a atualização e devolve o registro alterado
    const query = "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *";
    const result = await this.db.query(query, [name, id]);

    if (result.rows.length === 0) {
      // Se não alterou nada, retorna null
      return null;
    }

    const row = result.rows[0];
    return Category.restore(row.id, row.name);
  }

  // Remove uma categoria pelo id
  async deleteCategory(id: string): Promise<Category | null> {
    // Remove o registro e devolve o que foi apagado
    const query = "DELETE FROM categories WHERE id = $1 RETURNING *";
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      // Se não encontrou para apagar, retorna null
      return null;
    }

    const row = result.rows[0];
    return Category.restore(row.id, row.name);
  }
}
