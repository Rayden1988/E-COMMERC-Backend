import { Router } from "express";

import { pool } from "../database/connection.js";

import { ProductPgRepository } from "../repository/pg/product.repository.js";
import { ProductController } from "../controllers/product.controller.js";
import { ProductService } from "../services/product.services.js";
import { CategoryPgRepository } from "../repository/pg/category.repository.js";

const router = Router();

const productRepository = new ProductPgRepository(pool);
const categoryRepository = new CategoryPgRepository(pool);
const productService = new ProductService(
  productRepository,
  categoryRepository,
);
const productController = new ProductController(
  productRepository,
  productService,
);

router.get("/", (req, res) => productController.findAll(req, res)); // listar todos os produtos
router.get("/:id", (req, res) => productController.findById(req, res)); // listar um produto por id
router.post("/", (req, res) => productController.create(req, res)); // criar um novo produto
router.put("/:id", (req, res) => productController.update(req, res)); // atualizar um produto existente
router.delete("/:id", (req, res) => productController.delete(req, res)); // deletar um produto por id

export { router as productRouter, router as categoryRoute };
