import { Router, type Request, type Response } from "express";

const ordersRouter = Router();

// Cria um pedido
ordersRouter.post("/orders", (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Body vazio",
    });
  }

  const { customerName, products } = req.body;

  return res.status(201).json({
    customerName,
    products,
  });
});

// Atualiza o status de um pedido
ordersRouter.patch("/orders/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { status } = req.body;

  return res.json({
    message: `Pedido ${id} atualizado para status ${status}`,
  });
});

// Remove um pedido
ordersRouter.delete("/orders/:id", (req: Request, res: Response) => {
  return res.status(204).send();
});

export { ordersRouter };
