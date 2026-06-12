import { type Request, type Response } from "express";
import {
  createCategorySchema,
  categoryParamsSchema,
  categoryQueryPaginationSchema,
} from "../schemas/category.schemas.js";
import {
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "../dto/category.dto.js";
import type { CategoryService } from "../services/category.services.js";

export class CategoryController {
  constructor(private service: CategoryService) {}

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

    const category = await this.service.create(CategoryCreateDTO.create(result.data));

    return res.status(201).json(category);
  }

  async update(req: Request, res: Response) {
    const result = categoryParamsSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const resultBody = createCategorySchema.safeParse(req.body);
    if (!resultBody.success) {
      return res.status(400).json({ error: resultBody.error.flatten() });
    }

    const dtoUpdate = {
      id: result.data.id,
      name: CategoryUpdateDTO.create(resultBody.data).name,
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
