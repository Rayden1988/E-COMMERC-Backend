import { Router } from "express";
import { pool } from "../database/connection.js";
import { CategoryController } from "../controllers/category.controller.js";
import { CategoryPgRepository } from "../repository/pg/category.repository.js";
import { CategoryService } from "../services/category.services.js";
import { authMiddleware, authorize } from "../middlewares/auth.middleware.js";

const router = Router();
const categoryRepository = new CategoryPgRepository(pool);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);
const handle =
  (fn: (req: any, res: any) => Promise<any>) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res)).catch(next);

router.get("/", handle((req, res) => categoryController.findAll(req, res)));
router.get("/:id", handle((req, res) => categoryController.findById(req, res)));
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  handle((req, res) => categoryController.create(req, res)),
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin"),
  handle((req, res) => categoryController.update(req, res)),
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  handle((req, res) => categoryController.delete(req, res)),
);

export { router as categoryRoute };
