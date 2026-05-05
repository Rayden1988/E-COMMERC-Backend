import { type Request, type Response } from "express";
import {
  createCategorySchema,
  categoryParamsSchema,
} from "../schemas/category.schemas.js";

export class CategoryController {
  findAll(req: Request, res: Response) {
    return res.json({
      message: "Listando categorias",
    });
  }

  findById(req: Request, res: Response) {
    const result = categoryParamsSchema.safeParse(req.params);

    console.log(result);

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
      message: `Criar uma nova categoria com o nome ${result.data.description}`,
      category: result.data,
    });
  }

  update(req: Request, res: Response) {
    // Aqui vai ter no banco de dados
    const result = categoryParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const category = null;

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(201).json(category);
  }

  delete(req: Request, res: Response) {
    const result = categoryParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res
        .status(400)
        .json({ error: result.error.flatten().fieldErrors });
    }
  }
}
