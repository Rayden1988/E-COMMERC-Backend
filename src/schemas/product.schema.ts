// Schemas Zod para produtos.
import { z } from "zod";

// Valida os dados para criar um produto
const createProductSchema = z.object({
  // nome do produto
  name: z.string().min(3, { message: "name must be at least 3 characters" }),

  // preço do produto, converte para número se vier como string
  price: z.coerce.number().positive({
    message: "price must be a positive number",
  }),

  // quantidade em estoque, não pode ser negativa
  stock: z.coerce.number().min(0, {
    message: "stock must be a non-negative number",
  }),

  // id da categoria vinculada ao produto
  categoryId: z.string().uuid("invalid category ID format"),
});

const updateProductSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "name must be at least 3 characters" })
      .optional(),
    price: z
      .coerce.number()
      .positive({
        message: "price must be a positive number",
      })
      .optional(),
    stock: z
      .coerce.number()
      .min(0, {
        message: "stock must be a non-negative number",
      })
      .optional(),
    categoryId: z.string().uuid("invalid category ID format").optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.price !== undefined ||
      data.stock !== undefined ||
      data.categoryId !== undefined,
    {
      message: "at least one field must be informed",
    },
  );

// Valida um filtro opcional por categoria
const productQuerySchema = z.object({
  // categoria que vai filtrar os produtos
  categoryId: z.string().uuid("invalid category ID format").optional(),
});

// Valida a paginação da listagem
const productQueryPaginationSchema = z.object({
  // página atual
  page: z.coerce.number().int().min(0, {
    message: "page must be a non-negative number",
  }),

  // quantidade de itens por página
  size: z.coerce.number().int().positive({
    message: "size must be a positive number",
  }),
});

// Valida o id que vem na rota do produto
const productParamsSchema = z.object({
  // id do produto
  id: z.string().uuid("invalid product ID format"),
});

export {
  createProductSchema,
  productParamsSchema,
  productQueryPaginationSchema,
  productQuerySchema,
  updateProductSchema,
};
