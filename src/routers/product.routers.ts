// Rotas de produto com protecao de admin.
import { Router } from "express";

import { pool } from "../database/connection.js";
import { ProductPgRepository } from "../repository/pg/product.repository.js";
import { ProductController } from "../controllers/product.controller.js";
import { ProductService } from "../services/product.services.js";
import { CategoryPgRepository } from "../repository/pg/category.repository.js";
import { authMiddleware } from "../middlewares/authenticated.middleware.js";
import { authorize } from "../middlewares/authorization.middleware.js";

const router = Router();

// Instâncias das classes responsáveis pela regra de negócio
const productRepository = new ProductPgRepository(pool);
const categoryRepository = new CategoryPgRepository(pool);
const productService = new ProductService(
  productRepository,
  categoryRepository,
);
const productController = new ProductController(productService);

// Lista todos os produtos
router.get("/", (req, res) => productController.findAll(req, res));

// Busca um produto pelo id
router.get("/:id", (req, res) => productController.findById(req, res));

// Cria um novo produto
// precisa estar autenticado e ter papel de admin
router.post("/", authMiddleware, authorize("admin"), (req, res) =>
  productController.create(req, res),
);

// Atualiza um produto existente
// precisa estar autenticado e ter papel de admin
router.put("/:id", authMiddleware, authorize("admin"), (req, res) =>
  productController.update(req, res),
);

// Remove um produto pelo id
// precisa estar autenticado e ter papel de admin
router.delete("/:id", authMiddleware, authorize("admin"), (req, res) =>
  productController.delete(req, res),
);

export { router as productRouter };
