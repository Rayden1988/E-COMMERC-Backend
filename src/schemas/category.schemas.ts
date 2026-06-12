import { z } from "zod";

// Schema para criar categoria
const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters " })
    .max(100, { message: "name must be less than 100 characters" }),
});

const updateCategorySchema = createCategorySchema;

// Schema para paginação da listagem de categorias
const categoryQueryPaginationSchema = z.object({
  page: z.coerce.number().int().min(0, {
    message: "page must be a non-negative number",
  }),
  size: z.coerce.number().int().positive({
    message: "size must be a positive number",
  }),
});

// Schema para validar o id recebido na rota
const categoryParamsSchema = z.object({
  id: z.string().uuid("invalid category ID format"),
});

export {
  createCategorySchema,
  categoryParamsSchema,
  categoryQueryPaginationSchema,
  updateCategorySchema,
};
