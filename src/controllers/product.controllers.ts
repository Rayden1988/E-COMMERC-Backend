import { type Request, type Response } from "express";
import { Product } from "../entity/product.entity.js";
import {
  createProductSchema,
  productParamsSchema,
  productQueryPaginationSchema,
} from "../schemas/product.schema.js";
import { Name } from "../entity/name.valueObject.js";
import type { ProductRepository } from "../repository/interfaces/product.repository.js";

export class ProductController {
  constructor(private repository: ProductRepository) {}

  findAll = async (req: Request, res: Response) => {
    // implementar validação com zod
    const result = productQueryPaginationSchema.safeParse(req.query);

    // chamar o repositório para buscar os produtos utilizando paginação
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const { page, size } = result.data;

    const products = await this.repository.getAllCategories({
      page,
      size,
    });

    // retornar a lista de produtos exatamente como o professor mostrou
    return res.json(products);
  };

  findById = async (req: Request, res: Response) => {
    const result = productParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const product = await this.repository.getProductById(result.data.id);

    if (!product) {
      return res.status(404).json({
        message: `Produto com id ${result.data.id} não encontrado`,
      });
    }

    return res.json(product);
  };

  create = async (req: Request, res: Response) => {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const { name, price, stock, categoryId } = result.data;
    const productEntity = Product.create(name, price, stock, categoryId);
    const product = await this.repository.createProduct(productEntity);

    return res.status(201).json({
      message: `cria um novo produto com nome ${product.name.getValue()} !`,
      product,
    });
  };

  update = async (req: Request, res: Response) => {
    const paramsResult = productParamsSchema.safeParse(req.params);
    const bodyResult = createProductSchema.safeParse(req.body);

    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.flatten() });
    }

    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.flatten() });
    }

    const product = Product.restore(
      paramsResult.data.id,
      Name.create(bodyResult.data.name),
      bodyResult.data.price,
      bodyResult.data.stock,
      bodyResult.data.categoryId
    );

    const updatedProduct = await this.repository.updateProduct(product);

    return res.json({
      message: `atualiza o produto com id ${paramsResult.data.id} para o nome ${bodyResult.data.name} !`,
      product: updatedProduct,
    });
  };

  delete = async (req: Request, res: Response) => {
    const result = productParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    await this.repository.deleteProduct(result.data.id);

    return res.status(204).send();
  };
}
