import { type Request, type Response } from "express";
import {
  createCategorySchema,
  categoryParamsSchema,
  categoryQueryPaginationSchema,
} from "../schemas/category.schemas.js";
import { pool } from "../database/connection.js";
import { CategoryPgRepository } from "../repository/pg/category.repository.js";

const categoryRepository = new CategoryPgRepository(pool);

// Controller responsável pelas rotas de categoria
export class CategoryController {
  async findAll(req: Request, res: Response) {
    // Valida os parâmetros de paginação
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

  async findById(req: Request, res: Response) {
    // Valida o id recebido na rota
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

  async create(req: Request, res: Response) {
    // Valida os dados enviados no body
    const result = createCategorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    // Persiste a categoria no banco
    const category = await categoryRepository.createCategory(result.data.name);

    return res.status(201).json({
      message: `Criar uma nova categoria com o nome ${result.data.name}`,
      category,
    });
  }

  async update(req: Request, res: Response) {
    // Valida o id da rota e o body
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

  async delete(req: Request, res: Response) {
    // Valida o id antes de excluir
    const result = categoryParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    return res.status(204).send();
  }
}
