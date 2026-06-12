import type { CategoryRepository } from "../repository/interfaces/category.repository.js";
import type { ProductRepository } from "../repository/interfaces/product.repository.js";
import { Product } from "../entity/product.entity.js";

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async getAll({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<Product[]> {
    return this.productRepository.getAllCategories({ page, size });
  }

  async getById(id: string): Promise<Product | null> {
    return this.productRepository.getProductById(id);
  }

  async create(product: Product): Promise<Product> {
    const category = await this.categoryRepository.getCategoryById(product.categoryId);

    if (!category) {
      throw new Error("Category not found");
    }

    return this.productRepository.createProduct(product);
  }

  async update(product: Product): Promise<Product | null> {
    const category = await this.categoryRepository.getCategoryById(product.categoryId);

    if (!category) {
      throw new Error("Category not found");
    }

    return this.productRepository.updateProduct(product);
  }

  async delete(id: string): Promise<Product> {
    return this.productRepository.deleteProduct(id);
  }
}
