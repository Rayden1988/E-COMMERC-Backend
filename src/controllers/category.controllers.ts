import { type Request, type Response } from "express";
import {
  createCategorySchema,
  categoryParamsSchema,
  categoryQueryPaginationSchema,
} from "../schemas/category.schemas.js";

export class CategoryController {
  findAll(req: Request, res: Response) {
    const result = categoryQueryPaginationSchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    return res.json({
      message: "Listando categorias",
      pagination: result.data,
    });
  }

  findById(req: Request, res: Response) {
    const result = categoryParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    return res.json({
      message: `retornar a categoria com id ${result.data.id}`,
    });
  }

  create(req: Request, res: Response) {
    const result = createCategorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    return res.status(201).json({
      message: `Criar uma nova categoria com o nome ${result.data.name}`,
      category: result.data,
    });
  }

  update(req: Request, res: Response) {
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

    return res.json({
      message: `Categoria ${paramsResult.data.id} atualizada com sucesso`,
      category: bodyResult.data,
    });
  }

  delete(req: Request, res: Response) {
    const result = categoryParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    return res.status(204).send();
  }
}
