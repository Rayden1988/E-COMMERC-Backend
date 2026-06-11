import type { Product } from "../../entity/product.entity.js";

export interface ProductRepository {
  createProduct(product: Product): Promise<Product>;
  getAllCategories({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  updateProduct(product: Product): Promise<Product | null>;
  deleteProduct(id: string): Promise<Product>;
}
