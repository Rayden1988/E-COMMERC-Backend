import { z } from "zod";

// Schema para criar produto
const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters" }),
  price: z.coerce.number().positive({
    message: "price must be a positive number",
  }),
  stock: z.coerce.number().min(0, {
    message: "stock must be a non-negative number",
  }),
  categoryId: z.string().uuid("invalid category ID format"),
});

// Schema para filtrar produtos por categoria
const productQuerySchema = z.object({
  category: z.string().uuid("invalid category ID format").optional(),
});

// Schema para paginação da listagem de produtos
const productQueryPaginationSchema = z.object({
  page: z.coerce.number().int().min(0, {
    message: "page must be a non-negative number",
  }),
  size: z.coerce.number().int().positive({
    message: "size must be a positive number",
  }),
});

// Schema para validar o id do produto na rota
const productParamsSchema = z.object({
  id: z.string().uuid("invalid product ID format"),
});

export {
  createProductSchema,
  productParamsSchema,
  productQueryPaginationSchema,
  productQuerySchema,
};
