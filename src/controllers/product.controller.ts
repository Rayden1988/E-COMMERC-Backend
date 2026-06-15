// Controller das rotas de produto.
import { type Request, type Response } from "express";
import {
  createProductSchema,
  productParamsSchema,
  productQueryPaginationSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";
import {
  CreateProductDto,
  UpdateProductDto,
} from "../dto/product.dto.js";
import { AppError } from "../errors/app-error.js";
import type { ProductService } from "../services/product.services.js";

export class ProductController {
  constructor(private service: ProductService) {}

  async findAll(req: Request, res: Response) {
    const result = productQueryPaginationSchema.safeParse(req.query);

    if (!result.success) {
      throw new AppError("Invalid Params", 400, result.error.flatten());
    }

    const products = await this.service.getAll(result.data);

    return res.json(products);
  }

  async findById(req: Request, res: Response) {
    const result = productParamsSchema.safeParse(req.params);

    if (!result.success) {
      throw new AppError("Invalid Params", 400, result.error.flatten());
    }

    const product = await this.service.getById(result.data.id);

    return res.json(product);
  }

  async create(req: Request, res: Response) {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid Params", 400, result.error.flatten());
    }

    const product = await this.service.create(CreateProductDto.create(result.data));

    return res.status(201).json(product);
  }

  async update(req: Request, res: Response) {
    const result = productParamsSchema.safeParse(req.params);

    if (!result.success) {
      throw new AppError("Invalid Params", 400, result.error.flatten());
    }

    const resultBody = updateProductSchema.safeParse(req.body);

    if (!resultBody.success) {
      throw new AppError("Invalid Params", 400, resultBody.error.flatten());
    }

    const dtoUpdate = {
      id: result.data.id,
      ...UpdateProductDto.create(resultBody.data),
    };

    const productUpdated = await this.service.update(dtoUpdate);

    return res.status(201).json(productUpdated);
  }

  async delete(req: Request, res: Response) {
    const result = productParamsSchema.safeParse(req.params);

    if (!result.success) {
      throw new AppError("Invalid Params", 400, result.error.flatten());
    }

    await this.service.delete(result.data.id);

    return res.status(204).send();
  }
}
