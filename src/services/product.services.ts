// Regra de negocio para produtos.
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

  // Lista produtos com paginação
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
    // Busca os produtos e converte para DTO de resposta
    const products = await this.productRepository.getAllProducts({ page, size });
    const content = products.map((product) => ProductResponseDto.create(product));

    return ProductListDTO.create(content, page, size);
  }

  // Busca um produto pelo id
  async getById(id: string): Promise<ProductResponseDto> {
    // Procura o produto no banco
    const product = await this.productRepository.getProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return ProductResponseDto.create(product);
  }

  // Cria um produto novo
  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    // Garante que a categoria exista antes de salvar
    const category = await this.categoryRepository.getCategoryById(dto.categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Cria a entidade de produto
    const product = Product.create(
      dto.name,
      dto.price,
      dto.stock,
      dto.categoryId,
    );

    const created = await this.productRepository.createProduct(product);

    return ProductResponseDto.create(created);
  }

  // Atualiza um produto existente
  async update(
    dto: UpdateProductDto & { id: string },
  ): Promise<ProductResponseDto> {
    // Busca o produto atual
    const product = await this.productRepository.getProductById(dto.id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Mantém a categoria atual quando ela não vier no body
    const nextCategoryId = dto.categoryId ?? product.categoryId;

    // Se a categoria mudar, valida se ela existe
    if (dto.categoryId && dto.categoryId !== product.categoryId) {
      const category = await this.categoryRepository.getCategoryById(dto.categoryId);

      if (!category) {
        throw new AppError("Category not found", 404);
      }
    }

    // Recria a entidade com os novos dados
    const updated = Product.restore(
      product.id,
      Name.create(dto.name ?? product.name.getValue()),
      dto.price ?? product.price,
      dto.stock ?? product.stock,
      nextCategoryId,
    );

    // Persiste a alteração
    const saved = await this.productRepository.updateProduct(updated);

    if (!saved) {
      throw new AppError("Product not updated", 400);
    }

    return ProductResponseDto.create(saved);
  }

  // Remove um produto pelo id
  async delete(id: string): Promise<void> {
    // Verifica se o produto existe
    const product = await this.productRepository.getProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Apaga o produto do banco
    await this.productRepository.deleteProduct(id);
  }
}
