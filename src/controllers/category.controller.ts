import { type Request, type Response } from "express";
import {
  createCategorySchema,
  categoryParamsSchema,
  categoryQueryPaginationSchema,
} from "../schemas/category.schemas.js";
import type { CategoryRepository } from "../repository/interfaces/category.repository.js";
import { CategoryService } from "../services/category.services.js";

export class CategoryController {
  constructor(
    private repository: CategoryRepository,
    private service: CategoryService,
  ) {}

  async findAll(req: Request, res: Response) {
    const result = categoryQueryPaginationSchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const categories = await this.service.getAll(result.data);

    return res.json(categories);
  }

  async findById(req: Request, res: Response) {
    const result = categoryParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const category = await this.service.getById(result.data.id);

    return res.json(category);
  }

  async create(req: Request, res: Response) {
    const result = createCategorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const category = await this.service.create(result.data);

    return res.status(201).json(category);
  }

  async update(req: Request, res: Response) {
    const paramsResult = categoryParamsSchema.safeParse(req.params);
    const bodyResult = createCategorySchema.safeParse(req.body);

    if (!paramsResult.success) {
      return res.status(400).json({
        error: paramsResult.error.flatten(),
      });
    }

    if (!bodyResult.success) {
      return res.status(400).json({
        error: bodyResult.error.flatten(),
      });
    }

    const dtoUpdate = {
      id: paramsResult.data.id as string,
      name: bodyResult.data.name as string,
    };

    const categoryUpdated = await this.service.update(dtoUpdate);

    return res.status(201).json(categoryUpdated);
  }

  async delete(req: Request, res: Response) {
    const result = categoryParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    await this.service.delete(result.data.id);

    return res.status(204).send();
  }
}
