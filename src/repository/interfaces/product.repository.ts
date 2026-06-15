// Contrato do repositorio de produtos.
import type { Product as ProductEntity } from "../../entity/product.entity.js";

export interface ProductRepository {
  createProduct(product: ProductEntity): Promise<ProductEntity>;
  getAllProducts({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<ProductEntity[]>;
  getProductById(id: string): Promise<ProductEntity | null>;
  updateProduct(product: ProductEntity): Promise<ProductEntity | null>;
  deleteProduct(id: string): Promise<ProductEntity | null>;
}
