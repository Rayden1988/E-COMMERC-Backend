import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { pool } from "../database/connection.js";
import { CategoryPgRepository } from "../repository/pg/category.repository.js";
import { CategoryService } from "../services/category.services.js";
import { authMiddleware } from "../middlewares/authenticated.middleware.js";
import { authorize } from "../middlewares/authorization.middleware.js";

const router = Router();

const categoryRepository = new CategoryPgRepository(pool);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.get("/", (req, res) => categoryController.findAll(req, res)); // listar todas as categorias
router.get("/:id", (req, res) => categoryController.findById(req, res)); // listar uma categoria por id

router.post("/", authMiddleware, authorize("admin"), (req, res) =>
  categoryController.create(req, res),
); // criar categoria

router.put("/:id", authMiddleware, authorize("admin"), (req, res) =>
  categoryController.update(req, res),
); // atualizar categoria

router.delete("/:id", authMiddleware, authorize("admin"), (req, res) =>
  categoryController.delete(req, res),
); // deletar categoria por id

export { router as categoryRouter };
