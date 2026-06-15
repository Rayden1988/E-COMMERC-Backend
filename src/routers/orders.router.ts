// Rotas de pedido protegidas por autenticao.
import { Router } from "express";
import { pool } from "../database/connection.js";
import { authMiddleware } from "../middlewares/authenticated.middleware.js";
import { OrderController } from "../controllers/order.controller.js";
import { OrderService } from "../services/order.service.js";
import { OrderPgRepository } from "../repository/pg/order.repository.js";

const router = Router();

const orderRepository = new OrderPgRepository(pool);
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

router.get("/", authMiddleware, (req, res) => orderController.findAll(req, res));
router.get("/:id", authMiddleware, (req, res) =>
  orderController.findById(req, res),
);
router.post("/", authMiddleware, (req, res) => orderController.create(req, res));
router.patch("/:id", authMiddleware, (req, res) =>
  orderController.update(req, res),
);
router.delete("/:id", authMiddleware, (req, res) =>
  orderController.delete(req, res),
);

export { router as orderRouter };
