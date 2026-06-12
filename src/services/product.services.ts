import { Name } from "../entity/name.valueObject.js";
import { Product } from "../entity/product.entity.js";
import {
  CreateProductDto,
  ProductListDTO,
  ProductResponseDto,
  UpdateProductDto,
} from "../dto/product.dto.js";
import { AppError } from "../errors/app-error.js";
import type { CategoryRepository } from "../repository/interfaces/category.repository.js";
import type { ProductRepository } from "../repository/interfaces/product.repository.js";

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
  }): Promise<{
    content: ProductResponseDto[];
    page: number;
    size: number;
  }> {
    const products = await this.productRepository.getAllProducts({ page, size });
    const content = products.map((product) => ProductResponseDto.create(product));

    return ProductListDTO.create(content, page, size);
  }

  async getById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.getProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return ProductResponseDto.create(product);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const category = await this.categoryRepository.getCategoryById(dto.categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const product = Product.create(
      dto.name,
      dto.price,
      dto.stock,
      dto.categoryId,
    );

    const created = await this.productRepository.createProduct(product);

    return ProductResponseDto.create(created);
  }

  async update(
    dto: UpdateProductDto & { id: string },
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.getProductById(dto.id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const nextCategoryId = dto.categoryId ?? product.categoryId;

    if (dto.categoryId && dto.categoryId !== product.categoryId) {
      const category = await this.categoryRepository.getCategoryById(dto.categoryId);

      if (!category) {
        throw new AppError("Category not found", 404);
      }
    }

    const updated = Product.restore(
      product.id,
      Name.create(dto.name ?? product.name.getValue()),
      dto.price ?? product.price,
      dto.stock ?? product.stock,
      nextCategoryId,
    );

    const saved = await this.productRepository.updateProduct(updated);

    if (!saved) {
      throw new AppError("Product not updated", 400);
    }

    return ProductResponseDto.create(saved);
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.getProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await this.productRepository.deleteProduct(id);
  }
}
