import { Router } from "express";

import { pool } from "../database/connection.js";
import { ProductController } from "../controllers/product.controller.js";
import { ProductPgRepository } from "../repository/pg/product.repository.js";
import { ProductService } from "../services/product.services.js";
import { CategoryPgRepository } from "../repository/pg/category.repository.js";
import { authMiddleware, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

const productRepository = new ProductPgRepository(pool);
const categoryRepository = new CategoryPgRepository(pool);
const productService = new ProductService(productRepository, categoryRepository);
const productController = new ProductController(productService);
const handle =
  (fn: (req: any, res: any) => Promise<any>) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res)).catch(next);

router.get("/", handle((req, res) => productController.findAll(req, res)));
router.get("/:id", handle((req, res) => productController.findById(req, res)));
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  handle((req, res) => productController.create(req, res)),
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin"),
  handle((req, res) => productController.update(req, res)),
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  handle((req, res) => productController.delete(req, res)),
);

export { router as productRouter };
