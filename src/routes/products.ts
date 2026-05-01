import { Router, type Request, type Response } from "express";

const productsRouter = Router();

productsRouter.get("/products", (req: Request, res: Response) => {
  const { category } = req.query;

  return res.json({
    message: "Listando produtos",
    category,
  });
});

productsRouter.get("/products/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || id < 0) {
    return res.status(400).json({
      error: "ID invalido",
    });
  }

  return res.json({
    message: `Produto encontrado com id ${id}`,
  });
});

export default productsRouter;
