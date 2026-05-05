import { Router } from "express";
import { ProductController } from "../controllers/product.controllers.js";
import {
  createProductSchema,
  productParamsSchema,
  productQuerySchema,
} from "../schemas/product.schema.js";
import { validateData } from "../middlewares/validateData.js";

const productsRouter = Router();
const productController = new ProductController();

productsRouter.get(
  "/products",
  validateData(productQuerySchema, "query"),
  productController.findAll,
);

productsRouter.post(
  "/products",
  validateData(createProductSchema, "body"),
  productController.create,
);

productsRouter.get("/products/:id", validateData(productParamsSchema, "params"), productController.findById);

productsRouter.delete(
  "/products/:id",
  validateData(productParamsSchema, "params"),
  productController.delete,
);

export { productsRouter };
