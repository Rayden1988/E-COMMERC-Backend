import { Router } from "express";

import { pool } from "../database/connection.js";
import { CategoryController } from "../controllers/category.controller.js";
import { CategoryPgRepository } from "../repository/pg/category.repository.js";
import { CategoryService } from "../services/category.services.js";

const router = Router();
const categoryRepository = new CategoryPgRepository(pool);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(
  categoryRepository,
  categoryService,
);

router.get("/", (req, res) => categoryController.findAll(req, res)); // lista todas as categorias
router.get("/:id", (req, res) => categoryController.findById(req, res)); // busca uma categoria por id
router.post("/", (req, res) => categoryController.create(req, res)); // cria uma nova categoria
router.put("/:id", (req, res) => categoryController.update(req, res)); // atualiza uma categoria
router.delete("/:id", (req, res) => categoryController.delete(req, res)); // remove uma categoria

export { router as categoryRoute };
