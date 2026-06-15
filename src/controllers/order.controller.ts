// Controller das rotas de pedido.
import type { Request, Response } from "express";
import {
  createOrderSchema,
  orderParamsSchema,
  orderQueryPaginationSchema,
  updateOrderSchema,
} from "../schemas/order.schema.js";
import { AppError } from "../errors/app-error.js";
import type { OrderService } from "../services/order.service.js";

export class OrderController {
  constructor(private service: OrderService) {}

  async create(req: Request, res: Response) {
    const result = createOrderSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid Params", 400, result.error.flatten());
    }

    const order = await this.service.create(result.data);

    return res.status(201).json(order);
  }

  async findAll(req: Request, res: Response) {
    const result = orderQueryPaginationSchema.safeParse(req.query);

    if (!result.success) {
      throw new AppError("Invalid Params", 400, result.error.flatten());
    }

    const orders = await this.service.getAll(result.data);

    return res.json(orders);
  }

  async findById(req: Request, res: Response) {
    const result = orderParamsSchema.safeParse(req.params);

    if (!result.success) {
      throw new AppError("Invalid Params", 400, result.error.flatten());
    }

    const order = await this.service.getById(result.data.id);

    return res.json(order);
  }

  async update(req: Request, res: Response) {
    const paramsResult = orderParamsSchema.safeParse(req.params);

    if (!paramsResult.success) {
      throw new AppError("Invalid Params", 400, paramsResult.error.flatten());
    }

    const bodyResult = updateOrderSchema.safeParse(req.body);

    if (!bodyResult.success) {
      throw new AppError("Invalid Params", 400, bodyResult.error.flatten());
    }

    const order = await this.service.update(paramsResult.data.id, bodyResult.data);

    return res.json(order);
  }

  async delete(req: Request, res: Response) {
    const result = orderParamsSchema.safeParse(req.params);

    if (!result.success) {
      throw new AppError("Invalid Params", 400, result.error.flatten());
    }

    await this.service.delete(result.data.id);

    return res.status(204).send();
  }
}
