import { type Request, type Response } from "express";

export class ProductController {
  create(req: Request, res: Response) {
    return res.status(201).json({
      message: "Produto criado com sucesso",
      product: req.body,
    });
  }

  findAll(req: Request, res: Response) {
    const { category } = req.query;

    return res.json({
      message: "Listando produtos",
      category,
    });
  }

  delete(req: Request, res: Response) {
    return res.status(204).send();
  }

  findById(req: Request, res: Response) {
    return res.json({
      message: `Produto encontrado com id ${req.params.id}`,
    });
  }
}
