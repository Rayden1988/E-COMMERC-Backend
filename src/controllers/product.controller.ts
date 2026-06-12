import { type Request, type Response } from "express";

import { Product } from "../entity/product.entity.js";
import { Name } from "../entity/name.valueObject.js";
import {
  createProductSchema,
  productParamsSchema,
  productQueryPaginationSchema,
} from "../schemas/product.schema.js";
import type { ProductRepository } from "../repository/interfaces/product.repository.js";
import type { ProductService } from "../services/product.services.js";

export class ProductController {
  constructor(
    private repository: ProductRepository,
    private service: ProductService,
  ) {}

  async findAll(req: Request, res: Response) {
    const result = productQueryPaginationSchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const products = await this.service.getAll(result.data);

    return res.json(products);
  }

  async findById(req: Request, res: Response) {
    const result = productParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const product = await this.service.getById(result.data.id);

    if (!product) {
      return res.status(404).json({
        message: `Produto com id ${result.data.id} não encontrado`,
      });
    }

    return res.json(product);
  }

  async create(req: Request, res: Response) {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const { name, price, stock, categoryId } = result.data;
    const productEntity = Product.create(name, price, stock, categoryId);
    const product = await this.service.create(productEntity);

    return res.status(201).json({
      message: `cria um novo produto com nome ${product.name.getValue()} !`,
      product,
    });
  }

  async update(req: Request, res: Response) {
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
      bodyResult.data.categoryId,
    );

    const updatedProduct = await this.service.update(product);

    return res.json({
      message: `atualiza o produto com id ${paramsResult.data.id} para o nome ${bodyResult.data.name} !`,
      product: updatedProduct,
    });
  }

  async delete(req: Request, res: Response) {
    const result = productParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    await this.service.delete(result.data.id);

    return res.status(204).send();
  }
}
