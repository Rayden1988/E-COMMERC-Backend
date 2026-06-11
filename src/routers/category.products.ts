import { Router } from "express";
import { pool } from "../database/connection.js";
import { ProductController } from "../controllers/product.controllers.js";
import {
  createProductSchema,
  productParamsSchema,
  productQueryPaginationSchema,
} from "../schemas/product.schema.js";
import { validateData } from "../middlewares/validateData.js";
import { ProductPgRepository } from "../repository/pg/product.repository.js";

// Rotas de produto
const productsRouter = Router();
const productRepository = new ProductPgRepository(pool);
const productController = new ProductController(productRepository);

// Lista produtos com validação de query
productsRouter.get(
  "/product",
  validateData(productQueryPaginationSchema, "query"),
  productController.findAll,
);

// Cria um produto com validação de body
productsRouter.post(
  "/product",
  validateData(createProductSchema, "body"),
  productController.create,
);

// Busca produto por id
productsRouter.get(
  "/product/:id",
  validateData(productParamsSchema, "params"),
  productController.findById,
);

// Remove produto por id
productsRouter.delete(
  "/product/:id",
  validateData(productParamsSchema, "params"),
  productController.delete,
);

export { productsRouter };
