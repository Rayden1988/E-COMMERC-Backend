import { Router } from "express";
import { CategoryController } from "../controllers/category.controllers.js";

const router = Router();
const categoryController = new CategoryController();

router.get("/", categoryController.findAll); //lista de todas as categorias
router.get("/:id", categoryController.findById); //listar uma categoria por id
router.post("/", categoryController.create); //criar uma nova categoria
router.put("/:id", categoryController.update); //atualizar uma categoria
router.delete("/:id", categoryController.delete); //excluir uma categoria por id

export { router as categoryRoute };
