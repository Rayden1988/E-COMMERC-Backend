// Implementacao PostgreSQL do repositorio de produtos.
import { Name } from "../../entity/name.valueObject.js";
import { Product } from "../../entity/product.entity.js";
import type { ProductRepository } from "../interfaces/product.repository.js";

export class ProductPgRepository implements ProductRepository {
  constructor(private db: any) {}

  async createProduct(product: Product): Promise<Product> {
    const query =
      "INSERT INTO products (name, price, stock, category_id) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await this.db.query(query, [
      product.name.getValue(),
      product.price,
      product.stock,
      product.categoryId,
    ]);

    const row = result.rows[0];

    return Product.restore(
      row.id,
      Name.create(row.name),
      row.price,
      row.stock,
      row.category_id,
    );
  }

  async getAllProducts({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<Product[]> {
    const offset = page * size;
    const query =
      "SELECT id, name, price, stock, category_id FROM products LIMIT $1 OFFSET $2";
    const result = await this.db.query(query, [size, offset]);

    return result.rows.map((row: any) =>
      Product.restore(
        row.id,
        Name.create(row.name),
        row.price,
        row.stock,
        row.category_id,
      ),
    );
  }

  async getProductById(id: string): Promise<Product | null> {
    const query =
      "SELECT id, name, price, stock, category_id FROM products WHERE id = $1";
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return Product.restore(
      row.id,
      Name.create(row.name),
      row.price,
      row.stock,
      row.category_id,
    );
  }

  async updateProduct(product: Product): Promise<Product | null> {
    const query =
      "UPDATE products SET name = $1, price = $2, stock = $3, category_id = $4 WHERE id = $5 RETURNING *";
    const result = await this.db.query(query, [
      product.name.getValue(),
      product.price,
      product.stock,
      product.categoryId,
      product.id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return Product.restore(
      row.id,
      Name.create(row.name),
      row.price,
      row.stock,
      row.category_id,
    );
  }

  async deleteProduct(id: string): Promise<Product | null> {
    const query = "DELETE FROM products WHERE id = $1 RETURNING *";
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return Product.restore(
      row.id,
      Name.create(row.name),
      row.price,
      row.stock,
      row.category_id,
    );
  }
}
